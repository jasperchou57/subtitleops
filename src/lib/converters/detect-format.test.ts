import { describe, it, expect } from "vitest";
import { detectFormat, getAvailableOutputFormats } from "./detect-format";

describe("detectFormat", () => {
  it("uses the file extension when one is present", () => {
    expect(detectFormat("", "foo.srt")).toBe("srt");
    expect(detectFormat("", "foo.vtt")).toBe("vtt");
    expect(detectFormat("", "foo.ass")).toBe("ass");
    expect(detectFormat("", "foo.ssa")).toBe("ass");
    expect(detectFormat("", "foo.sbv")).toBe("sbv");
  });

  it("treats extensions case-insensitively", () => {
    expect(detectFormat("", "foo.SRT")).toBe("srt");
    expect(detectFormat("", "foo.Vtt")).toBe("vtt");
  });

  it("falls back to content sniffing for unrecognised extensions", () => {
    expect(detectFormat("WEBVTT\n\n", "foo.txt")).toBe("vtt");
    expect(detectFormat("[Script Info]\nTitle: x\n", "foo.txt")).toBe("ass");
    expect(detectFormat("1\n00:00:01,000 --> 00:00:05,000\nHi", "foo.txt")).toBe("srt");
    expect(detectFormat("0:00:01.000,0:00:05.000\nHi", "foo.txt")).toBe("sbv");
  });

  it("defaults to txt when no signal matches", () => {
    expect(detectFormat("plain text content", "foo.txt")).toBe("txt");
    expect(detectFormat("plain text content", "foo")).toBe("txt");
  });
});

describe("getAvailableOutputFormats", () => {
  it("excludes the input format and SBV from the output options", () => {
    const out = getAvailableOutputFormats("srt");
    const values = out.map((f) => f.value);
    expect(values).not.toContain("srt");
    expect(values).not.toContain("sbv");
  });

  it("returns three options for any non-SBV input format", () => {
    expect(getAvailableOutputFormats("srt")).toHaveLength(3);
    expect(getAvailableOutputFormats("vtt")).toHaveLength(3);
    expect(getAvailableOutputFormats("ass")).toHaveLength(3);
    expect(getAvailableOutputFormats("txt")).toHaveLength(3);
  });
});
