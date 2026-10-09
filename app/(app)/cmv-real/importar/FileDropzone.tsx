'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  file: File | null;
  accept?: string;
  disabled?: boolean;
  onFile: (file: File | null) => void;
};

export function FileDropzone({
  file,
  accept = '.xlsx,.xls',
  disabled,
  onFile,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = useCallback(
    (f: File | null) => {
      onFile(f);
    },
    [onFile]
  );

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0] || null)}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0] || null;
          if (f) pick(f);
        }}
        className={cn(
          'w-full rounded-md border border-dashed border-border bg-background px-4 py-8 text-center transition-colors',
          'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          dragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <Upload className="size-5 text-muted-foreground mx-auto mb-2" />
        {file ? (
          <p className="text-sm text-foreground font-medium truncate">{file.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Arraste o arquivo .xlsx aqui ou clique para escolher
          </p>
        )}
      </button>
    </div>
  );
}
