import { getDb } from '@/db';
import { workspaceMembers, workspaces } from '@/db/app.schema';
import { user } from '@/db/auth.schema';
import { getUserEntitlement } from '@/lib/entitlements';
import { and, eq } from 'drizzle-orm';

export async function ensureUserWorkspace(userId: string) {
  const db = getDb();
  const [existing] = await db
    .select({ workspace: workspaces, member: workspaceMembers })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.status, 'active')
      )
    )
    .limit(1);

  if (existing) return existing;

  const [userRow] = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!userRow) throw new Error('User not found');

  const now = new Date();
  const workspaceId = crypto.randomUUID();
  const workspaceName = `${userRow.name || 'My'} workspace`;
  const slugBase = (userRow.name || 'workspace')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const workspace = {
    id: workspaceId,
    name: workspaceName,
    slug: `${slugBase || 'workspace'}-${workspaceId.slice(0, 8)}`,
    ownerId: userId,
    createdAt: now,
    updatedAt: now,
  };
  const member = {
    id: crypto.randomUUID(),
    workspaceId,
    userId,
    email: userRow.email.toLowerCase(),
    role: 'owner' as const,
    status: 'active' as const,
    inviteToken: null,
    invitedBy: userId,
    createdAt: now,
    updatedAt: now,
  };

  await db.batch([
    db.insert(workspaces).values(workspace),
    db.insert(workspaceMembers).values(member),
  ]);

  return { workspace, member };
}

export async function getWorkspaceAccess(userId: string, workspaceId: string) {
  const db = getDb();
  const [access] = await db
    .select({ workspace: workspaces, member: workspaceMembers })
    .from(workspaceMembers)
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .where(
      and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, userId),
        eq(workspaceMembers.status, 'active')
      )
    )
    .limit(1);

  if (!access) throw new Error('Workspace access denied');
  const entitlement = await getUserEntitlement(access.workspace.ownerId);
  return { ...access, entitlement };
}

export async function getDefaultWorkspaceAccess(userId: string) {
  const { workspace } = await ensureUserWorkspace(userId);
  return getWorkspaceAccess(userId, workspace.id);
}
