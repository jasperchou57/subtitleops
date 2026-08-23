'use client';

import { GenericConverter } from '@/components/tools/generic-converter';
import { ToolWorkflowPush } from '@/components/tools/tool-workflow-push';
import { convertSbvToSrt } from '@/lib/converters/sbv-to-srt';

export function SbvToSrtConverter() {
  return (
    <GenericConverter
      toolId="sbv-to-srt"
      accept=".sbv"
      acceptLabel="Accepts .sbv files"
      convert={convertSbvToSrt}
      outputExtension="srt"
      workflowPush={<ToolWorkflowPush />}
    />
  );
}
