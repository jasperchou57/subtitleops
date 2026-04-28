import { describe, it, expect } from "vitest";
import { detectTimingFormat, shiftSubtitles, convertFps } from "./index";

describe("detectTimingFormat", () => {
  it("uses the file extension first", () => {
    expect(detectTimingFormat("", "a.srt")).toBe("srt");
    expect(detectTimingFormat("", "a.vtt")).toBe("vtt");
  });

  it("recognises the WEBVTT header in content", () => {
    expect(detectTimingFormat("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nHi", "a.txt")).toBe("vtt");
  });

  it("recognises the SRT cue pattern in content", () => {
    expect(detectTimingFormat("1\n00:00:01,000 --> 00:00:05,000\nHi", "a.txt")).toBe("srt");
  });

  it("returns null when no format can be inferred", () => {
    expect(detectTimingFormat("random content", "a.txt")).toBe(null);
  });
});

describe("shiftSubtitles", () => {
  it("shifts every timestamp by the given milliseconds (forward)", () => {
    const result = shiftSubtitles("1\n00:00:01,000 --> 00:00:05,000\nHi\n", "srt", 2000);
    expect(result.output).toContain("00:00:03,000 --> 00:00:07,000");
    expect(result.cueCount).toBe(1);
    expect(result.clampedCount).toBe(0);
  });

  it("clamps negative results to zero and counts the clamps", () => {
    const result = shiftSubtitles("1\n00:00:01,000 --> 00:00:05,000\nHi\n", "srt", -2000);
    expect(result.output).toContain("00:00:00,000 --> 00:00:03,000");
    expect(result.clampedCount).toBe(1);
  });

  it("uses dot separators for VTT output", () => {
    const result = shiftSubtitles(
      "WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nHi",
      "vtt",
      1500
    );
    expect(result.output).toContain("00:00:02.500 --> 00:00:06.500");
  });

  it("preserves the WEBVTT header and cue id lines", () => {
    const input = "WEBVTT\n\ncue-1\n00:00:01.000 --> 00:00:05.000\nHi";
    const result = shiftSubtitles(input, "vtt", 1000);
    expect(result.output).toContain("WEBVTT");
    expect(result.output).toContain("cue-1");
  });

  it("preserves cue settings on the timestamp line", () => {
    const input = "WEBVTT\n\n00:00:01.000 --> 00:00:05.000 line:50% align:center\nHi";
    const result = shiftSubtitles(input, "vtt", 1000);
    expect(result.output).toContain("line:50% align:center");
  });
});

describe("convertFps", () => {
  it("rescales timestamps when source FPS > target FPS (slower playback)", () => {
    const input = "1\n00:00:00,000 --> 00:00:01,000\nHi\n";
    const result = convertFps(input, "srt", 25, 23.976);
    // ratio = 25 / 23.976 ≈ 1.0427; 1000ms × 1.0427 ≈ 1043ms
    expect(result.output).toContain("00:00:00,000 --> 00:00:01,043");
    expect(result.ratio).toBeCloseTo(1.0427, 3);
  });

  it("rescales timestamps when source FPS < target FPS (faster playback)", () => {
    const input = "1\n00:00:00,000 --> 00:00:25,000\nHi\n";
    const result = convertFps(input, "srt", 23.976, 25);
    // 25000ms × (23.976/25) = 25000 × 0.95904 = 23976ms
    expect(result.output).toContain("00:00:23,976");
  });

  it("rejects non-positive or non-finite FPS values", () => {
    const input = "1\n00:00:01,000 --> 00:00:05,000\nHi\n";
    expect(() => convertFps(input, "srt", 0, 25)).toThrow();
    expect(() => convertFps(input, "srt", 25, -1)).toThrow();
    expect(() => convertFps(input, "srt", Number.NaN, 25)).toThrow();
    expect(() => convertFps(input, "srt", Infinity, 25)).toThrow();
  });
});
