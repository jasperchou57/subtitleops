"use client";

interface ConversionResultProps {
  originalPreview: string;
  convertedPreview: string;
  fileName: string;
  downloadContent: string;
  downloadFileName: string;
}

export function ConversionResult({
  originalPreview,
  convertedPreview,
  fileName,
  downloadContent,
  downloadFileName,
}: ConversionResultProps) {
  const handleDownload = () => {
    const blob = new Blob([downloadContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 rounded-xl border bg-card p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="font-medium text-green-700">
          Converted successfully!
        </p>
        <span className="text-sm text-muted-foreground ml-auto">{fileName}</span>
      </div>

      {/* Before / After preview */}
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Original</p>
          <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">
            {originalPreview}
          </pre>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Converted (SRT)</p>
          <pre className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed overflow-auto max-h-48 font-mono">
            {convertedPreview}
          </pre>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download .srt
      </button>
    </div>
  );
}
