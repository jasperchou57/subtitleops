import { describe, expect, it } from 'vitest';
import { checkSubtitleQuality } from './quality';

describe('subtitle quality checks', () => {
  it('accepts clean subtitle cues', () => {
    const report = checkSubtitleQuality(`1
00:00:01,000 --> 00:00:03,000
Hello world

2
00:00:04,000 --> 00:00:06,000
Second cue`);

    expect(report.cueCount).toBe(2);
    expect(report.errorCount).toBe(0);
    expect(report.warningCount).toBe(0);
  });

  it('reports overlaps and empty cues', () => {
    const report = checkSubtitleQuality(`1
00:00:01,000 --> 00:00:04,000
First cue

2
00:00:03,500 --> 00:00:05,000
`);

    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['overlap', 'empty_cue'])
    );
  });

  it('reports readability warnings', () => {
    const report = checkSubtitleQuality(`1
00:00:01,000 --> 00:00:01,200
This line is much too long to read in only two tenths of a second`);

    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'very_short_cue',
        'long_line',
        'high_reading_speed',
      ])
    );
  });
});
