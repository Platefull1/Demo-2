'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Loader2, MoreHorizontal, Search } from 'lucide-react';
import { DataTable } from '@/components/layout/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { storeLabel } from '@/lib/nfe/ui-labels';
import { cn } from '@/lib/utils';

type NotaRow = {
  id: string;
  numero: string;
  storeSlug: string;
  status: string;
  dataEntrada: string;
  valorTotal: number;
  fornecedor: {
    razaoSocial: string;
    nomeFantasia: string | null;
    ignorarCmv: boolean;
  };
  itensTotal: number;
  itensProntos: number;
  itensSugeridos: number;
  itensSemMap: number;
};

type TabStatus = 'EM_REVISAO' | 'APROVADA' | 'IGNORADA';

const STATUS_TABS: { status: TabStatus; label: string }[] = [
  { status: 'EM_REVISAO', label: 'Para revisar' },
  { status: 'APROVADA', label: 'Aprovadas' },
  { status: 'IGNORADA', label: 'Fora do CMV' },
];

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function itensProntosOf(n: NotaRow): number {
  return (
    n.itensProntos ??
    Math.max(0, n.itensTotal - n.itensSugeridos - n.itensSemMap)
  );
}

function fornecedorNome(n: NotaRow): string {
  return n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial;
}

