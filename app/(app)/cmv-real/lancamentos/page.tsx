'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Loader2, Plus } from 'lucide-react';
import { DataTable } from '@/components/layout/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };
type Lanc = {
  id: string;
  storeSlug: string;
  data: string;
  tipo: string;
  estoqueInsumoId: string;
  quantidade: number;
  valorTotal: number;
  lojaOrigem: string | null;
  lojaDestino: string | null;
  observacao: string | null;
};

const TIPOS = [
  { value: 'COMPRA_MANUAL', label: 'Compra manual' },
  { value: 'DESPERDICIO', label: 'Desperdício' },
  { value: 'TRANSFERENCIA_SAIDA', label: 'Transf. saída' },
  { value: 'TRANSFERENCIA_ENTRADA', label: 'Transf. entrada' },
] as const;

const STORES = Object.entries(CMV_STORE_LABELS);

function labelTipo(t: string) {
  return TIPOS.find((x) => x.value === t)?.label || t;
}

function formatValor(v: number) {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function CmvRealLancamentosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lancs, setLancs] = useState<Lanc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [storeSlug, setStoreSlug] = useState('ahu');
  const [tipo, setTipo] = useState<string>('COMPRA_MANUAL');
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [lojaDestino, setLojaDestino] = useState('');
  const [lojaOrigem, setLojaOrigem] = useState('');
  const [observacao, setObservacao] = useState('');

  const lojasOpts =
    allowed && allowed.length > 0 ? allowed : STORES.map(([s]) => s);

  const lojaLabel = CMV_STORE_LABELS[storeSlug] || storeSlug;

  const produtoNome = useCallback(
    (estoqueInsumoId: string) =>
      produtos.find((p) => p.estoqueInsumoId === estoqueInsumoId)?.nome ||
      estoqueInsumoId,
    [produtos]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resL, resP] = await Promise.all([
        fetch(`/api/cmv-real/lancamentos?storeSlug=${storeSlug}`, {
          cache: 'no-store',
        }),
        fetch('/api/cmv-real/produtos', { cache: 'no-store' }),
      ]);
      const dl = await resL.json();
      if (!resL.ok) throw new Error(dl.error || 'Erro');
      setLancs(dl.lancamentos || []);
      setLojaTravada(dl.lojaTravada === true);
      setAllowed(dl.allowedStoreSlugs);
      if (
        dl.lojaTravada &&
        Array.isArray(dl.allowedStoreSlugs) &&
        dl.allowedStoreSlugs.length === 1
      ) {
        setStoreSlug(dl.allowedStoreSlugs[0]);
      }
      if (resP.ok) {
        const dp = await resP.json();
        setProdutos(
          (dp.itens || [])
            .filter((p: { ativo: boolean }) => p.ativo !== false)
            .map((p: Produto & { nome: string }) => ({
              estoqueInsumoId: p.estoqueInsumoId,
              nome: p.nome,
              unidade: p.unidade,
            }))
        );
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const salvar = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          storeSlug,
          data,
          estoqueInsumoId: produtoId,
          quantidade: Number(String(quantidade).replace(',', '.')),
          valorTotal: Number(String(valorTotal).replace(',', '.')),
          lojaDestino: tipo === 'TRANSFERENCIA_SAIDA' ? lojaDestino : undefined,
          lojaOrigem: tipo === 'TRANSFERENCIA_ENTRADA' ? lojaOrigem : undefined,
          observacao: observacao || undefined,
        }),
      });
      const dataRes = await res.json();
      if (!res.ok) throw new Error(dataRes.error || 'Falha');
      setShowForm(false);
      setQuantidade('');
      setValorTotal('');
      setObservacao('');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<ColumnDef<Lanc, unknown>[]>(
    () => [
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {labelTipo(row.original.tipo)}
          </span>
        ),
      },
      {
        accessorKey: 'data',
        header: 'Data',
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {new Date(row.original.data).toLocaleDateString('pt-BR')}
          </span>
        ),
      },
      {
        id: 'produto',
        accessorFn: (r) => produtoNome(r.estoqueInsumoId),
        header: 'Produto',
        cell: ({ row }) => (
          <span className="block max-w-[240px] truncate text-foreground">
            {produtoNome(row.original.estoqueInsumoId)}
          </span>
        ),
      },
      {
        accessorKey: 'quantidade',
        header: 'Qtd',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {row.original.quantidade}
          </span>
        ),
      },
      {
        accessorKey: 'valorTotal',
        header: 'Valor',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {formatValor(row.original.valorTotal)}
          </span>
        ),
      },
      {
        id: 'lojaRef',
        header: 'Loja',
        enableSorting: false,
        cell: ({ row }) => {
          const l = row.original;
          if (l.lojaDestino)
            return (
              <span className="text-muted-foreground text-xs">
                → {CMV_STORE_LABELS[l.lojaDestino] || l.lojaDestino}
              </span>
            );
          if (l.lojaOrigem)
            return (
              <span className="text-muted-foreground text-xs">
                ← {CMV_STORE_LABELS[l.lojaOrigem] || l.lojaOrigem}
              </span>
            );
          return <span className="text-muted-foreground">–</span>;
        },
      },
    ],
    [produtoNome]
  );

  const openForm = () => setShowForm(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={storeSlug}
          disabled={lojaTravada && lojasOpts.length <= 1}
          onValueChange={setStoreSlug}
        >
          <SelectTrigger className="h-8 w-full sm:w-[180px] text-sm">
            <SelectValue placeholder="Loja" />
          </SelectTrigger>
          <SelectContent>
            {lojasOpts.map((s) => (
              <SelectItem key={s} value={s}>
                {CMV_STORE_LABELS[s] || s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          size="sm"
          onClick={() => setShowForm((v) => !v)}
          className="shrink-0"
        >
          <Plus className="size-4" />
          Novo lançamento
        </Button>
      </div>

      {showForm && (
        <div className="rounded-md border border-border bg-card p-4 space-y-3 max-w-xl">
          <p className="text-base font-semibold text-foreground">Novo lançamento</p>
          <Select value={tipo} onValueChange={setTipo}>
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="h-9"
          />
          <Select value={produtoId || undefined} onValueChange={setProdutoId}>
            <SelectTrigger className="h-9 w-full text-sm">
              <SelectValue placeholder="Produto…" />
            </SelectTrigger>
            <SelectContent>
              {produtos.map((p) => (
                <SelectItem key={p.estoqueInsumoId} value={p.estoqueInsumoId}>
                  {p.nome} ({p.unidade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input
              inputMode="decimal"
              placeholder="Qtd"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="h-9"
            />
            <Input
              inputMode="decimal"
              placeholder="Valor R$"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              className="h-9"
            />
          </div>
          {tipo === 'TRANSFERENCIA_SAIDA' && (
            <Select value={lojaDestino || undefined} onValueChange={setLojaDestino}>
              <SelectTrigger className="h-9 w-full text-sm">
                <SelectValue placeholder="Loja destino…" />
              </SelectTrigger>
              <SelectContent>
                {STORES.filter(([s]) => s !== storeSlug).map(([s, lab]) => (
                  <SelectItem key={s} value={s}>
                    {lab}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {tipo === 'TRANSFERENCIA_ENTRADA' && (
            <Select value={lojaOrigem || undefined} onValueChange={setLojaOrigem}>
              <SelectTrigger className="h-9 w-full text-sm">
                <SelectValue placeholder="Loja origem…" />
              </SelectTrigger>
              <SelectContent>
                {STORES.filter(([s]) => s !== storeSlug).map(([s, lab]) => (
                  <SelectItem key={s} value={s}>
                    {lab}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input
            placeholder="Observação (opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="h-9"
          />
          <Button
            type="button"
            disabled={saving || !produtoId}
            onClick={() => void salvar()}
            className="w-full"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : 'Salvar'}
          </Button>
        </div>
      )}

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={lancs}
        loading={loading}
        pageSize={50}
        initialSorting={[{ id: 'data', desc: true }]}
        emptyState={
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Nenhum lançamento em {lojaLabel}
              </p>
              <p className="text-xs text-muted-foreground">
                Compras, desperdícios e transferências aparecem aqui.
              </p>
            </div>
            <Button type="button" size="sm" onClick={openForm}>
              <Plus className="size-4" />
              Novo lançamento
            </Button>
          </div>
        }
        renderMobileRow={(l) => (
          <>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">
                {labelTipo(l.tipo)}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(l.data).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {produtoNome(l.estoqueInsumoId)}
            </p>
            <p className="text-xs text-muted-foreground mt-1 tabular-nums">
              {l.quantidade} · {formatValor(l.valorTotal)}
              {l.lojaDestino &&
                ` → ${CMV_STORE_LABELS[l.lojaDestino] || l.lojaDestino}`}
              {l.lojaOrigem &&
                ` ← ${CMV_STORE_LABELS[l.lojaOrigem] || l.lojaOrigem}`}
            </p>
          </>
        )}
      />
    </div>
  );
}
