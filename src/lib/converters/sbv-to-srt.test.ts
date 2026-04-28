import { describe, it, expect } from "vitest";
import { convertSbvToSrt } from "./sbv-to-srt";

describe("convertSbvToSrt", () => {
  it("converts SBV cues into SRT", () => {
    const out = convertSbvToSrt(
      "0:00:01.000,0:00:05.000\nHello\n\n0:00:06.000,0:00:10.000\nWorld\n"
    );
    expect(out).toContain("00:00:01,000 --> 00:00:05,000");
    expect(out).toContain("Hello");
    expect(out).toContain("00:00:06,000 --> 00:00:10,000");
    expect(out).toContain("World");
  });

  it("pads single-digit hours to two digits", () => {
    const out = convertSbvToSrt("1:23:45.678,1:23:50.000\nHello\n");
    expect(out).toContain("01:23:45,678");
  });

  it("preserves multi-line cue text", () => {
    const out = convertSbvToSrt("0:00:01.000,0:00:05.000\nLine 1\nLine 2\n");
    expect(out).toContain("Line 1\nLine 2");
  });

  it("numbers cues sequentially starting at 1", () => {
    const out = convertSbvToSrt(
      "0:00:01.000,0:00:05.000\nA\n\n0:00:06.000,0:00:10.000\nB\n"
    );
    expect(out.startsWith("1\n")).toBe(true);
    expect(out).toContain("\n\n2\n");
  });

  it("handles CRLF line endings", () => {
    const out = convertSbvToSrt("0:00:01.000,0:00:05.000\r\nHello\r\n");
    expect(out).toContain("Hello");
  });

  it("skips lines that do not match the SBV timestamp format", () => {
    const out = convertSbvToSrt("garbage line\n0:00:01.000,0:00:05.000\nHello\n");
    expect(out).toContain("Hello");
    expect(out).not.toContain("garbage line");
  });

  it("returns empty string for empty input", () => {
    expect(convertSbvToSrt("")).toBe("");
  });
});
