'use client';

import { GenericConverter } from '@/components/tools/generic-converter';
import { ToolWorkflowPush } from '@/components/tools/tool-workflow-push';
import { convertVttToTxt } from '@/lib/converters/vtt-to-txt';

export function VttToTxtConverter() {
  return (
    <GenericConverter
      toolId="vtt-to-txt"
      accept=".vtt"
      acceptLabel="Accepts .vtt files"
      convert={convertVttToTxt}
      outputExtension="txt"
      workflowPush={<ToolWorkflowPush />}
    />
  );
}
