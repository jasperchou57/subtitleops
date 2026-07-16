import { getDb } from '@/db';
import {
  conversionPresets,
  conversionProjects,
  type ProjectStatus,
  projectVersions,
  userFiles,
} from '@/db/app.schema';
import { getWorkspaceAccess } from '@/lib/workspace';
import { authApiMiddleware } from '@/middlewares/auth-middleware';
import { createServerFn } from '@tanstack/react-start';
import { and, asc, desc, eq, gt } from 'drizzle-orm';
import { z } from 'zod';

const outputFormatSchema = z.enum(['srt', 'ass', 'vtt', 'txt']);

const workspaceIdSchema = z.object({ workspaceId: z.string().min(1) });

export const listConversionPresets = createServerFn({ method: 'GET' })
  .inputValidator(workspaceIdSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (!access.entitlement.savedPresets) throw new Error('Pro plan required');

    const presets = await getDb()
      .select()
      .from(conversionPresets)
      .where(eq(conversionPresets.workspaceId, data.workspaceId))
      .orderBy(asc(conversionPresets.name));
    return { presets };
  });

const savePresetSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().trim().min(2).max(60),
  outputFormat: outputFormatSchema,
  fileNamePattern: z.string().trim().min(3).max(100),
  settings: z.record(z.string(), z.unknown()).default({}),
  shared: z.boolean().default(false),
});

export const saveConversionPreset = createServerFn({ method: 'POST' })
  .inputValidator(savePresetSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (!access.entitlement.savedPresets) throw new Error('Pro plan required');
    if (data.shared && !access.entitlement.sharedWorkspace) {
      throw new Error('Studio plan required for shared presets');
    }

    const now = new Date();
    const [preset] = await getDb()
      .insert(conversionPresets)
      .values({
        id: crypto.randomUUID(),
        workspaceId: data.workspaceId,
        createdBy: context.userId,
        name: data.name,
        outputFormat: data.outputFormat,
        fileNamePattern: data.fileNamePattern,
        settings: JSON.stringify(data.settings),
        shared: data.shared,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return { preset };
  });

const deletePresetSchema = z.object({
  workspaceId: z.string().min(1),
  presetId: z.string().min(1),
});

export const deleteConversionPreset = createServerFn({ method: 'POST' })
  .inputValidator(deletePresetSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    const [preset] = await getDb()
      .select({ createdBy: conversionPresets.createdBy })
      .from(conversionPresets)
      .where(
        and(
          eq(conversionPresets.id, data.presetId),
          eq(conversionPresets.workspaceId, data.workspaceId)
        )
      )
      .limit(1);
    if (!preset) throw new Error('Preset not found');
    if (preset.createdBy !== context.userId && access.member.role !== 'owner') {
      throw new Error('Preset access denied');
    }
    await getDb()
      .delete(conversionPresets)
      .where(eq(conversionPresets.id, data.presetId));
    return { success: true };
  });

export const listConversionProjects = createServerFn({ method: 'GET' })
  .inputValidator(workspaceIdSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.entitlement.historyDays === 0)
      throw new Error('Pro plan required');

    const rows = await getDb()
      .select({ project: conversionProjects, archiveKey: userFiles.r2Key })
      .from(conversionProjects)
      .leftJoin(userFiles, eq(conversionProjects.archiveFileId, userFiles.id))
      .where(
        and(
          eq(conversionProjects.workspaceId, data.workspaceId),
          gt(conversionProjects.retentionUntil, new Date())
        )
      )
      .orderBy(desc(conversionProjects.createdAt))
      .limit(100);
    const projects = rows.map(({ project, archiveKey }) => ({
      ...project,
      archiveUrl: archiveKey
        ? `/api/storage/file?key=${encodeURIComponent(archiveKey)}`
        : null,
    }));
    return { projects };
  });

const projectManifestItemSchema = z.object({
  originalName: z.string().max(255),
  outputName: z.string().max(255),
  inputFormat: z.string().max(12),
  outputFormat: outputFormatSchema,
  status: z.enum(['success', 'failed']),
  issues: z.array(z.string().max(200)).max(50),
});

const createProjectSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  outputFormat: outputFormatSchema,
  manifest: z.array(projectManifestItemSchema).min(1).max(500),
  archiveFileId: z.string().nullable().optional(),
});

export const createConversionProject = createServerFn({ method: 'POST' })
  .inputValidator(createProjectSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (access.entitlement.historyDays === 0)
      throw new Error('Pro plan required');
    if (data.manifest.length > access.entitlement.batchFileLimit) {
      throw new Error(
        `${access.entitlement.planId} supports up to ${access.entitlement.batchFileLimit} files per batch`
      );
    }

    if (data.archiveFileId) {
      const [archive] = await getDb()
        .select({ id: userFiles.id })
        .from(userFiles)
        .where(
          and(
            eq(userFiles.id, data.archiveFileId),
            eq(userFiles.userId, context.userId)
          )
        )
        .limit(1);
      if (!archive) throw new Error('Archive file not found');
    }

    const successCount = data.manifest.filter(
      (item) => item.status === 'success'
    ).length;
    const failedCount = data.manifest.length - successCount;
    const issueCount = data.manifest.reduce(
      (total, item) => total + item.issues.length,
      0
    );
    const now = new Date();
    const retentionUntil = new Date(
      now.getTime() + access.entitlement.historyDays * 24 * 60 * 60 * 1000
    );
    const projectId = crypto.randomUUID();
    const manifest = JSON.stringify(data.manifest);
    const projectStatus: ProjectStatus =
      failedCount > 0 ? 'needs_review' : 'ready';
    const project = {
      id: projectId,
      workspaceId: data.workspaceId,
      createdBy: context.userId,
      name: data.name,
      status: projectStatus,
      outputFormat: data.outputFormat,
      fileCount: data.manifest.length,
      successCount,
      failedCount,
      issueCount,
      manifest,
      archiveFileId: data.archiveFileId ?? null,
      retentionUntil,
      createdAt: now,
      updatedAt: now,
    };

    const db = getDb();
    await db.batch([
      db.insert(conversionProjects).values(project),
      db.insert(projectVersions).values({
        id: crypto.randomUUID(),
        projectId,
        createdBy: context.userId,
        version: 1,
        status: project.status,
        note: 'Initial batch conversion',
        manifest,
        createdAt: now,
      }),
    ]);
    return { project };
  });

const reviewProjectSchema = z.object({
  workspaceId: z.string().min(1),
  projectId: z.string().min(1),
  status: z.enum(['needs_review', 'approved']),
  note: z.string().trim().max(500).optional(),
});

export const reviewConversionProject = createServerFn({ method: 'POST' })
  .inputValidator(reviewProjectSchema)
  .middleware([authApiMiddleware])
  .handler(async ({ data, context }) => {
    const access = await getWorkspaceAccess(context.userId, data.workspaceId);
    if (!access.entitlement.reviewWorkflow) {
      throw new Error('Studio plan required for review workflows');
    }
    if (data.status === 'approved' && access.member.role === 'editor') {
      throw new Error('Reviewer or owner access required');
    }

    const db = getDb();
    const [project] = await db
      .select()
      .from(conversionProjects)
      .where(
        and(
          eq(conversionProjects.id, data.projectId),
          eq(conversionProjects.workspaceId, data.workspaceId)
        )
      )
      .limit(1);
    if (!project) throw new Error('Project not found');

    const versions = await db
      .select({ version: projectVersions.version })
      .from(projectVersions)
      .where(eq(projectVersions.projectId, project.id))
      .orderBy(desc(projectVersions.version))
      .limit(1);
    const nextVersion = (versions[0]?.version ?? 0) + 1;
    const now = new Date();

    await db.batch([
      db
        .update(conversionProjects)
        .set({ status: data.status, updatedAt: now })
        .where(eq(conversionProjects.id, project.id)),
      db.insert(projectVersions).values({
        id: crypto.randomUUID(),
        projectId: project.id,
        createdBy: context.userId,
        version: nextVersion,
        status: data.status,
        note: data.note ?? null,
        manifest: project.manifest,
        createdAt: now,
      }),
    ]);
    return { status: data.status, version: nextVersion };
  });
