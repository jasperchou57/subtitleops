import { getDb } from '@/db';
import { workspaceMembers, workspaces } from '@/db/app.schema';
import { user } from '@/db/auth.schema';
import { getUserEntitlement } from '@/lib/entitlements';
import { getDefaultWorkspaceAccess, getWorkspaceAccess } from '@/lib/workspace';
import { Routes } from '@/lib/routes';
import { getCanonicalUrl } from '@/lib/urls';
import { sendEmail } from '@/mail';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, asc, count, eq } from 'drizzle-orm';
import { z } from 'zod';

const workspaceIdSchema = z.object({ workspaceId: z.string().min(1) });
const WORKSPACE_INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const getWorkspaceOverview = createServerFn({ method: 'GET' })
  .middleware([authApiMiddleware])
  .handler(async ({ context }) => {
    const access = await getDefaultWorkspaceAccess(context.userId);
    const members = await getDb()
      .select({
        id: workspaceMembers.id,
        email: workspaceMembers.email,
        role: workspaceMembers.role,
        status: workspaceMembers.status,
        createdAt: workspaceMembers.createdAt,
      })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, access.workspace.id))
      .orderBy(asc(workspaceMembers.createdAt));

    return { ...access, members };
  });

const renameWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
});

export const renameWorkspace = createServerFn({ method: 'POST' })
  .inputValidator(renameWorkspaceSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.member.role !== 'owner')
      throw new Error('Owner access required');

    const [workspace] = await getDb()
      .update(workspaces)
      .set({ name: data.name, updatedAt: new Date() })
      .where(eq(workspaces.id, data.workspaceId))
      .returning();
    return { workspace };
  });

const inviteMemberSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.email().transform((value) => value.toLowerCase()),
  role: z.enum(['editor', 'reviewer']),
});

export const inviteWorkspaceMember = createServerFn({ method: 'POST' })
  .inputValidator(inviteMemberSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.member.role !== 'owner')
      throw new Error('Owner access required');
    if (!access.entitlement.sharedWorkspace) {
      throw new Error('Studio plan required for team workspaces');
    }

    const db = getDb();
    const [seatCount] = await db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, data.workspaceId));
    if ((seatCount?.count ?? 0) >= access.entitlement.seatLimit) {
      throw new Error(
        `Studio includes ${access.entitlement.seatLimit} seats. Remove a member before inviting another.`
      );
    }

    const [existingMember] = await db
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, data.workspaceId),
          eq(workspaceMembers.email, data.email)
        )
      )
      .limit(1);
    if (existingMember) throw new Error('This email is already a member');

    const now = new Date();
    const inviteToken = crypto.randomUUID();
    const [member] = await db
      .insert(workspaceMembers)
      .values({
        id: crypto.randomUUID(),
        workspaceId: data.workspaceId,
        userId: null,
        email: data.email,
        role: data.role,
        status: 'invited',
        inviteToken,
        invitedBy: context.userId,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const inviteUrl = getCanonicalUrl(
      `${Routes.WorkspaceInvite}?token=${inviteToken}`
    );
    const emailResult = await sendEmail({
      to: data.email,
      template: 'workspaceInvitation',
      context: {
        url: inviteUrl,
        workspaceName: access.workspace.name,
        role: data.role,
      },
    });

    return {
      member,
      inviteToken,
      inviteUrl,
      emailSent: emailResult.success,
    };
  });

const memberMutationSchema = workspaceIdSchema.extend({
  memberId: z.string().min(1),
});

export const removeWorkspaceMember = createServerFn({ method: 'POST' })
  .inputValidator(memberMutationSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.member.role !== 'owner')
      throw new Error('Owner access required');

    const [member] = await getDb()
      .select({ role: workspaceMembers.role })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.id, data.memberId),
          eq(workspaceMembers.workspaceId, data.workspaceId)
        )
      )
      .limit(1);
    if (!member) throw new Error('Member not found');
    if (member.role === 'owner')
      throw new Error('The workspace owner cannot be removed');

    await getDb()
      .delete(workspaceMembers)
      .where(eq(workspaceMembers.id, data.memberId));
    return { success: true };
  });

const updateMemberRoleSchema = memberMutationSchema.extend({
  role: z.enum(['editor', 'reviewer']),
});

export const updateWorkspaceMemberRole = createServerFn({ method: 'POST' })
  .inputValidator(updateMemberRoleSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.member.role !== 'owner')
      throw new Error('Owner access required');
    if (!access.entitlement.sharedWorkspace) {
      throw new Error('Studio plan required for team workspaces');
    }

    const [member] = await getDb()
      .update(workspaceMembers)
      .set({ role: data.role, updatedAt: new Date() })
      .where(
        and(
          eq(workspaceMembers.id, data.memberId),
          eq(workspaceMembers.workspaceId, data.workspaceId)
        )
      )
      .returning();
    if (!member) throw new Error('Member not found');
    return { member };
  });

const acceptInviteSchema = z.object({ token: z.string().uuid() });

export const acceptWorkspaceInvite = createServerFn({ method: 'POST' })
  .inputValidator(acceptInviteSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const db = getDb();
    const [userRow] = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, context.userId))
      .limit(1);
    if (!userRow) throw new Error('User not found');

    const [member] = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.inviteToken, data.token))
      .limit(1);
    if (!member || member.status !== 'invited')
      throw new Error('Invite not found');
    if (member.email !== userRow.email.toLowerCase()) {
      throw new Error('This invite belongs to another email address');
    }
    if (Date.now() - member.createdAt.getTime() > WORKSPACE_INVITE_TTL_MS) {
      await db
        .delete(workspaceMembers)
        .where(
          and(
            eq(workspaceMembers.id, member.id),
            eq(workspaceMembers.status, 'invited')
          )
        );
      throw new Error('This invitation has expired');
    }

    const [workspace] = await db
      .select({ ownerId: workspaces.ownerId })
      .from(workspaces)
      .where(eq(workspaces.id, member.workspaceId))
      .limit(1);
    if (!workspace) throw new Error('Workspace not found');

    const entitlement = await getUserEntitlement(workspace.ownerId);
    if (!entitlement.sharedWorkspace) {
      throw new Error(
        'The workspace owner needs an active Studio plan before this invitation can be accepted'
      );
    }
    const [seatCount] = await db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, member.workspaceId));
    if ((seatCount?.count ?? 0) > entitlement.seatLimit) {
      throw new Error(
        `This workspace has reached its ${entitlement.seatLimit}-seat limit`
      );
    }

    const [accepted] = await db
      .update(workspaceMembers)
      .set({
        userId: context.userId,
        status: 'active',
        inviteToken: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workspaceMembers.id, member.id),
          eq(workspaceMembers.status, 'invited'),
          eq(workspaceMembers.inviteToken, data.token)
        )
      )
      .returning();
    if (!accepted) throw new Error('Invite not found');
    return { member: accepted };
  });
