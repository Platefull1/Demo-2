'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/layout/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';
import { TransferenciaForm } from './TransferenciaForm';

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };
type Doc = {
  id: string;
  numeroDocumento: string;
  data: string;
  competencia: string;
  lojaOrigem: string;
  lojaDestino: string;
  status: string;
  lados: Array<{ tipo: string; rascunho: boolean; itens: Array<{ quantidade: number; valorTotal: number | null }> }>;
};

const STATUS_LABEL: Record<string, string> = {
  AGUARDANDO_ENTRADA: 'Aguardando entrada',
  AGUARDANDO_SAIDA: 'Aguardando saída',
  CONCILIADA: 'Conciliada',
  DIVERGENTE: 'Divergente',
};

const STORES = Object.keys(CMV_STORE_LABELS);

function valorDoc(d: Doc) {
  const lado = d.lados.find((l) => !l.rascunho) ?? d.lados[0];
  return (lado?.itens ?? []).reduce((s, i) => s + (i.valorTotal ?? 0), 0);
}

export default function CmvRealTransferenciasPage() {
  const now = new Date();
  const [competencia, setCompetencia] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  );
  const [storeSlug, setStoreSlug] = useState('');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const lojasOpts =
    allowed && allowed.length > 0 ? allowed : STORES;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ competencia });
      if (storeSlug) qs.set('storeSlug', storeSlug);
      const [resT, resP] = await Promise.all([
        fetch(`/api/cmv-real/transferencias?${qs}`, { cache: 'no-store' }),
        fetch('/api/cmv-real/produtos', { cache: 'no-store' }),
      ]);
      const dt = await resT.json();
      if (!resT.ok) throw new Error(dt.error || 'Erro');
      setDocs(dt.transferencias || []);
      setAllowed(dt.allowedStoreSlugs);
      setLojaTravada(dt.lojaTravada === true);
      if (
        dt.lojaTravada &&
        Array.isArray(dt.allowedStoreSlugs) &&
        dt.allowedStoreSlugs.length === 1
      ) {
        setStoreSlug(dt.allowedStoreSlugs[0]);
      }
      if (resP.ok) {
        const dp = await resP.json();
        setProdutos(
          (dp.itens || [])
            .filter((p: { ativo: boolean }) => p.ativo !== false)
            .map((p: Produto) => ({
              estoqueInsumoId: p.estoqueInsumoId,
              nome: p.nome,
              unidade: p.unidade,
            })),
        );
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [competencia, storeSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = useMemo<ColumnDef<Doc, unknown>[]>(
    () => [
      {
        accessorKey: 'numeroDocumento',
        header: 'Documento',
        cell: ({ row }) => (
          <span className="font-medium text-foreground">
            {row.original.numeroDocumento}
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
        id: 'rota',
        header: 'De → Para',
        cell: ({ row }) => (
          <span className="text-sm text-foreground">
            {CMV_STORE_LABELS[row.original.lojaOrigem] || row.original.lojaOrigem}
            {' → '}
            {CMV_STORE_LABELS[row.original.lojaDestino] || row.original.lojaDestino}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs font-normal">
            {STATUS_LABEL[row.original.status] || row.original.status}
          </Badge>
        ),
      },
      {
        id: 'valor',
        header: 'Valor',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => (
          <span className="tabular-nums text-foreground">
            {valorDoc(row.original).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm min-w-[140px]"
            value={storeSlug}
            disabled={lojaTravada && lojasOpts.length <= 1}
            onChange={(e) => setStoreSlug(e.target.value)}
          >
            {!lojaTravada ? <option value="">Todas as lojas</option> : null}
            {lojasOpts.map((s) => (
              <option key={s} value={s}>
                {CMV_STORE_LABELS[s] || s}
              </option>
            ))}
          </select>
          <Input
            type="month"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value)}
            className="h-9 w-[160px]"
          />
        </div>
        <Button type="button" size="sm" className="shrink-0" onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          Nova transferência
        </Button>
      </div>

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}

      <DataTable
        columns={columns}
        data={docs}
        loading={loading}
        pageSize={30}
        emptyState={
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nenhuma transferência neste período
            </p>
            <p className="text-xs text-muted-foreground">
              Use o formulário quando a mercadoria sair ou chegar. Não lance
              transferência na aba Lançamentos.
            </p>
            <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Nova transferência
            </Button>
          </div>
        }
        renderMobileRow={(d) => (
          <>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">
                {d.numeroDocumento}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(d.data).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {CMV_STORE_LABELS[d.lojaOrigem] || d.lojaOrigem} →{' '}
              {CMV_STORE_LABELS[d.lojaDestino] || d.lojaDestino}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {STATUS_LABEL[d.status] || d.status}
              </span>
              <span className="text-sm tabular-nums text-foreground">
                {valorDoc(d).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </>
        )}
      />

      <TransferenciaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        produtos={produtos}
        lojasOpts={lojasOpts}
        lojaPadrao={storeSlug || lojasOpts[0] || 'ahu'}
        onSaved={load}
      />
    </div>
  );
}
