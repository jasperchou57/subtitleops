import { describe, it, expect } from "vitest";
import { convertSrtToVtt } from "./srt-to-vtt";

describe("convertSrtToVtt", () => {
  it("adds a WEBVTT header and converts , to . in timestamps", () => {
    const out = convertSrtToVtt("1\n00:00:01,000 --> 00:00:05,000\nHello\n");
    expect(out.startsWith("WEBVTT")).toBe(true);
    expect(out).toContain("00:00:01.000 --> 00:00:05.000");
    expect(out).not.toContain("00:00:01,000");
  });

  // Regression: Bug B (digit-only text dropped as cue index)
  it("preserves digit-only subtitle text such as '5', '2025', countdowns", () => {
    const input =
      "1\n00:00:01,000 --> 00:00:05,000\n5\n\n" +
      "2\n00:00:06,000 --> 00:00:10,000\n2025\n\n" +
      "3\n00:00:11,000 --> 00:00:15,000\nHello\n";
    const out = convertSrtToVtt(input);
    expect(out).toMatch(/00:00:05\.000\n5\b/);
    expect(out).toMatch(/00:00:10\.000\n2025\b/);
    expect(out).toMatch(/00:00:15\.000\nHello/);
  });

  it("does not emit the SRT cue index as a standalone line", () => {
    const out = convertSrtToVtt("1\n00:00:01,000 --> 00:00:05,000\nHello\n");
    expect(out.split("\n")).not.toContain("1");
    expect(out).toContain("Hello");
  });

  it("preserves multi-line cue text", () => {
    const out = convertSrtToVtt("1\n00:00:01,000 --> 00:00:05,000\nLine 1\nLine 2\n");
    expect(out).toContain("Line 1\nLine 2");
  });

  it("handles CRLF line endings", () => {
    const out = convertSrtToVtt("1\r\n00:00:01,000 --> 00:00:05,000\r\nHello\r\n");
    expect(out).toContain("00:00:01.000 --> 00:00:05.000");
    expect(out).toContain("Hello");
  });

  it("skips blocks that have no timestamp line", () => {
    const out = convertSrtToVtt("not a cue\n\n1\n00:00:01,000 --> 00:00:05,000\nReal\n");
    expect(out).not.toContain("not a cue");
    expect(out).toContain("Real");
  });

  it("returns just the WEBVTT header for empty input", () => {
    const out = convertSrtToVtt("");
    expect(out.trim()).toBe("WEBVTT");
  });
});
