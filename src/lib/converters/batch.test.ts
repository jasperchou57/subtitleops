import { describe, expect, it } from 'vitest';
import { processBatchFiles, renderBatchFileName } from './batch';

const srt = `1
00:00:01,000 --> 00:00:03,000
Hello world`;

describe('batch subtitle conversion', () => {
  it('converts multiple files and creates quality reports', () => {
    const results = processBatchFiles({
      files: [
        { name: 'episode-1.srt', content: srt },
        { name: 'episode-2.srt', content: srt },
      ],
      outputFormat: 'vtt',
      fileLimit: 100,
    });

    expect(results).toHaveLength(2);
    expect(results.every((result) => result.status === 'success')).toBe(true);
    expect(results[0]?.outputName).toBe('episode-1.vtt');
    expect(results[0]?.quality?.errorCount).toBe(0);
  });

  it('enforces the plan batch limit', () => {
    expect(() =>
      processBatchFiles({
        files: [
          { name: 'one.srt', content: srt },
          { name: 'two.srt', content: srt },
        ],
        outputFormat: 'vtt',
        fileLimit: 1,
      })
    ).toThrow('up to 1 files');
  });

  it('renders naming patterns and prevents duplicate archive names', () => {
    expect(
      renderBatchFileName('client-{index}-{name}', 'show.srt', 'vtt', 1)
    ).toBe('client-002-show.vtt');

    const results = processBatchFiles({
      files: [
        { name: 'show.srt', content: srt },
        { name: 'show.srt', content: srt },
      ],
      outputFormat: 'vtt',
      fileLimit: 100,
    });
    expect(results[1]?.outputName).toBe('show-2.vtt');
  });
});
