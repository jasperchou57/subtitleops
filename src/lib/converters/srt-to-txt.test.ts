import { describe, it, expect } from "vitest";
import { convertSrtToTxt } from "./srt-to-txt";

describe("convertSrtToTxt", () => {
  it("extracts plain text and drops timestamps and cue indexes", () => {
    expect(convertSrtToTxt("1\n00:00:01,000 --> 00:00:05,000\nHello\n")).toBe("Hello");
  });

  // Regression: Bug C (digit-only text dropped as cue index)
  it("preserves digit-only subtitle text such as '5', '2025', countdowns", () => {
    const input =
      "1\n00:00:01,000 --> 00:00:05,000\n5\n\n" +
      "2\n00:00:06,000 --> 00:00:10,000\n2025\n\n" +
      "3\n00:00:11,000 --> 00:00:15,000\nHello\n";
    expect(convertSrtToTxt(input).split("\n")).toEqual(["5", "2025", "Hello"]);
  });

  it("strips HTML tags from text", () => {
    expect(convertSrtToTxt("1\n00:00:01,000 --> 00:00:05,000\n<i>Hello</i>\n")).toBe("Hello");
  });

  it("joins multi-line cue text with newlines", () => {
    expect(
      convertSrtToTxt("1\n00:00:01,000 --> 00:00:05,000\nLine 1\nLine 2\n")
    ).toBe("Line 1\nLine 2");
  });

  it("handles CRLF line endings", () => {
    expect(convertSrtToTxt("1\r\n00:00:01,000 --> 00:00:05,000\r\nHello\r\n")).toBe("Hello");
  });

  it("returns an empty string for empty input", () => {
    expect(convertSrtToTxt("")).toBe("");
  });

  it("skips blocks without a timestamp line", () => {
    expect(
      convertSrtToTxt("not a cue\n\n1\n00:00:01,000 --> 00:00:05,000\nReal\n")
    ).toBe("Real");
  });
});
