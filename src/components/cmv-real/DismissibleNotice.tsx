'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  clearDismissedFingerprint,
  readDismissedFingerprint,
  writeDismissedFingerprint,
} from '@/lib/cmv-real/dismiss-storage';
import { cn } from '@/lib/utils';

/**
 * Caixa de aviso fechável. Fundo muted; único warning = ícone.
 * Expõe estado aberto/fechado para o pai colocar chip na toolbar.
 */
export function useDismissibleNotice(opts: {
  kind: string;
  storeSlug: string;
  competencia: string;
  fingerprint: string;
  enabled: boolean;
}) {
  const { kind, storeSlug, competencia, fingerprint, enabled } = opts;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!enabled || !fingerprint) {
      setOpen(false);
      return;
    }
    const saved = readDismissedFingerprint(kind, storeSlug, competencia);
    setOpen(saved !== fingerprint);
  }, [kind, storeSlug, competencia, fingerprint, enabled]);

  const dismiss = () => {
    writeDismissedFingerprint(kind, storeSlug, competencia, fingerprint);
    setOpen(false);
  };

  const reopen = () => {
    clearDismissedFingerprint(kind, storeSlug, competencia);
    setOpen(true);
  };

  return {
    open: enabled && open,
    visible: enabled,
    dismissed: enabled && !open,
    dismiss,
    reopen,
  };
}

export function DismissibleNoticeBox({
  title,
  children,
  onDismiss,
  className,
}: {
  title: string;
  children: React.ReactNode;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        'relative rounded-md border border-border bg-muted px-4 py-3 pr-10',
        className
      )}
    >
      <div className="flex gap-2">
        <AlertTriangle
          className="size-4 shrink-0 text-warning mt-0.5"
          aria-hidden
        />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <div className="text-xs text-muted-foreground space-y-0.5">
            {children}
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 size-8 text-muted-foreground"
        onClick={onDismiss}
        aria-label="Fechar aviso"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

/** Chip compacto na toolbar para reabrir aviso fechado. */
export function DismissibleNoticeChip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      {label}
    </Button>
  );
}
