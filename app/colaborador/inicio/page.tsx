'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  labelCompetencia,
  labelPayslipStatusColaborador,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import { formatCentsBr } from '@/lib/holerites/ui-labels';
import type { PortalPayslipItem } from '@/lib/holerites/portal';

type InicioData = {
  nome: string;
  loja: string | null;
  pendentes: number;
  maisAntigoPendenteId: string | null;
  ultimo: PortalPayslipItem | null;
};

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] || nome;
}

export default function ColaboradorInicioPage() {
  const [data, setData] = useState<InicioData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/colaborador/inicio', {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('fail');
        const json = (await res.json()) as InicioData;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-4 py-8">
        <p className="text-sm text-destructive">
          Não foi possível carregar. Tente de novo.
        </p>
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => window.location.reload()}
        >
          Tentar de novo
        </Button>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="space-y-4 py-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-28 w-full" />
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 py-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Olá, {primeiroNome(data.nome)}
        </h1>
        {data.loja && (
          <p className="text-sm text-muted-foreground">{data.loja}</p>
        )}
      </div>

      {data.pendentes > 0 && data.maisAntigoPendenteId && (
        <Link
          href={`/colaborador/holerites/${data.maisAntigoPendenteId}`}
          className="block rounded-md border-2 border-primary bg-accent p-4"
        >
          <p className="text-base font-semibold text-accent-foreground">
            Você tem {data.pendentes} holerite
            {data.pendentes === 1 ? '' : 's'} para confirmar
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque para abrir o mais antigo
          </p>
        </Link>
      )}

      {data.ultimo ? (
        <Link
          href={`/colaborador/holerites/${data.ultimo.id}`}
          className="block rounded-md border border-border bg-card p-4"
        >
          <p className="text-xs text-muted-foreground">Último holerite</p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {labelCompetencia(data.ultimo.competencia)}
          </p>
          <p className="text-sm text-muted-foreground">
            {labelPayslipType(data.ultimo.type)}
          </p>
          {data.ultimo.netAmountCents != null && (
            <p className="mt-2 text-right text-lg font-semibold tabular-nums text-foreground">
              {formatCentsBr(data.ultimo.netAmountCents)}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {labelPayslipStatusColaborador(data.ultimo.status)}
            {data.ultimo.isRetificacao ? ' · Corrigido' : ''}
          </p>
        </Link>
      ) : (
        <div className="rounded-md border border-border bg-card p-6 text-left">
          <p className="text-sm text-foreground">
            Seus holerites vão aparecer aqui assim que o RH publicar.
          </p>
        </div>
      )}

      {data.ultimo && (
        <Button asChild variant="outline" className="min-h-12 w-full text-base">
          <Link href="/colaborador/holerites">Ver todos os holerites</Link>
        </Button>
      )}
    </main>
  );
}
