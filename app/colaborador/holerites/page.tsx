'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  labelCompetencia,
  labelPayslipStatusColaborador,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import type { PortalPayslipItem } from '@/lib/holerites/portal';

export default function ColaboradorHoleritesPage() {
  const [items, setItems] = useState<PortalPayslipItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (nextCursor: string | null, append: boolean) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(false);
    try {
      const qs = nextCursor
        ? `?cursor=${encodeURIComponent(nextCursor)}`
        : '';
      const res = await fetch(`/api/colaborador/holerites${qs}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('fail');
      const body = (await res.json()) as {
        items: PortalPayslipItem[];
        nextCursor: string | null;
      };
      setItems((prev) => (append ? [...prev, ...body.items] : body.items));
      setCursor(body.nextCursor);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void load(null, false);
  }, [load]);

  const byYear = useMemo(() => {
    const map = new Map<string, PortalPayslipItem[]>();
    for (const item of items) {
      const year = item.competencia.slice(0, 4) || '—';
      const list = map.get(year) ?? [];
      list.push(item);
      map.set(year, list);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [items]);

  if (loading) {
    return (
      <main className="space-y-4 py-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </main>
    );
  }

  if (error && items.length === 0) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-4 py-8">
        <p className="text-sm text-destructive">Não foi possível carregar.</p>
        <Button
          variant="outline"
          className="min-h-12 w-full"
          onClick={() => void load(null, false)}
        >
          Tentar de novo
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-6 py-6">
      <h1 className="text-2xl font-semibold text-foreground">Meus holerites</h1>

      {items.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-6">
          <p className="text-sm text-foreground">
            Seus holerites vão aparecer aqui assim que o RH publicar.
          </p>
        </div>
      ) : (
        byYear.map(([year, list]) => (
          <section key={year} className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {year}
            </h2>
            <ul className="space-y-3">
              {list.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/colaborador/holerites/${item.id}`}
                    className="block rounded-md border border-border bg-card p-4 active:bg-muted"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {labelCompetencia(item.competencia)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {labelPayslipType(item.type)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                          {labelPayslipStatusColaborador(item.status)}
                        </span>
                        {item.isRetificacao && (
                          <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
                            Corrigido
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      {cursor && (
        <Button
          type="button"
          variant="outline"
          className="min-h-12 w-full text-base"
          loading={loadingMore}
          onClick={() => void load(cursor, true)}
        >
          Carregar mais
        </Button>
      )}
    </main>
  );
}
