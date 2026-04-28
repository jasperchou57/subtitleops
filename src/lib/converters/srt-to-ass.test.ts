import { describe, it, expect } from "vitest";
import { convertSrtToAss } from "./srt-to-ass";

function dialogueLines(ass: string): string[] {
  return ass.split("\n").filter((l) => l.startsWith("Dialogue:"));
}

function timestamps(dialogueLine: string): { start: string; end: string } | null {
  const m = dialogueLine.match(/Dialogue:\s*\d+,([\d:.]+),([\d:.]+),/);
  return m ? { start: m[1], end: m[2] } : null;
}

describe("convertSrtToAss", () => {
  it("emits required ASS sections and a Dialogue line for a basic input", () => {
    const out = convertSrtToAss("1\n00:00:01,000 --> 00:00:05,000\nHello\n");
    expect(out).toContain("[Script Info]");
    expect(out).toContain("[V4+ Styles]");
    expect(out).toContain("[Events]");
    expect(out).toContain("Hello");
    expect(dialogueLines(out)).toHaveLength(1);
  });

  // Regression: Bug A (centisecond overflow)
  it("carries 995ms+ correctly into the next second instead of producing .100", () => {
    const out = convertSrtToAss("1\n00:00:05,995 --> 00:00:09,999\nHi\n");
    const ts = timestamps(dialogueLines(out)[0]);
    expect(ts).not.toBeNull();
    expect(ts!.start).toBe("0:00:06.00");
    expect(ts!.end).toBe("0:00:10.00");
  });

  it("propagates centisecond overflow across minute and hour boundaries", () => {
    const out = convertSrtToAss("1\n00:59:59,999 --> 01:00:00,500\nHi\n");
    const ts = timestamps(dialogueLines(out)[0]);
    expect(ts!.start).toBe("1:00:00.00");
    expect(ts!.end).toBe("1:00:00.50");
  });

  it("keeps sub-995ms values inside the same second", () => {
    const out = convertSrtToAss("1\n00:00:00,994 --> 00:00:01,500\nHi\n");
    const ts = timestamps(dialogueLines(out)[0]);
    expect(ts!.start).toBe("0:00:00.99");
    expect(ts!.end).toBe("0:00:01.50");
  });

  it("strips basic HTML formatting tags from text", () => {
    const out = convertSrtToAss("1\n00:00:01,000 --> 00:00:05,000\n<i>italic</i>\n");
    expect(out).toContain("italic");
    expect(out).not.toContain("<i>");
  });

  it("converts multiline cue text into ASS \\N escapes", () => {
    const out = convertSrtToAss("1\n00:00:01,000 --> 00:00:05,000\nLine 1\nLine 2\n");
    expect(out).toContain("Line 1\\NLine 2");
  });

  it("emits no Dialogue lines for empty input but still produces a valid header", () => {
    const out = convertSrtToAss("");
    expect(out).toContain("[Script Info]");
    expect(dialogueLines(out)).toHaveLength(0);
  });

  it("handles CRLF line endings", () => {
    const out = convertSrtToAss("1\r\n00:00:01,000 --> 00:00:05,000\r\nHi\r\n");
    expect(dialogueLines(out)).toHaveLength(1);
  });
});
