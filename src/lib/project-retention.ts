import { getDb } from '@/db';
import { conversionProjects, userFiles } from '@/db/app.schema';
import { deleteFile } from '@/storage';
import { eq, lte } from 'drizzle-orm';

export async function purgeExpiredProjects(now = new Date()) {
  const db = getDb();
  const expired = await db
    .select({
      projectId: conversionProjects.id,
      archiveFileId: conversionProjects.archiveFileId,
      archiveKey: userFiles.r2Key,
    })
    .from(conversionProjects)
    .leftJoin(userFiles, eq(conversionProjects.archiveFileId, userFiles.id))
    .where(lte(conversionProjects.retentionUntil, now));

  let deleted = 0;
  for (const project of expired) {
    try {
      if (project.archiveKey) await deleteFile(project.archiveKey);
      await db
        .delete(conversionProjects)
        .where(eq(conversionProjects.id, project.projectId));
      if (project.archiveFileId) {
        await db
          .delete(userFiles)
          .where(eq(userFiles.id, project.archiveFileId));
      }
      deleted += 1;
    } catch (error) {
      console.error(
        'Failed to purge expired project',
        project.projectId,
        error
      );
    }
  }

  return { deleted };
}
