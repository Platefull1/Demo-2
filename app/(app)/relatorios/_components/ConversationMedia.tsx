'use client';

import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';

/** Mídia de mensagem WhatsApp (mesmo fetch/comportamento do modal legado). */
export function ConversationMedia({
  messageId,
  messageType,
}: {
  messageId: string;
  messageType: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    (async () => {
      try {
        const res = await fetch(`/api/whatsapp-messages/${messageId}/media`);
        if (!res.ok) {
          if (!cancelled) setFailed(true);
          return;
        }
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.startsWith('image/')) {
          const blob = await res.blob();
          objectUrl = URL.createObjectURL(blob);
          if (!cancelled) {
            setIsThumbnail(false);
            setUrl(objectUrl);
          }
        } else {
          const data = await res.json().catch(() => ({}));
          if (!data.url) {
            if (!cancelled) setFailed(true);
            return;
          }
          if (!cancelled) {
            setIsThumbnail(Boolean(data.isThumbnail));
            setUrl(data.url as string);
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [messageId]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  if (failed) {
    return <p className="text-xs text-muted-foreground mt-1">Foto indisponível</p>;
  }
  if (!url) {
    return <Loader2 className="size-4 text-muted-foreground animate-spin mt-2" />;
  }

  const label = messageType === 'sticker' ? 'Figurinha' : 'Foto da conversa';

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="mt-2 block rounded-lg border border-border overflow-hidden hover:border-primary/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title="Clique para ampliar"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={label}
          className="max-h-24 w-auto max-w-[200px] object-cover cursor-zoom-in"
        />
      </button>
      <p className="text-xs text-muted-foreground mt-1">
        {isThumbnail
          ? 'Prévia de baixa resolução (mídia original não arquivada)'
          : 'Clique na imagem para ampliar'}
      </p>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/90 p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={label}
            className="rounded-lg shadow-2xl block max-w-[90vw] max-h-[88vh] w-auto h-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {isThumbnail && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-warning text-center max-w-md px-4">
              Esta é só a prévia do WhatsApp. A foto em resolução completa não foi
              salva no arquivo.
            </p>
          )}
        </div>
      )}
    </>
  );
}
