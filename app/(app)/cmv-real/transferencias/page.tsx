'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/layout/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';
import { TransferenciaForm, type TransferenciaParaEditar } from './TransferenciaForm';

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };
type Doc = {
  id: string;
  numeroDocumento: string;
  data: string;
  competencia: string;
  lojaOrigem: string;
  lojaDestino: string;
  status: string;
  origem: string;
  observacao: string | null;
  criadoPorId: string | null;
  criadoPorNome: string | null;
  criadoEm: string;
  editadoPorId: string | null;
  editadoEm: string | null;
  lados: Array<{
    tipo: string;
    rascunho: boolean;
    itens: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      unidade: string;
      custoUnitario: number | null;
      valorTotal: number | null;
    }>;
  }>;
};

const STATUS_LABEL: Record<string, string> = {
  AGUARDANDO_ENTRADA: 'Aguardando entrada',
  AGUARDANDO_SAIDA: 'Aguardando saída',
  CONCILIADA: 'Conciliada',
  DIVERGENTE: 'Divergente',
};

const STORES = Object.keys(CMV_STORE_LABELS);

function valorDoc(d: Doc) {
  const ladoSaida = d.lados.find((l) => l.tipo === 'SAIDA');
  const lado = ladoSaida ?? d.lados[0];
  return (lado?.itens ?? []).reduce((s, i) => s + (i.valorTotal ?? 0), 0);
}

function itensResumo(d: Doc) {
  const ladoSaida = d.lados.find((l) => l.tipo === 'SAIDA') ?? d.lados[0];
  return ladoSaida?.itens ?? [];
}

function docParaEditar(d: Doc): TransferenciaParaEditar {
  return {
    id: d.id,
    lojaOrigem: d.lojaOrigem,
    lojaDestino: d.lojaDestino,
    data: d.data,
    observacao: d.observacao,
    lados: d.lados,
  };
}

export default function CmvRealTransferenciasPage() {
  const now = new Date();
  const qs = useSearchParams();
  const [competencia, setCompetencia] = useState(
    qs.get('competencia') ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  );
  const [storeSlug, setStoreSlug] = useState(qs.get('storeSlug') || '');
  const [docs, setDocs] = useState<Doc[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [competenciaFechada, setCompetenciaFechada] = useState(false);
  const [lojasFechadas, setLojasFechadas] = useState<string[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [edicao, setEdicao] = useState<TransferenciaParaEditar | undefined>(undefined);

  const [excluirId, setExcluirId] = useState<string | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const lojasOpts = allowed && allowed.length > 0 ? allowed : STORES;

  const novaBloqueada = storeSlug
    ? lojasFechadas.includes(storeSlug)
    : competenciaFechada;

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
      setCompetenciaFechada(dt.competenciaFechada === true);
      setLojasFechadas(Array.isArray(dt.lojasFechadas) ? dt.lojasFechadas : []);
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

  const excluir = async (id: string) => {
    setExcluindoId(id);
    try {
      const res = await fetch(`/api/cmv-real/transferencias/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        setMsg(d.error || 'Erro ao excluir');
      } else {
        await load();
      }
    } catch {
      setMsg('Erro ao excluir');
    } finally {
      setExcluindoId(null);
      setExcluirId(null);
    }
  };

  const columns = useMemo<ColumnDef<Doc, unknown>[]>(
    () => [
      {
        accessorKey: 'data',
        header: 'Data',
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-foreground">
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
        id: 'itens',
        header: 'Itens',
        cell: ({ row }) => {
          const its = itensResumo(row.original);
          if (its.length === 0) return <span className="text-muted-foreground text-xs">—</span>;
          return (
            <div className="space-y-0.5">
              {its.map((it, i) => (
                <p key={i} className="text-xs text-muted-foreground tabular-nums">
                  {it.quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 3 })}{' '}
                  {it.unidade}
                </p>
              ))}
            </div>
          );
        },
      },
      {
        id: 'valor',
        header: 'Valor',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-foreground">
            {valorDoc(row.original).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        ),
      },
      {
        id: 'criadoPor',
        header: 'Registrado por',
        cell: ({ row }) => {
          const d = row.original;
          return (
            <div className="space-y-0.5">
              {d.criadoPorNome && (
                <p className="text-xs text-foreground">{d.criadoPorNome}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(d.criadoEm).toLocaleDateString('pt-BR')}
              </p>
              {d.editadoEm && (
                <p className="text-xs text-muted-foreground italic">
                  Editado {new Date(d.editadoEm).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs font-normal">
            {STATUS_LABEL[row.original.status] || row.original.status}
          </Badge>
        ),
      },
      {
        id: 'acoes',
        header: '',
        meta: { headerClassName: 'w-10', cellClassName: 'w-10' },
        cell: ({ row }) => {
          const d = row.original;
          const isManual = d.origem === 'MANUAL';
          if (!isManual) return null;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Ações</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setEdicao(docParaEditar(d));
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="size-4 mr-2 text-muted-foreground" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => setExcluirId(d.id)}
                >
                  <Trash2 className="size-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Button
          type="button"
          size="sm"
          className="shrink-0"
          disabled={novaBloqueada}
          onClick={() => {
            setEdicao(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nova transferência
        </Button>
      </div>

      {novaBloqueada ? (
        <p className="text-sm text-muted-foreground">
          Competência fechada — reabra o mês para lançar ou excluir transferência.
        </p>
      ) : null}

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
        getRowHref={(d) => `/cmv-real/transferencias/${d.id}`}
        emptyState={
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Nenhuma transferência neste período
            </p>
            <p className="text-xs text-muted-foreground">
              Use o formulário quando a mercadoria sair ou chegar. Não lance
              transferência na aba Lançamentos.
            </p>
            <Button
              type="button"
              size="sm"
              disabled={novaBloqueada}
              onClick={() => {
                setEdicao(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="size-4" />
              Nova transferência
            </Button>
          </div>
        }
        renderMobileRow={(d) => (
          <>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-foreground">
                {CMV_STORE_LABELS[d.lojaOrigem] || d.lojaOrigem}
                {' → '}
                {CMV_STORE_LABELS[d.lojaDestino] || d.lojaDestino}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {new Date(d.data).toLocaleDateString('pt-BR')}
              </span>
            </div>
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
            {d.origem === 'MANUAL' && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEdicao(docParaEditar(d));
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="size-3.5 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                  onClick={() => setExcluirId(d.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            )}
          </>
        )}
      />

      <TransferenciaForm
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEdicao(undefined);
        }}
        produtos={produtos}
        lojasOpts={lojasOpts}
        lojaPadrao={storeSlug || lojasOpts[0] || 'ahu'}
        edicao={edicao}
        onSaved={load}
      />

      <AlertDialog open={excluirId !== null} onOpenChange={(v) => !v && setExcluirId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transferência?</AlertDialogTitle>
            <AlertDialogDescription>
              Os lançamentos de CMV associados serão removidos. Esta ação pode ser refeita
              registrando novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={excluindoId !== null}
              onClick={() => {
                if (excluirId) void excluir(excluirId);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
