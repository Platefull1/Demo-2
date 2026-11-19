'use client';

import { useState } from 'react';
import { MoreHorizontal, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PayslipPdfViewer } from '@/components/holerites/PayslipPdfViewer';
import { formatDateTimeSp } from '@/lib/holerites/ui-labels';
import type { PayslipStatus } from '@/lib/shared/holerites/types';

export type PayslipRow = {
  id: string;
  status: PayslipStatus | string;
  temWhatsapp: boolean;
};

type HistoryItem = {
  id: string;
  actorName: string;
  action: string;
  ip: string | null;
  note: string | null;
  createdAt: string;
};

const ACTION_LABEL: Record<string, string> = {
  view: 'Visualização',
  download: 'Download',
  acknowledge: 'Confirmação',
  revoke: 'Revogação',
};

type Props = {
  row: PayslipRow;
  onChanged?: () => void;
};

export function PayslipRowActions({ row, onChanged }: Props) {
  const [pdfOpen, setPdfOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [hist, setHist] = useState<HistoryItem[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canResend =
    (row.status === 'PUBLISHED' || row.status === 'VIEWED') && row.temWhatsapp;
  const revokeDisabled = row.status === 'ACKNOWLEDGED';

  async function openHistorico() {
    setHistOpen(true);
    setHistLoading(true);
    try {
      const res = await fetch(`/api/rh/holerites/${row.id}/historico`);
      if (!res.ok) throw new Error('fail');
      const body = (await res.json()) as { items: HistoryItem[] };
      setHist(body.items);
    } catch {
      setHist([]);
    } finally {
      setHistLoading(false);
    }
  }

  async function reenviar() {
    setBusy(true);
    setToast(null);
    try {
      const res = await fetch(`/api/rh/holerites/${row.id}/reenviar-aviso`, {
        method: 'POST',
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToast(body.error || 'Falha ao reenviar');
        return;
      }
      setToast('Aviso reenviado');
    } catch {
      setToast('Falha de conexão');
    } finally {
      setBusy(false);
    }
  }

  async function revogar() {
    if (motivo.trim().length < 10) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/rh/holerites/${row.id}/revogar`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ motivo: motivo.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setToast(body.error || 'Não foi possível revogar');
        return;
      }
      setRevokeOpen(false);
      setMotivo('');
      onChanged?.();
    } catch {
      setToast('Falha de conexão');
    } finally {
      setBusy(false);
    }
  }

  const arquivoUrl = `/api/rh/holerites/${row.id}/arquivo`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4 text-muted-foreground" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setPdfOpen(true)}>
            Ver PDF
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canResend || busy} onClick={reenviar}>
            Reenviar aviso
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openHistorico}>Ver histórico</DropdownMenuItem>
          <DropdownMenuSeparator />
          {revokeDisabled ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem disabled>Revogar</DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Já confirmado pelo funcionário. Para corrigir, publique um novo
                  lote (retificação).
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setRevokeOpen(true)}
            >
              Revogar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {toast && (
        <p className="sr-only" role="status">
          {toast}
        </p>
      )}

      <Sheet open={pdfOpen} onOpenChange={setPdfOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Holerite</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {pdfOpen && (
              <PayslipPdfViewer
                arquivoUrl={arquivoUrl}
                downloadUrl={`${arquivoUrl}?download=1`}
              />
            )}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <a href={`${arquivoUrl}?download=1`}>Baixar PDF</a>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={histOpen} onOpenChange={setHistOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Histórico de acesso</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            {histLoading && (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            )}
            {!histLoading && hist.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem eventos.</p>
            )}
            {hist.map((h) => (
              <div
                key={h.id}
                className="rounded-md border border-border bg-card p-3 space-y-1"
              >
                <p className="text-sm text-foreground">
                  {ACTION_LABEL[h.action] ?? h.action} · {h.actorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTimeSp(new Date(h.createdAt))}
                  {h.ip ? ` · IP ${h.ip}` : ''}
                </p>
                {h.note && (
                  <p className="text-xs text-muted-foreground">{h.note}</p>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={revokeOpen} onOpenChange={setRevokeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revogar holerite</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex gap-2">
              <AlertTriangle className="size-4 shrink-0 text-muted-foreground" />
              O funcionário não verá mais este holerite no portal.
            </p>
            <label className="text-sm text-muted-foreground" htmlFor="motivo">
              Motivo (obrigatório)
            </label>
            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground"
              placeholder="Descreva o motivo da revogação…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              loading={busy}
              disabled={motivo.trim().length < 10}
              onClick={revogar}
            >
              Revogar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
