import { describe, expect, it } from "vitest";
import { universalConvert } from "./universal";

describe("universalConvert", () => {
  it("routes valid SRT through to VTT", () => {
    const out = universalConvert(
      "1\n00:00:01,000 --> 00:00:05,000\nHello\n",
      "srt",
      "vtt"
    );
    expect(out).toContain("WEBVTT");
    expect(out).toContain("00:00:01.000 --> 00:00:05.000");
    expect(out).toContain("Hello");
  });

  it("turns plain text into timed SRT cues", () => {
    const out = universalConvert("A\nB", "txt", "srt");
    expect(out).toContain("1\n00:00:00,000 --> 00:00:03,000\nA");
    expect(out).toContain("2\n00:00:03,500 --> 00:00:06,500\nB");
  });

  it("rejects files that do not produce subtitle cues", () => {
    expect(() => universalConvert("not a subtitle", "srt", "ass")).toThrow(
      "No subtitle cues"
    );
  });
});
