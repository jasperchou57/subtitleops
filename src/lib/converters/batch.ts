import type { SubtitleFormat } from './detect-format';
import { detectFormat } from './detect-format';
import { checkSubtitleQuality, type QualityReport } from './quality';
import { universalConvert } from './universal';

export type BatchInputFile = {
  name: string;
  content: string;
};

export type BatchOutputFile = {
  originalName: string;
  outputName: string;
  inputFormat: SubtitleFormat;
  outputFormat: Exclude<SubtitleFormat, 'sbv'>;
  status: 'success';
  content: string;
  quality: QualityReport;
};

export type BatchFailedFile = {
  originalName: string;
  outputName: string;
  inputFormat: SubtitleFormat;
  outputFormat: Exclude<SubtitleFormat, 'sbv'>;
  status: 'failed';
  error: string;
  quality: null;
};

export type BatchFileResult = BatchOutputFile | BatchFailedFile;

function baseName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '');
}

export function renderBatchFileName(
  pattern: string,
  fileName: string,
  outputFormat: Exclude<SubtitleFormat, 'sbv'>,
  index: number
) {
  const rendered = pattern
    .replaceAll('{name}', baseName(fileName))
    .replaceAll('{ext}', outputFormat)
    .replaceAll('{index}', String(index + 1).padStart(3, '0'))
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  return rendered.toLowerCase().endsWith(`.${outputFormat}`)
    ? rendered
    : `${rendered}.${outputFormat}`;
}

export function processBatchFiles({
  files,
  outputFormat,
  fileNamePattern = '{name}.{ext}',
  fileLimit,
}: {
  files: BatchInputFile[];
  outputFormat: Exclude<SubtitleFormat, 'sbv'>;
  fileNamePattern?: string;
  fileLimit: number;
}): BatchFileResult[] {
  if (files.length === 0) throw new Error('Select at least one subtitle file');
  if (files.length > fileLimit) {
    throw new Error(`This plan supports up to ${fileLimit} files per batch`);
  }

  const usedNames = new Map<string, number>();

  return files.map((file, index) => {
    const inputFormat = detectFormat(file.content, file.name);
    let outputName = renderBatchFileName(
      fileNamePattern,
      file.name,
      outputFormat,
      index
    );
    const duplicateNumber = usedNames.get(outputName) ?? 0;
    usedNames.set(outputName, duplicateNumber + 1);
    if (duplicateNumber > 0) {
      outputName = outputName.replace(
        new RegExp(`\\.${outputFormat}$`),
        `-${duplicateNumber + 1}.${outputFormat}`
      );
    }

    try {
      const srtContent = universalConvert(file.content, inputFormat, 'srt');
      const content = universalConvert(file.content, inputFormat, outputFormat);
      return {
        originalName: file.name,
        outputName,
        inputFormat,
        outputFormat,
        status: 'success' as const,
        content,
        quality: checkSubtitleQuality(srtContent),
      };
    } catch (caught) {
      return {
        originalName: file.name,
        outputName,
        inputFormat,
        outputFormat,
        status: 'failed' as const,
        error: caught instanceof Error ? caught.message : 'Conversion failed',
        quality: null,
      };
    }
  });
}
