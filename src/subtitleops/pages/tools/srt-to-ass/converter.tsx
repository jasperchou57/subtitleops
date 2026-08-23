'use client';

import { GenericConverter } from '@/components/tools/generic-converter';
import { ToolWorkflowPush } from '@/components/tools/tool-workflow-push';
import { convertSrtToAss } from '@/lib/converters/srt-to-ass';

export function SrtToAssConverter() {
  return (
    <GenericConverter
      toolId="srt-to-ass"
      accept=".srt"
      acceptLabel="Accepts .srt files"
      convert={(content) => {
        const ass = convertSrtToAss(content);
        if (!ass.split(/\r?\n/).some((line) => line.startsWith('Dialogue:'))) {
          throw new Error('No subtitle cues found');
        }
        return ass;
      }}
      outputExtension="ass"
      workflowPush={<ToolWorkflowPush />}
    />
  );
}
