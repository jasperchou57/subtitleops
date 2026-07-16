import { DEFAULT_AVATARS_FOLDER } from './constants';

/**
 * Public folders – files in these folders are shared/public resources:
 * - Served without authentication
 * - No userFiles DB record
 *
 * Add new folder prefixes here when needed.
 */
export const PUBLIC_FOLDERS: readonly string[] = [
  DEFAULT_AVATARS_FOLDER,
] as const;

/**
 * Normalize a folder path into safe storage key segments.
 */
export function sanitizeFolder(folder?: string): string | undefined {
  if (!folder) return undefined;

  const segments = folder
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== '.' && segment !== '..');

  if (segments.length === 0) return undefined;

  return segments
    .map((segment) => segment.replace(/[^a-zA-Z0-9._-]/g, '-'))
    .join('/');
}

/**
 * Check if a folder is a public asset folder.
 */
export function isPublicFolder(folder?: string): boolean {
  const normalizedFolder = sanitizeFolder(folder);
  if (!normalizedFolder) return false;
  return PUBLIC_FOLDERS.some(
    (pf) => normalizedFolder === pf || normalizedFolder.startsWith(`${pf}/`)
  );
}
