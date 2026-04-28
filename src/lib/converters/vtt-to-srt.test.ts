import { describe, it, expect } from "vitest";
import { convertVttToSrt } from "./vtt-to-srt";

describe("convertVttToSrt", () => {
  it("parses a basic WebVTT cue", () => {
    const entries = convertVttToSrt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nHello\n");
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      start: "00:00:01,000",
      end: "00:00:05,000",
      text: "Hello",
    });
  });

  it("handles VTT timestamps without an hours component", () => {
    const entries = convertVttToSrt("WEBVTT\n\n01:23.456 --> 02:30.000\nHello\n");
    expect(entries[0].start).toBe("00:01:23,456");
    expect(entries[0].end).toBe("00:02:30,000");
  });

  it("strips cue settings from the end of the timestamp line", () => {
    const entries = convertVttToSrt(
      "WEBVTT\n\n00:00:01.000 --> 00:00:05.000 line:50% align:center\nHello\n"
    );
    expect(entries[0].end).toBe("00:00:05,000");
  });

  it("strips VTT-style tags from text", () => {
    const entries = convertVttToSrt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\n<v Speaker>Hello</v>\n");
    expect(entries[0].text).toBe("Hello");
  });

  it("decodes &lt; &gt; &amp; entities", () => {
    const entries = convertVttToSrt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nA &amp; B &lt;tag&gt;\n");
    expect(entries[0].text).toBe("A & B <tag>");
  });

  it("preserves multi-line cue text", () => {
    const entries = convertVttToSrt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nLine 1\nLine 2\n");
    expect(entries[0].text).toBe("Line 1\nLine 2");
  });

  it("numbers entries sequentially", () => {
    const entries = convertVttToSrt(
      "WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nA\n\n00:00:06.000 --> 00:00:10.000\nB\n"
    );
    expect(entries.map((e) => e.index)).toEqual([1, 2]);
  });

  it("returns empty array for empty input", () => {
    expect(convertVttToSrt("")).toEqual([]);
  });
});
