'use client';

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type Props = {
  arquivoUrl: string;
  downloadUrl?: string;
  onRendered?: () => void;
  /** Se false, esconde o botão de download no estado de erro. Default true. */
  showDownloadOnError?: boolean;
};

/**
 * Viewer multi-página via pdf.js (canvas). Worker acoplado à lib via import.meta.url.
 */
export function PayslipPdfViewer({
  arquivoUrl,
  downloadUrl,
  onRendered,
  showDownloadOnError = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const renderedRef = useRef(false);
  const onRenderedRef = useRef(onRendered);
  onRenderedRef.current = onRendered;

  useEffect(() => {
    let cancelled = false;
    let cleanupDoc: (() => void) | null = null;

    async function run() {
      setLoading(true);
      setError(false);
      renderedRef.current = false;

      try {
        const g = globalThis as typeof globalThis & { global?: typeof globalThis };
        if (typeof g.global === 'undefined') {
          g.global = globalThis;
        }

        const pdfjs = await import('pdfjs-dist');
        // (a) bundler resolve o worker da mesma versão do pdfjs-dist
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
        ).toString();

        const res = await fetch(arquivoUrl, { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = new Uint8Array(await res.arrayBuffer());
        if (cancelled) return;

        const pdf = await pdfjs.getDocument({ data }).promise;
        cleanupDoc = () => {
          void pdf.cleanup();
        };
        if (cancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = '';

        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const width = container.clientWidth || 360;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          if (cancelled) return;

          const unscaled = page.getViewport({ scale: 1 });
          const scale = width / unscaled.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          canvas.className =
            'mb-3 w-full rounded-md border border-border bg-card';

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('canvas');
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          container.appendChild(canvas);
        }

        if (!cancelled && !renderedRef.current) {
          renderedRef.current = true;
          setLoading(false);
          onRenderedRef.current?.();
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
      cleanupDoc?.();
    };
  }, [arquivoUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-md border border-border bg-card p-6 text-center">
        <p className="text-sm text-foreground">
          Não foi possível abrir o holerite
        </p>
        {showDownloadOnError && downloadUrl && (
          <Button asChild variant="outline" className="min-h-12 w-full sm:w-auto">
            <a href={downloadUrl}>Baixar PDF</a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-72 w-full rounded-md" />
          <Skeleton className="h-72 w-full rounded-md" />
        </div>
      )}
      <div
        ref={containerRef}
        className={loading ? 'absolute inset-0 overflow-hidden opacity-0' : ''}
        aria-busy={loading}
      />
    </div>
  );
}
