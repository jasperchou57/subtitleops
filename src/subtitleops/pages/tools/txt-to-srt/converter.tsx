'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { GenericConverter } from '@/components/tools/generic-converter';
import { convertTxtToSrt } from '@/lib/converters/txt-to-srt';
import { formatSrt } from '@/lib/converters/ass-to-srt';
import { trackEvent } from '@/lib/analytics';

type SplitMode = 'line' | 'sentence';

const TOOL_ID = 'txt-to-srt';

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function TxtToSrtConverter() {
  const [startSeconds, setStartSeconds] = useState(0);
  const [secondsPerLine, setSecondsPerLine] = useState(3);
  const [gap, setGap] = useState(0.5);
  const [maxCharsPerLine, setMaxCharsPerLine] = useState(42);
  const [splitMode, setSplitMode] = useState<SplitMode>('line');

  const trackSetting = (settingName: string, settingValue: string) => {
    trackEvent({
      tool: TOOL_ID,
      action: 'settings_changed',
      setting_name: settingName,
      setting_value: settingValue,
    });
  };

  const settingsPanel = (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-blue-500" />
        Subtitle timing settings
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="font-medium text-foreground">Start time</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Seconds before the first cue.
          </span>
          <input
            type="number"
            min="0"
            max="86400"
            step="0.5"
            value={startSeconds}
            onChange={(event) =>
              setStartSeconds(clampNumber(Number(event.target.value), 0, 86400))
            }
            onBlur={() => trackSetting('start_seconds', String(startSeconds))}
            className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm">
          <span className="font-medium text-foreground">Duration per cue</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            How long each subtitle stays visible.
          </span>
          <input
            type="number"
            min="0.5"
            max="30"
            step="0.5"
            value={secondsPerLine}
            onChange={(event) =>
              setSecondsPerLine(
                clampNumber(Number(event.target.value), 0.5, 30)
              )
            }
            onBlur={() =>
              trackSetting('seconds_per_line', String(secondsPerLine))
            }
            className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm">
          <span className="font-medium text-foreground">Gap</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Pause between subtitle cues.
          </span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={gap}
            onChange={(event) =>
              setGap(clampNumber(Number(event.target.value), 0, 10))
            }
            onBlur={() => trackSetting('gap', String(gap))}
            className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="text-sm">
          <span className="font-medium text-foreground">
            Max chars per line
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Wrap long cues for readability.
          </span>
          <input
            type="number"
            min="12"
            max="80"
            step="1"
            value={maxCharsPerLine}
            onChange={(event) =>
              setMaxCharsPerLine(
                clampNumber(Number(event.target.value), 12, 80)
              )
            }
            onBlur={() =>
              trackSetting('max_chars_per_line', String(maxCharsPerLine))
            }
            className="mt-2 h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-foreground">Split mode</p>
        <div className="mt-2 grid grid-cols-2 overflow-hidden rounded-lg border bg-background text-sm">
          {[
            { value: 'line', label: 'Line by line' },
            { value: 'sentence', label: 'By sentence' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                const nextMode = option.value as SplitMode;
                setSplitMode(nextMode);
                trackSetting('split_mode', nextMode);
              }}
              className={`h-9 px-3 font-medium transition-colors ${
                splitMode === option.value
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <GenericConverter
      toolId={TOOL_ID}
      accept=".txt"
      acceptLabel="Accepts .txt files"
      convert={(content) => {
        const entries = convertTxtToSrt(content, {
          secondsPerLine,
          gap,
          startSeconds,
          splitMode,
          maxCharsPerLine,
        });
        if (entries.length === 0) throw new Error('No text lines found');
        return formatSrt(entries);
      }}
      outputExtension="srt"
      settingsPanel={settingsPanel}
      directInput={{
        label: 'Paste transcript, script, or lyrics text',
        helperText:
          'Use the timing settings above before converting pasted text.',
        placeholder:
          "Welcome to the video.\nToday we will cover the basics.\nLet's start with the first step.",
        fileName: 'pasted-text.txt',
        actionLabel: 'Convert pasted text',
      }}
    />
  );
}
