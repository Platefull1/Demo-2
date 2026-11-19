'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PayslipPdfViewer } from '@/components/colaborador/PayslipPdfViewer';
import {
  labelCompetencia,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import { formatDateSp, formatDateTimeSp } from '@/lib/holerites/ui-labels';
import type { PayslipType } from '@/lib/shared/holerites/types';

type Detail = {
  id: string;
  competencia: string;
  type: PayslipType;
  status: string;
  isRetificacao: boolean;
  replacedAt: string | null;
  acknowledgedAt: string | null;
  firstViewedAt: string | null;
};

export default function ColaboradorHoleriteDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [detail, setDetail] = useState<Detail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [aceite, setAceite] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/colaborador/holerites/${id}`, {
        credentials: 'include',
      });
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error('fail');
      const json = (await res.json()) as Detail;
      setDetail(json);
    } catch {
      setError(true);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const onRendered = useCallback(() => {
    setPdfReady(true);
  }, []);

  async function handleConfirm() {
    if (!aceite || !detail) return;
    setConfirming(true);
    setConfirmError(null);
    try {
      const res = await fetch(`/api/colaborador/holerites/${id}/ciencia`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ aceite: true }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setConfirmError(
          body.error || 'Não foi possível confirmar. Tente de novo.',
        );
        return;
      }
      const body = (await res.json()) as { acknowledgedAt: string };
      setDetail({
        ...detail,
        status: 'ACKNOWLEDGED',
        acknowledgedAt: body.acknowledgedAt,
      });
    } catch {
      setConfirmError('Falha de conexão. Tente de novo.');
    } finally {
      setConfirming(false);
    }
  }

  if (notFound) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-4 py-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Holerite não encontrado
        </h1>
        <p className="text-sm text-muted-foreground">
          Esse holerite não está disponível ou não pertence a você.
        </p>
        <Button asChild variant="outline" className="min-h-12 w-full">
          <Link href="/colaborador/holerites">Ver meus holerites</Link>
        </Button>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-4 py-8">
        <p className="text-sm text-destructive">Não foi possível carregar.</p>
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => {
            setError(false);
            void load();
          }}
        >
          Tentar de novo
        </Button>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="space-y-4 py-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-72 w-full" />
      </main>
    );
  }

  const mesLabel = labelCompetencia(detail.competencia);
  const tipoLabel = labelPayslipType(detail.type);
  const arquivoUrl = `/api/colaborador/holerites/${id}/arquivo`;
  const downloadUrl = `${arquivoUrl}?download=1`;
  const confirmed = detail.status === 'ACKNOWLEDGED' && detail.acknowledgedAt;

  return (
    <main className="flex flex-1 flex-col gap-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Holerite de {mesLabel}
        </h1>
        <p className="text-sm text-muted-foreground">{tipoLabel}</p>
        {detail.isRetificacao && detail.replacedAt && (
          <p className="text-sm text-muted-foreground">
            Corrigido em {formatDateSp(new Date(detail.replacedAt))}
          </p>
        )}
      </div>

      <PayslipPdfViewer
        arquivoUrl={arquivoUrl}
        downloadUrl={downloadUrl}
        onRendered={onRendered}
      />

      <Button asChild variant="outline" className="min-h-12 w-full text-base">
        <a href={downloadUrl}>Baixar PDF</a>
      </Button>

      {pdfReady && (
        <div className="rounded-md border border-border bg-card p-4 space-y-4">
          {confirmed ? (
            <p className="text-sm text-foreground">
              ✓ Recebimento confirmado em{' '}
              {formatDateTimeSp(new Date(detail.acknowledgedAt!))}
            </p>
          ) : (
            <>
              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={aceite}
                  onChange={(e) => setAceite(e.target.checked)}
                  className="mt-1 size-5 shrink-0 rounded border-input accent-primary"
                />
                <span>
                  Declaro que recebi e li meu holerite de {mesLabel} –{' '}
                  {tipoLabel}.
                </span>
              </label>
              {confirmError && (
                <p className="text-sm text-destructive" role="alert">
                  {confirmError}
                </p>
              )}
              <Button
                type="button"
                disabled={!aceite}
                loading={confirming}
                className="min-h-12 w-full text-base"
                onClick={handleConfirm}
              >
                Confirmar recebimento
              </Button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
