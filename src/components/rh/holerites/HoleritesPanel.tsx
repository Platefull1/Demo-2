'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Download, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MonthPicker } from '@/components/ui/month-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { PayslipRowActions } from '@/components/rh/holerites/PayslipRowActions';
import {
  labelCompetencia,
  labelPayslipStatusRh,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import { formatDateTimeSp, labelBatchStatus } from '@/lib/holerites/ui-labels';
import { competenciaMesAnterior } from '@/lib/holerites/rh-panel';
import { cn } from '@/lib/utils';
import type { PayslipType } from '@/lib/shared/holerites/types';

const TYPES: PayslipType[] = [
  'MENSAL',
  'ADIANTAMENTO',
  'DECIMO_TERCEIRO_1',
  'DECIMO_TERCEIRO_2',
  'FERIAS',
  'RESCISAO',
];

type Kpis = {
  publicados: number;
  abertos: number;
  confirmados: number;
  pendentes: number;
  pctAbertos: number;
  pctConfirmados: number;
  pctPendentes: number;
};

type Item = {
  id: string;
  competencia: string;
  type: PayslipType;
  status: string;
  isRetificacao: boolean;
  publishedAt: string | null;
  firstViewedAt: string | null;
  acknowledgedAt: string | null;
  loja: { id: string; nome: string };
  funcionario: { id: string; nome: string; temWhatsapp: boolean };
};

type Batch = {
  id: string;
  type: PayslipType;
  status: string;
  createdBy: string;
  createdAt: string;
  publishedAt: string | null;
  notifyStatus: string | null;
  travado: boolean;
};

type LojaOpt = { id: string; nome: string };

function cellBorder(index: number) {
  return cn(
    (index === 0 || index === 2) && 'border-r border-border',
    (index === 0 || index === 1) && 'border-b border-border xl:border-b-0',
    index < 3 && 'xl:border-r',
  );
}

function fmtDt(iso: string | null) {
  if (!iso) return '—';
  return formatDateTimeSp(new Date(iso));
}

export function HoleritesPanel({ lojas }: { lojas: LojaOpt[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const competencia = searchParams.get('competencia') ?? '';
  const type = searchParams.get('type') ?? '';
  const lojaId = searchParams.get('lojaId') ?? '';
  const status = searchParams.get('status') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1);

  /** Tenant sem lotes / URL sem ?competencia= → mês anterior (SP), nunca undefined. */
  const fallbackCompetencia = useMemo(() => competenciaMesAnterior(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [resolvedCompetencia, setResolvedCompetencia] = useState(
    () => competencia || competenciaMesAnterior(),
  );
  const syncedCompetencia = useRef(false);

  const monthPickerValue =
    resolvedCompetencia || competencia || fallbackCompetencia;

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (!v) next.delete(k);
        else next.set(k, v);
      }
      if (!('page' in patch)) next.delete('page');
      router.replace(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (competencia) p.set('competencia', competencia);
    if (type) p.set('type', type);
    if (lojaId) p.set('lojaId', lojaId);
    if (status) p.set('status', status);
    if (page > 1) p.set('page', String(page));
    return p.toString();
  }, [competencia, type, lojaId, status, page]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rh/holerites?${qs}`);
      if (res.status === 403) {
        setError('Sem permissão para visualizar holerites.');
        return;
      }
      if (!res.ok) throw new Error('fail');
      const body = (await res.json()) as {
        competencia: string;
        totalPages: number;
        kpis: Kpis;
        items: Item[];
        batches: Batch[];
      };
      setResolvedCompetencia(body.competencia);
      if (!competencia && body.competencia && !syncedCompetencia.current) {
        syncedCompetencia.current = true;
        const next = new URLSearchParams(searchParams.toString());
        next.set('competencia', body.competencia);
        router.replace(`${pathname}?${next.toString()}`);
      }
      setKpis(body.kpis);
      setItems(body.items);
      setBatches(body.batches);
      setTotalPages(body.totalPages);
    } catch {
      setError('Não foi possível carregar os holerites.');
    } finally {
      setLoading(false);
    }
  }, [qs, competencia, setParams]);

  useEffect(() => {
    void load();
  }, [load]);

  const kpiCards = kpis
    ? [
        {
          key: null as string | null,
          title: 'Publicados',
          value: kpis.publicados,
          pct: null as number | null,
        },
        {
          key: 'ABERTOS',
          title: 'Abertos',
          value: kpis.abertos,
          pct: kpis.pctAbertos,
        },
        {
          key: 'ACKNOWLEDGED',
          title: 'Confirmados',
          value: kpis.confirmados,
          pct: kpis.pctConfirmados,
        },
        {
          key: 'PENDENTES',
          title: 'Pendentes',
          value: kpis.pendentes,
          pct: kpis.pctPendentes,
        },
      ]
    : [];

  const exportHref = `/api/rh/holerites/export.csv?${new URLSearchParams({
    ...(resolvedCompetencia ? { competencia: resolvedCompetencia } : {}),
    ...(type ? { type } : {}),
    ...(lojaId ? { lojaId } : {}),
  }).toString()}`;

  async function reprocessar(batchId: string) {
    await fetch(`/api/rh/holerites/lotes/${batchId}/processar`, {
      method: 'POST',
    });
    void load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Holerites"
        description="Acompanhe publicação, visualização e confirmação por competência."
        actions={
          <>
            <Button asChild variant="outline">
              <a href={exportHref}>
                <Download className="size-4" />
                Exportar CSV
              </a>
            </Button>
            <Button asChild>
              <Link href="/rh/holerites/lotes/novo">
                <Plus className="size-4" />
                Novo lote
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
        <MonthPicker
          value={monthPickerValue}
          onChange={(v) => setParams({ competencia: v || null })}
          aria-label="Competência"
        />
        <Select
          value={type || '__all__'}
          onValueChange={(v) => setParams({ type: v === '__all__' ? null : v })}
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os tipos</SelectItem>
            {TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {labelPayslipType(t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={lojaId || '__all__'}
          onValueChange={(v) =>
            setParams({ lojaId: v === '__all__' ? null : v })
          }
        >
          <SelectTrigger className="h-8 w-[200px]">
            <SelectValue placeholder="Loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as lojas</SelectItem>
            {lojas.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status || '__all__'}
          onValueChange={(v) =>
            setParams({ status: v === '__all__' ? null : v })
          }
        >
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os status</SelectItem>
            <SelectItem value="PUBLISHED">Publicado</SelectItem>
            <SelectItem value="VIEWED">Aberto</SelectItem>
            <SelectItem value="ACKNOWLEDGED">Com ciência</SelectItem>
            <SelectItem value="PENDENTES">Pendentes</SelectItem>
            <SelectItem value="ABERTOS">Abertos</SelectItem>
            <SelectItem value="REVOKED">Revogado</SelectItem>
          </SelectContent>
        </Select>
        {(type || lojaId || status) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams({ type: null, lojaId: null, status: null })
            }
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {loading && !kpis ? (
            <div className="grid grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={cn('p-5', cellBorder(i))}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-9 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-4">
              {kpiCards.map((c, i) => (
                <button
                  key={c.title}
                  type="button"
                  onClick={() =>
                    setParams({ status: c.key, page: null })
                  }
                  className={cn(
                    'p-5 text-left transition-colors hover:bg-muted/40',
                    cellBorder(i),
                    status === c.key && 'bg-accent',
                  )}
                >
                  <p className="text-sm text-muted-foreground">{c.title}</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                    <AnimatedNumber value={c.value} format="integer" />
                  </p>
                  {c.pct != null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.pct}% dos publicados
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publicado em</TableHead>
                <TableHead>Visto em</TableHead>
                <TableHead>Confirmado em</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              )}
              {!loading && items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-8 text-sm text-muted-foreground"
                  >
                    Nenhum holerite neste filtro.
                  </TableCell>
                </TableRow>
              )}
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-sm text-foreground">
                    <div className="flex items-center gap-2">
                      <span>{item.funcionario.nome}</span>
                      {!item.funcionario.temWhatsapp && (
                        <span
                          title="Sem WhatsApp"
                          className="inline-flex text-muted-foreground"
                        >
                          <AlertTriangle className="size-3.5" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {item.loja.nome}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {labelPayslipType(item.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary">
                        {labelPayslipStatusRh(item.status as never)}
                      </Badge>
                      {item.isRetificacao && (
                        <Badge variant="outline">Retificação</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDt(item.publishedAt)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDt(item.firstViewedAt)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {fmtDt(item.acknowledgedAt)}
                  </TableCell>
                  <TableCell>
                    <PayslipRowActions
                      row={{
                        id: item.id,
                        status: item.status,
                        temWhatsapp: item.funcionario.temWhatsapp,
                      }}
                      onChanged={load}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setParams({ page: String(page - 1) })}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setParams({ page: String(page + 1) })}
          >
            Próxima
          </Button>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">
          Lotes
          {resolvedCompetencia
            ? ` · ${labelCompetencia(resolvedCompetencia)}`
            : ''}
        </h2>
        <Card className="bg-card border-border">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead>Avisos</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-6 text-sm text-muted-foreground"
                    >
                      Nenhum lote nesta competência.
                    </TableCell>
                  </TableRow>
                )}
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="text-sm">
                      {labelPayslipType(b.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">
                          {labelBatchStatus(b.status)}
                        </Badge>
                        {b.travado && (
                          <Badge variant="outline">Travado</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDt(b.createdAt)}
                      <br />
                      <span>{b.createdBy}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDt(b.publishedAt)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {b.notifyStatus ?? '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {b.travado && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void reprocessar(b.id)}
                          >
                            <RefreshCw className="size-4" />
                            Reprocessar
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/rh/holerites/lotes/${b.id}`}>Abrir</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
