'use client';

import { type ChangeEvent, type ReactNode, useRef, useState } from 'react';
import { ClipboardPaste, WandSparkles } from 'lucide-react';
import { FileDropzone } from './file-dropzone';
import { ConversionResult } from './conversion-result';
import { generateTraceId, logTrace } from '@/lib/trace';
import { trackEvent } from '@/lib/analytics';

interface GenericConverterProps {
  /** Tool identifier for tracing, e.g. "vtt-to-srt" */
  toolId: string;
  accept: string;
  acceptLabel: string;
  convert: (content: string) => string;
  outputExtension: string;
  previewLines?: number;
  settingsPanel?: ReactNode;
  workflowPush?: ReactNode;
  directInput?: {
    label: string;
    helperText: string;
    placeholder: string;
    fileName: string;
    actionLabel: string;
  };
}

export function GenericConverter({
  toolId,
  accept,
  acceptLabel,
  convert,
  outputExtension,
  previewLines = 12,
  settingsPanel,
  workflowPush,
  directInput,
}: GenericConverterProps) {
  const [directText, setDirectText] = useState('');
  const [hasTrackedPasteStart, setHasTrackedPasteStart] = useState(false);
  const [result, setResult] = useState<{
    originalPreview: string;
    convertedPreview: string;
    fileName: string;
    fullOutput: string;
    traceId: string;
  } | null>(null);
  const [error, setError] = useState<{
    message: string;
    traceId: string;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const runConversion = ({
    text,
    fileName,
    fileSize,
    inputFormat,
    uploadAction,
  }: {
    text: string;
    fileName: string;
    fileSize: number;
    inputFormat: string;
    uploadAction?: 'file_upload';
  }) => {
    setError(null);
    setResult(null);

    const traceId = generateTraceId();
    const startTime = performance.now();

    if (uploadAction) {
      trackEvent({
        tool: toolId,
        action: uploadAction,
        input_format: inputFormat,
        output_format: outputExtension,
        file_size: fileSize,
        trace_id: traceId,
      });
    }

    try {
      const output = convert(text);
      const duration = Math.round(performance.now() - startTime);

      if (!output || output.trim().length === 0) {
        const errMsg =
          'No valid subtitle cues were found in this file. Please check the file format.';
        logTrace({
          traceId,
          tool: toolId,
          action: 'error',
          timestamp: Date.now(),
          fileName,
          fileSize,
          duration,
          error: 'empty_output',
        });
        trackEvent({
          tool: toolId,
          action: 'convert_error',
          error_type: 'empty_output',
          file_size: fileSize,
          trace_id: traceId,
        });
        setError({ message: errMsg, traceId });
        return;
      }

      const entryCount = output.split(/\n\s*\n/).filter(Boolean).length;

      logTrace({
        traceId,
        tool: toolId,
        action: 'convert',
        timestamp: Date.now(),
        fileName,
        fileSize,
        inputFormat,
        outputFormat: outputExtension,
        duration,
        entryCount,
      });

      trackEvent({
        tool: toolId,
        action: 'convert_success',
        input_format: inputFormat,
        output_format: outputExtension,
        file_size: fileSize,
        entry_count: entryCount,
        duration_ms: duration,
        trace_id: traceId,
      });

      const originalLines = text
        .split(/\r?\n/)
        .slice(0, previewLines)
        .join('\n');
      const outputPreviewLines = output
        .split(/\r?\n/)
        .slice(0, previewLines)
        .join('\n');

      setResult({
        originalPreview:
          originalLines +
          (text.split(/\r?\n/).length > previewLines ? '\n...' : ''),
        convertedPreview:
          outputPreviewLines +
          (output.split(/\r?\n/).length > previewLines ? '\n...' : ''),
        fileName,
        fullOutput: output,
        traceId,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      const duration = Math.round(performance.now() - startTime);
      const errorType = err instanceof Error ? err.message : 'unknown_error';

      logTrace({
        traceId,
        tool: toolId,
        action: 'error',
        timestamp: Date.now(),
        fileName,
        fileSize,
        duration,
        error: errorType,
      });

      trackEvent({
        tool: toolId,
        action: 'convert_error',
        error_type: errorType,
        file_size: fileSize,
        duration_ms: duration,
        trace_id: traceId,
      });

      setError({
        message:
          'No valid subtitle cues were found in this file. Please check the file format.',
        traceId,
      });
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      runConversion({
        text,
        fileName: file.name,
        fileSize: file.size,
        inputFormat: file.name.split('.').pop() || 'unknown',
        uploadAction: 'file_upload',
      });
    } catch {
      setError({
        message:
          'Could not read this file. Please check the file and try again.',
        traceId: generateTraceId(),
      });
    }
  };

  const handleDirectConvert = () => {
    if (!directInput || !directText.trim()) return;

    trackEvent({
      tool: toolId,
      action: 'convert_click',
      input_format: 'txt',
      output_format: outputExtension,
      file_size: directText.length,
    });

    runConversion({
      text: directText,
      fileName: directInput.fileName,
      fileSize: directText.length,
      inputFormat: 'txt',
    });
  };

  const handleDirectTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setDirectText(value);

    if (!hasTrackedPasteStart && value.trim()) {
      setHasTrackedPasteStart(true);
      trackEvent({
        tool: toolId,
        action: 'paste_start',
        input_format: 'txt',
        output_format: outputExtension,
        file_size: value.length,
      });
    }
  };

  return (
    <div data-analytics-area="tool_converter" data-analytics-tool={toolId}>
      {settingsPanel && <div className="mb-4">{settingsPanel}</div>}

      <FileDropzone
        accept={accept}
        acceptLabel={acceptLabel}
        onFileSelect={handleFileSelect}
      />

      {directInput && (
        <div
          data-analytics-area="text_input"
          className="mt-4 rounded-xl border bg-card p-4"
        >
          <label
            htmlFor={`${toolId}-direct-input`}
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <ClipboardPaste className="h-4 w-4 text-blue-500" />
            {directInput.label}
          </label>
          <textarea
            data-analytics-control="transcript_input"
            id={`${toolId}-direct-input`}
            value={directText}
            onChange={handleDirectTextChange}
            placeholder={directInput.placeholder}
            className="mt-3 min-h-40 w-full rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              data-analytics-control="convert_text"
              type="button"
              onClick={handleDirectConvert}
              disabled={!directText.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              <WandSparkles className="h-4 w-4" />
              {directInput.actionLabel}
            </button>
            <p className="text-xs text-muted-foreground">
              {directInput.helperText}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{error.message}</p>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            Trace ID: {error.traceId}
          </p>
        </div>
      )}

      <div ref={resultRef}>
        {result && (
          <ConversionResult
            originalPreview={result.originalPreview}
            convertedPreview={result.convertedPreview}
            fileName={result.fileName}
            downloadContent={result.fullOutput}
            downloadFileName={result.fileName.replace(
              /\.[^.]+$/,
              `.${outputExtension}`
            )}
            traceId={result.traceId}
            toolId={toolId}
            outputFormat={outputExtension}
            workflowPush={workflowPush}
          />
        )}
      </div>
    </div>
  );
}
