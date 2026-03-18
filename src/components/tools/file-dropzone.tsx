"use client";

import { useCallback, useState } from "react";

interface FileDropzoneProps {
  accept: string;
  acceptLabel: string;
  onFileSelect: (file: File) => void;
}

export function FileDropzone({ accept, acceptLabel, onFileSelect }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 md:p-14 transition-all cursor-pointer ${
        isDragOver
          ? "border-blue-400 bg-blue-50/50 scale-[1.01]"
          : "border-border hover:border-blue-300 hover:bg-muted/20"
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 mb-4">
        <svg
          className="h-7 w-7 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>
      <p className="text-base font-medium">
        {isDragOver ? "Drop your file here" : "Drag & drop your file here"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        or click to browse &middot; {acceptLabel}
      </p>
    </div>
  );
}
