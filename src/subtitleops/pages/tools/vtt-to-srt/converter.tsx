'use client';

import { GenericConverter } from '@/components/tools/generic-converter';
import { ToolWorkflowPush } from '@/components/tools/tool-workflow-push';
import { convertVttToSrt } from '@/lib/converters/vtt-to-srt';
import { formatSrt } from '@/lib/converters/ass-to-srt';

export function VttToSrtConverter() {
  return (
    <GenericConverter
      toolId="vtt-to-srt"
      accept=".vtt"
      acceptLabel="Accepts .vtt files"
      convert={(content) => {
        const entries = convertVttToSrt(content);
        if (entries.length === 0) throw new Error('No cues found');
        return formatSrt(entries);
      }}
      outputExtension="srt"
      workflowPush={<ToolWorkflowPush />}
    />
  );
}
