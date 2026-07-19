import type { BatchFileResult } from '@/lib/converters/batch';
import { strToU8, zipSync } from 'fflate';

export function createBatchZip(results: BatchFileResult[]) {
  const entries = Object.fromEntries(
    results
      .filter((result) => result.status === 'success')
      .map((result) => [result.outputName, strToU8(result.content)])
  );
  if (Object.keys(entries).length === 0) {
    throw new Error('No successful files to add to the ZIP archive');
  }
  return zipSync(entries, { level: 6 });
}

export function downloadBatchZip(
  results: BatchFileResult[],
  archiveName = 'subtitleops-batch.zip'
) {
  const zip = createBatchZip(results);
  const blob = new Blob([zip], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = archiveName.endsWith('.zip')
    ? archiveName
    : `${archiveName}.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}
