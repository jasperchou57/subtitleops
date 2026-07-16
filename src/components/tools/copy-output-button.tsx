'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';

type CopyOutputButtonProps = {
  content: string;
  toolId: string;
  outputFormat?: string;
  className?: string;
};

async function copyText(content: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(content);
      return;
    } catch {
      // Fall through to the textarea copy path for browsers that expose the API
      // but block it because of permissions or context.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = content;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('copy_failed');
  }
}

export function CopyOutputButton({
  content,
  toolId,
  outputFormat,
  className,
}: CopyOutputButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await copyText(content);
      setStatus('copied');
      trackEvent({
        tool: toolId,
        action: 'copy_output',
        output_format: outputFormat,
        file_size: content.length,
      });
    } catch {
      setStatus('failed');
      trackEvent({
        tool: toolId,
        action: 'copy_error',
        output_format: outputFormat,
        error_type: 'clipboard_write_failed',
      });
    }

    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => setStatus('idle'), 1800);
  };

  const isCopied = status === 'copied';

  return (
    <button
      data-analytics-control="copy_output"
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent',
        className
      )}
      aria-live="polite"
    >
      {isCopied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {status === 'failed'
        ? 'Copy failed'
        : isCopied
          ? 'Copied'
          : 'Copy output'}
    </button>
  );
}
