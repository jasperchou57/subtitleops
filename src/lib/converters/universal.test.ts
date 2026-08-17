import { describe, expect, it } from 'vitest';
import { universalConvert } from './universal';

describe('universalConvert', () => {
  it('routes valid SRT through to VTT', () => {
    const out = universalConvert(
      '1\n00:00:01,000 --> 00:00:05,000\nHello\n',
      'srt',
      'vtt'
    );
    expect(out).toContain('WEBVTT');
    expect(out).toContain('00:00:01.000 --> 00:00:05.000');
    expect(out).toContain('Hello');
  });

  it('turns plain text into timed SRT cues', () => {
    const out = universalConvert('A\nB', 'txt', 'srt');
    expect(out).toContain('1\n00:00:00,000 --> 00:00:03,000\nA');
    expect(out).toContain('2\n00:00:03,500 --> 00:00:06,500\nB');
  });

  it('preserves VTT cue boundaries in TXT output', () => {
    const out = universalConvert(
      'WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nLine 1\nLine 2\n\n' +
        '00:00:06.000 --> 00:00:10.000\nNext cue\n',
      'vtt',
      'txt'
    );

    expect(out).toBe('Line 1\nLine 2\n\nNext cue');
  });

  it('rejects files that do not produce subtitle cues', () => {
    expect(() => universalConvert('not a subtitle', 'srt', 'ass')).toThrow(
      'No subtitle cues'
    );
  });
});
