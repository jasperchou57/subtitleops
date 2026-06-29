import { describe, it, expect } from "vitest";
import { convertTxtToSrt } from "./txt-to-srt";

describe("convertTxtToSrt", () => {
  it("produces one cue per non-empty line", () => {
    expect(convertTxtToSrt("Line 1\nLine 2\nLine 3\n")).toHaveLength(3);
  });

  it("uses default 3s duration with 0.5s gap", () => {
    const entries = convertTxtToSrt("A\nB");
    expect(entries[0]).toMatchObject({ start: "00:00:00,000", end: "00:00:03,000" });
    expect(entries[1]).toMatchObject({ start: "00:00:03,500", end: "00:00:06,500" });
  });

  it("respects custom secondsPerLine and gap", () => {
    const entries = convertTxtToSrt("A\nB", 5, 1);
    expect(entries[0].end).toBe("00:00:05,000");
    expect(entries[1].start).toBe("00:00:06,000");
  });

  it("respects object options with a custom start time", () => {
    const entries = convertTxtToSrt("A\nB", {
      secondsPerLine: 4,
      gap: 0.25,
      startSeconds: 12.5,
    });

    expect(entries[0]).toMatchObject({ start: "00:00:12,500", end: "00:00:16,500" });
    expect(entries[1]).toMatchObject({ start: "00:00:16,750", end: "00:00:20,750" });
  });

  it("can split pasted paragraphs into sentence cues", () => {
    const entries = convertTxtToSrt("First sentence. Second sentence! Third?", {
      splitMode: "sentence",
    });

    expect(entries.map((e) => e.text)).toEqual(["First sentence.", "Second sentence!", "Third?"]);
  });

  it("wraps long cue text when maxCharsPerLine is set", () => {
    const entries = convertTxtToSrt("Alpha beta gamma delta", {
      maxCharsPerLine: 12,
    });

    expect(entries[0].text).toBe("Alpha beta\ngamma delta");
  });

  it("skips blank lines", () => {
    const entries = convertTxtToSrt("A\n\n\nB\n");
    expect(entries.map((e) => e.text)).toEqual(["A", "B"]);
  });

  it("trims surrounding whitespace from each line", () => {
    expect(convertTxtToSrt("  hello  \n")[0].text).toBe("hello");
  });

  it("returns an empty array for empty input", () => {
    expect(convertTxtToSrt("")).toEqual([]);
  });

  it("numbers entries sequentially starting at 1", () => {
    expect(convertTxtToSrt("A\nB\nC").map((e) => e.index)).toEqual([1, 2, 3]);
  });
});
