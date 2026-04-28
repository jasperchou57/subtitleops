import { describe, it, expect } from "vitest";
import { convertVttToTxt } from "./vtt-to-txt";

describe("convertVttToTxt", () => {
  it("extracts text from a basic VTT cue", () => {
    expect(convertVttToTxt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nHello\n")).toBe("Hello");
  });

  it("skips the WEBVTT header and Kind/Language metadata", () => {
    const out = convertVttToTxt(
      "WEBVTT\nKind: captions\nLanguage: en\n\n00:00:01.000 --> 00:00:05.000\nHello\n"
    );
    expect(out).not.toContain("WEBVTT");
    expect(out).not.toContain("Kind:");
    expect(out).not.toContain("Language:");
    expect(out).toBe("Hello");
  });

  it("strips <v Speaker> voice tags", () => {
    expect(
      convertVttToTxt("WEBVTT\n\n00:00:01.000 --> 00:00:05.000\n<v John>Hello</v>\n")
    ).toBe("Hello");
  });

  it("removes inline VTT timestamp tags", () => {
    expect(
      convertVttToTxt("WEBVTT\n\n00:00:01.000 --> 00:00:10.000\nfirst<00:00:05.000>second\n")
    ).toBe("firstsecond");
  });

  it("skips multi-line NOTE blocks", () => {
    const vtt =
      "WEBVTT\n\nNOTE\nThis is a multi-line note\nthat spans several lines\n\n" +
      "00:00:01.000 --> 00:00:05.000\nHello\n";
    expect(convertVttToTxt(vtt)).toBe("Hello");
  });

  it("skips a cue identifier on the line before a timestamp", () => {
    const out = convertVttToTxt(
      "WEBVTT\n\ncue-1\n00:00:01.000 --> 00:00:05.000\nHello\n"
    );
    expect(out).not.toContain("cue-1");
    expect(out).toBe("Hello");
  });

  it("joins multiple cues with newlines", () => {
    expect(
      convertVttToTxt(
        "WEBVTT\n\n00:00:01.000 --> 00:00:05.000\nA\n\n00:00:06.000 --> 00:00:10.000\nB\n"
      )
    ).toBe("A\nB");
  });

  it("returns empty string for empty input", () => {
    expect(convertVttToTxt("")).toBe("");
  });
});
