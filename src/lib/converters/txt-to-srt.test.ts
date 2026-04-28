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
