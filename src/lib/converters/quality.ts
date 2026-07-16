export type QualityIssueSeverity = 'warning' | 'error';

export type QualityIssue = {
  code:
    | 'invalid_timestamp'
    | 'end_before_start'
    | 'overlap'
    | 'empty_cue'
    | 'very_short_cue'
    | 'very_long_cue'
    | 'long_line'
    | 'high_reading_speed';
  severity: QualityIssueSeverity;
  cue: number;
  message: string;
};

export type QualityReport = {
  cueCount: number;
  errorCount: number;
  warningCount: number;
  issues: QualityIssue[];
};

const TIMESTAMP_PATTERN =
  /^(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/;

function timestampToMilliseconds(parts: string[]) {
  const [hours, minutes, seconds, milliseconds] = parts.map(Number);
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + milliseconds;
}

export function checkSubtitleQuality(srtContent: string): QualityReport {
  const blocks = srtContent
    .replace(/^\uFEFF/, '')
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean);
  const issues: QualityIssue[] = [];
  let cueCount = 0;
  let previousEnd: number | null = null;

  for (const block of blocks) {
    const lines = block.split(/\r?\n/);
    const timestampIndex = lines.findIndex((line) => line.includes('-->'));
    if (timestampIndex === -1) continue;
    cueCount += 1;
    const cue = cueCount;
    const match = lines[timestampIndex]?.trim().match(TIMESTAMP_PATTERN);
    if (!match) {
      issues.push({
        code: 'invalid_timestamp',
        severity: 'error',
        cue,
        message: `Cue ${cue} has an invalid timestamp.`,
      });
      continue;
    }

    const start = timestampToMilliseconds(match.slice(1, 5));
    const end = timestampToMilliseconds(match.slice(5, 9));
    const duration = end - start;
    const textLines = lines.slice(timestampIndex + 1);
    const text = textLines.join(' ').trim();

    if (end <= start) {
      issues.push({
        code: 'end_before_start',
        severity: 'error',
        cue,
        message: `Cue ${cue} ends before it starts.`,
      });
    }
    if (previousEnd !== null && start < previousEnd) {
      issues.push({
        code: 'overlap',
        severity: 'error',
        cue,
        message: `Cue ${cue} overlaps the previous cue.`,
      });
    }
    if (!text) {
      issues.push({
        code: 'empty_cue',
        severity: 'error',
        cue,
        message: `Cue ${cue} has no subtitle text.`,
      });
    }
    if (duration > 0 && duration < 300) {
      issues.push({
        code: 'very_short_cue',
        severity: 'warning',
        cue,
        message: `Cue ${cue} is visible for less than 0.3 seconds.`,
      });
    }
    if (duration > 10_000) {
      issues.push({
        code: 'very_long_cue',
        severity: 'warning',
        cue,
        message: `Cue ${cue} is visible for more than 10 seconds.`,
      });
    }
    if (textLines.some((line) => line.length > 42)) {
      issues.push({
        code: 'long_line',
        severity: 'warning',
        cue,
        message: `Cue ${cue} contains a line longer than 42 characters.`,
      });
    }
    if (duration > 0 && text.length / (duration / 1000) > 25) {
      issues.push({
        code: 'high_reading_speed',
        severity: 'warning',
        cue,
        message: `Cue ${cue} may be too fast to read.`,
      });
    }
    previousEnd = end;
  }

  return {
    cueCount,
    errorCount: issues.filter((issue) => issue.severity === 'error').length,
    warningCount: issues.filter((issue) => issue.severity === 'warning').length,
    issues,
  };
}
