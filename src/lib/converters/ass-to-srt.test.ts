import { describe, it, expect } from "vitest";
import { convertAssToSrt, formatSrt } from "./ass-to-srt";

const SAMPLE_ASS = `[Script Info]
Title: Test

[V4+ Styles]
Format: Name, Fontname
Style: Default,Arial

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:05.00,Default,,0,0,0,,Hello world
Dialogue: 0,0:00:06.50,0:00:10.00,Default,,0,0,0,,{\\b1}Bold{\\b0}
Dialogue: 0,0:00:11.00,0:00:15.00,Default,,0,0,0,,Line\\NTwo
`;

describe("convertAssToSrt", () => {
  it("extracts every Dialogue line from [Events]", () => {
    const entries = convertAssToSrt(SAMPLE_ASS);
    expect(entries).toHaveLength(3);
  });

  it("strips ASS override tags like {\\b1}", () => {
    const entries = convertAssToSrt(SAMPLE_ASS);
    expect(entries[1].text).toBe("Bold");
  });

  it("converts ASS \\N escape into a real newline", () => {
    const entries = convertAssToSrt(SAMPLE_ASS);
    expect(entries[2].text).toBe("Line\nTwo");
  });

  it("converts ASS H:MM:SS.cc into SRT HH:MM:SS,mmm", () => {
    const entries = convertAssToSrt(SAMPLE_ASS);
    expect(entries[0].start).toBe("00:00:01,000");
    expect(entries[0].end).toBe("00:00:05,000");
  });

  it("returns an empty array when [Events] is missing", () => {
    expect(convertAssToSrt("[Script Info]\nTitle: x\n")).toHaveLength(0);
  });

  it("sorts entries by start time and re-indexes from 1", () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:10.00,0:00:15.00,Default,,0,0,0,,Second
Dialogue: 0,0:00:01.00,0:00:05.00,Default,,0,0,0,,First
`;
    const entries = convertAssToSrt(ass);
    expect(entries.map((e) => e.text)).toEqual(["First", "Second"]);
    expect(entries.map((e) => e.index)).toEqual([1, 2]);
  });

  it("preserves commas inside Text by joining all fields after the Text index", () => {
    const ass = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:01.00,0:00:05.00,Default,,0,0,0,,Hello, world, how are you?
`;
    const entries = convertAssToSrt(ass);
    expect(entries[0].text).toBe("Hello, world, how are you?");
  });
});

describe("formatSrt", () => {
  it("formats SrtEntry array into valid SRT", () => {
    const out = formatSrt([
      { index: 1, start: "00:00:01,000", end: "00:00:05,000", text: "Hi" },
    ]);
    expect(out).toContain("1\n00:00:01,000 --> 00:00:05,000\nHi");
  });
});