function formatValor(v: number): string {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function emptyTitle(status: TabStatus, mes: number, ano: number): string {
  const periodo = `${MESES[mes - 1]}/${ano}`;
  if (status === 'APROVADA') return `Nenhuma nota aprovada em ${periodo}`;
  if (status === 'IGNORADA') return `Nenhuma nota fora do CMV em ${periodo}`;
  return `Nenhuma nota para revisar em ${periodo}`;
}

function emptyHint(status: TabStatus): string {
  if (status === 'APROVADA')
    return 'Notas aprovadas neste período aparecerão aqui.';
  if (status === 'IGNORADA')
    return 'Notas marcadas como fora do CMV aparecerão aqui.';
  return 'Quando houver notas pendentes de revisão neste período, elas aparecerão aqui.';
}

export default function CmvRealNotasPage() {
  const agora = new Date();
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const [counts, setCounts] = useState({
    EM_REVISAO: 0,
    APROVADA: 0,
    IGNORADA: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [storeSlug, setStoreSlug] = useState('');
  const [status, setStatus] = useState<TabStatus>('EM_REVISAO');
  const [mes, setMes] = useState(agora.getMonth() + 1);
  const [ano, setAno] = useState(agora.getFullYear());
  const [canMapeamentoEditar, setCanMapeamentoEditar] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const anos = [agora.getFullYear(), agora.getFullYear() - 1, agora.getFullYear() - 2];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        status,
        mes: String(mes),
        ano: String(ano),
      });
      if (storeSlug) q.set('storeSlug', storeSlug);
      const res = await fetch(`/api/cmv-real/notas?${q}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setNotas(data.notas || []);
      setCounts(data.counts || { EM_REVISAO: 0, APROVADA: 0, IGNORADA: 0 });
      setLojaTravada(data.lojaTravada === true);
      setAllowed(data.allowedStoreSlugs);
      setCanMapeamentoEditar(data.canMapeamentoEditar === true);
      if (
        data.lojaTravada &&
        Array.isArray(data.allowedStoreSlugs) &&
        data.allowedStoreSlugs.length === 1
      ) {
        setStoreSlug(data.allowedStoreSlugs[0]);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug, status, mes, ano]);

  useEffect(() => {
    void load();
  }, [load]);

  const fornecedorFora = useCallback(
    async (notaId: string) => {
      if (
        !confirm(
          'Marcar este fornecedor como fora do CMV? A nota será ignorada.'
        )
      )
        return;
      setSavingId(notaId);
      setMsg(null);
      try {
        const res = await fetch(`/api/cmv-real/notas/${notaId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'fornecedor_fora_cmv' }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Falha');
        await load();
      } catch (e) {
        setMsg(e instanceof Error ? e.message : 'Erro');
      } finally {
        setSavingId(null);
      }
    },
    [load]
  );

  const lojasOpts =
    allowed && allowed.length > 0
      ? allowed
      : ['ahu', 'pilarzinho', 'portao', 'uberaba'];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notas;
    return notas.filter((n) => {
      const forn = fornecedorNome(n).toLowerCase();
      return n.numero.toLowerCase().includes(q) || forn.includes(q);
    });
  }, [notas, search]);

  const columns = useMemo<ColumnDef<NotaRow, unknown>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: 'NF',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.numero}
          </span>
        ),
      },
      {
        id: 'loja',
        accessorFn: (r) => storeLabel(r.storeSlug),
        header: 'Loja',
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className="bg-muted text-muted-foreground border-transparent font-normal"
          >
            {storeLabel(row.original.storeSlug)}
          </Badge>
        ),
      },
      {
        id: 'fornecedor',
        accessorFn: (r) => fornecedorNome(r),
        header: 'Fornecedor',
        cell: ({ row }) => (
          <span className="block max-w-[240px] truncate text-foreground">
            {fornecedorNome(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'dataEntrada',
        header: 'Data',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {new Date(row.original.dataEntrada).toLocaleDateString('pt-BR')}
          </span>
        ),
      },
      {
        accessorKey: 'valorTotal',
        header: 'Valor',
        meta: {
          headerClassName: 'text-right',
          cellClassName: 'text-right',
        },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {formatValor(row.original.valorTotal)}
          </span>
        ),
      },
      {
        id: 'itens',
        accessorFn: (r) => itensProntosOf(r),
        header: 'Itens prontos',
        cell: ({ row }) => {
          const prontos = itensProntosOf(row.original);
          const total = row.original.itensTotal;
          const completo = total > 0 && prontos >= total;
          return (
            <span
              className={cn(
                'tabular-nums',
                completo ? 'text-success' : 'text-muted-foreground'
              )}
            >
              {prontos}/{total}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { headerClassName: 'w-10', cellClassName: 'w-10' },
        cell: ({ row }) => {
          const n = row.original;
          const show =
            canMapeamentoEditar &&
            !n.fornecedor.ignorarCmv &&
            n.status === 'EM_REVISAO';
          if (!show) return null;
          const busy = savingId === n.id;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={busy}
                  aria-label="Mais opções"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    void fornecedorFora(n.id);
                  }}
                >
                  Fornecedor fora do CMV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [canMapeamentoEditar, savingId, fornecedorFora]
  );

  const storeSelectDisabled = lojaTravada && (allowed?.length ?? 0) <= 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ToggleGroup
          type="single"
          value={status}
          onValueChange={(v) => {
            if (v) setStatus(v as TabStatus);
          }}
          size="sm"
          className="w-full lg:w-fit flex-wrap"
        >
          {STATUS_TABS.map((t) => {
            const n = counts[t.status] ?? 0;
            return (
              <ToggleGroupItem
                key={t.status}
                value={t.status}
                className="text-xs px-2.5"
              >
                {t.label}
                <span className="tabular-nums opacity-80">({n})</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="relative w-full sm:w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="NF ou fornecedor"
              className="h-8 pl-8 text-sm"
            />
          </div>
          <Select
            value={
              storeSlug ||
              (!lojaTravada ? '__all__' : lojasOpts[0] ?? '__all__')
            }
            disabled={storeSelectDisabled}
            onValueChange={(v) => setStoreSlug(v === '__all__' ? '' : v)}
          >
            <SelectTrigger className="h-8 w-[140px] text-sm">
              <SelectValue placeholder="Loja" />
            </SelectTrigger>
            <SelectContent>
              {!lojaTravada && (
                <SelectItem value="__all__">Todas as lojas</SelectItem>
              )}
              {lojasOpts.map((s) => (
                <SelectItem key={s} value={s}>
                  {storeLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="h-8 w-[120px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
            <SelectTrigger className="h-8 w-[88px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        pageSize={50}
        initialSorting={[{ id: 'dataEntrada', desc: true }]}
        getRowHref={(row) => `/cmv-real/notas/${row.id}`}
        emptyState={
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {emptyTitle(status, mes, ano)}
            </p>
            <p className="text-xs text-muted-foreground">{emptyHint(status)}</p>
          </div>
        }
        renderMobileRow={(n) => {
          const prontos = itensProntosOf(n);
          const completo = n.itensTotal > 0 && prontos >= n.itensTotal;
          return (
            <>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <span>NF {n.numero}</span>
                <Badge
                  variant="secondary"
                  className="bg-muted text-muted-foreground border-transparent font-normal"
                >
                  {storeLabel(n.storeSlug)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {fornecedorNome(n)}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                {new Date(n.dataEntrada).toLocaleDateString('pt-BR')}
                {' · '}
                {formatValor(n.valorTotal)}
                {' · '}
                <span className={completo ? 'text-success' : undefined}>
                  {prontos}/{n.itensTotal}
                </span>
              </p>
            </>
          );
        }}
      />
    </div>
  );
}
