'use client';

import Link from '@/compat/next-link';
import { GenericConverter } from '@/components/tools/generic-converter';
import { convertSrtToTxt } from '@/lib/converters/srt-to-txt';

export function SrtToTxtConverter() {
  return (
    <GenericConverter
      toolId="srt-to-txt"
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={(content) => {
        const txt = convertSrtToTxt(content);
        if (!txt.trim()) throw new Error('No text content found');
        return txt;
      }}
      outputExtension="txt"
      workflowPush={
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <p className="font-medium">Repeating this across more files?</p>
          <p className="mt-1 text-muted-foreground">
            This single-file result is complete. Compare the Pro private beta
            path for batches, saved presets, history, and quality checks.{' '}
            <Link
              href="/pricing"
              className="font-medium underline underline-offset-4"
            >
              Compare repeat workflows
            </Link>
            .
          </p>
        </div>
      }
    />
  );
}
