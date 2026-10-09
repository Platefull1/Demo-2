'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Loader2, Lock, Save, Search } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';

type Item = {
  id: string;
  estoqueInsumoId: string;
  nome: string;
  slug: string;
  secao: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
  unidade: 'KG' | 'UN';
  ordem: number;
  ativo: boolean;
};

const SECOES = [
  { value: 'MATERIA_PRIMA', label: 'Matéria-prima' },
  { value: 'EMBALAGEM', label: 'Embalagem' },
  { value: 'BEBIDA', label: 'Bebida' },
] as const;

function secaoLabel(v: string) {
  return SECOES.find((s) => s.value === v)?.label || v;
}

export default function CmvRealProdutosPage() {
  const [itens, setItens] = useState<Item[]>([]);
  const [canConfig, setCanConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('');
  const [secaoFiltro, setSecaoFiltro] = useState('');
  const [dirty, setDirty] = useState<Record<string, Partial<Item>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cmv-real/produtos', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setItens(data.itens || []);
      setCanConfig(data.canConfig === true);
      setDirty({});
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    return itens.filter((i) => {
      if (secaoFiltro && i.secao !== secaoFiltro) return false;
      if (!q) return true;
      return i.nome.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q);
    });
  }, [itens, filtro, secaoFiltro]);

  const get = useCallback(
    (id: string, field: keyof Item) => {
      if (dirty[id] && field in dirty[id]) {
        return dirty[id][field as keyof (typeof dirty)[string]];
      }
      return itens.find((i) => i.id === id)?.[field];
    },
    [dirty, itens]
  );

  const patchLocal = useCallback((id: string, patch: Partial<Item>) => {
    setDirty((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const salvar = useCallback(
    async (id: string) => {
      const changes = dirty[id];
      if (!changes || Object.keys(changes).length === 0) return;
      setSaving(id);
      setMsg(null);
      try {
        const res = await fetch('/api/cmv-real/produtos', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, ...changes }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Falha');
        setItens((prev) =>
          prev.map((i) => (i.id === id ? { ...i, ...changes } : i))
        );
        setDirty((prev) => {
          const n = { ...prev };
          delete n[id];
          return n;
        });
      } catch (e) {
        setMsg(e instanceof Error ? e.message : 'Erro');
      } finally {
        setSaving(null);
      }
    },
    [dirty]
  );

  const columns = useMemo<ColumnDef<Item, unknown>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Produto',
        cell: ({ row }) => (
          <div className="min-w-0 max-w-[260px]">
            <p className="text-sm font-medium text-foreground truncate">
              {row.original.nome}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {row.original.slug}
            </p>
          </div>
        ),
      },
      {
        id: 'secao',
        accessorFn: (r) => (get(r.id, 'secao') as string) || r.secao,
        header: 'Seção',
        cell: ({ row }) => {
          const it = row.original;
          const secao = (get(it.id, 'secao') as string) || it.secao;
          if (!canConfig) {
            return (
              <span className="text-sm text-foreground">{secaoLabel(secao)}</span>
            );
          }
          return (
            <Select
              value={secao}
              onValueChange={(v) =>
                patchLocal(it.id, { secao: v as Item['secao'] })
              }
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECOES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: 'unidade',
        accessorFn: (r) => (get(r.id, 'unidade') as string) || r.unidade,
        header: 'Unidade',
        cell: ({ row }) => {
          const it = row.original;
          const unidade = (get(it.id, 'unidade') as string) || it.unidade;
          if (!canConfig) {
            return <span className="text-sm text-foreground">{unidade}</span>;
          }
          return (
            <Select
              value={unidade}
              onValueChange={(v) =>
                patchLocal(it.id, { unidade: v as Item['unidade'] })
              }
            >
              <SelectTrigger className="h-8 w-[72px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KG">KG</SelectItem>
                <SelectItem value="UN">UN</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        id: 'ordem',
        accessorFn: (r) => Number(get(r.id, 'ordem') ?? r.ordem),
        header: 'Ordem',
        meta: { headerClassName: 'w-20', cellClassName: 'w-20' },
        cell: ({ row }) => {
          const it = row.original;
          const ordem = Number(get(it.id, 'ordem') ?? it.ordem);
          if (!canConfig) {
            return (
              <span className="text-sm tabular-nums text-foreground">{ordem}</span>
            );
          }
          return (
            <Input
              type="number"
              value={ordem}
              onChange={(e) =>
                patchLocal(it.id, { ordem: Number(e.target.value) || 0 })
              }
              className="h-8 w-16 text-xs tabular-nums"
            />
          );
        },
      },
      {
        id: 'ativo',
        accessorFn: (r) => Boolean(get(r.id, 'ativo') ?? r.ativo),
        header: 'Ativo',
        cell: ({ row }) => {
          const it = row.original;
          const ativo = Boolean(get(it.id, 'ativo') ?? it.ativo);
          if (!canConfig) {
            return (
              <span className="text-sm text-foreground">
                {ativo ? 'Sim' : 'Não'}
              </span>
            );
          }
          return (
            <Switch
              checked={ativo}
              onCheckedChange={(v) => patchLocal(it.id, { ativo: v })}
              aria-label={`Ativo: ${it.nome}`}
            />
          );
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { headerClassName: 'w-24', cellClassName: 'w-24' },
        cell: ({ row }) => {
          if (!canConfig) return null;
          const it = row.original;
          const isDirty = Boolean(
            dirty[it.id] && Object.keys(dirty[it.id]).length
          );
          if (!isDirty) return null;
          return (
            <Button
              type="button"
              size="sm"
              disabled={saving === it.id}
              onClick={() => void salvar(it.id)}
              className="h-8"
            >
              {saving === it.id ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Salvar
            </Button>
          );
        },
      },
    ],
    [canConfig, dirty, get, patchLocal, salvar, saving]
  );

  return (
    <div className="space-y-6">
      {!canConfig && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5 shrink-0 text-muted-foreground" />
          Somente visualização. Peça acesso de configuração para editar.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar produto…"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Select
          value={secaoFiltro || '__all__'}
          onValueChange={(v) => setSecaoFiltro(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="h-8 w-full sm:w-[160px] text-sm">
            <SelectValue placeholder="Seção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as seções</SelectItem>
            {SECOES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        initialSorting={[{ id: 'ordem', desc: false }]}
        interactiveColumnIds={['secao', 'unidade', 'ordem', 'ativo', 'actions']}
        emptyState={
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Nenhum produto</p>
            <p className="text-xs text-muted-foreground">
              Importe o catálogo na aba Importar.
            </p>
          </div>
        }
      />
    </div>
  );
}
