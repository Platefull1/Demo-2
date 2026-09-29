'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

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

  const get = (id: string, field: keyof Item) => {
    if (dirty[id] && field in dirty[id]) {
      return dirty[id][field as keyof typeof dirty[typeof id]];
    }
    return itens.find((i) => i.id === id)?.[field];
  };

  const patchLocal = (id: string, patch: Partial<Item>) => {
    setDirty((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const salvar = async (id: string) => {
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
        prev.map((i) => (i.id === id ? { ...i, ...changes } : i)),
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
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white">Produtos CMV</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Seção, unidade, ordem e ativo — após a importação.
        </p>
      </div>

      {!canConfig && (
        <p className="text-xs text-gray-500 bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2">
          Somente visualização. É necessária a permissão cmv_real.config para editar.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar produto…"
          className="w-full bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2.5 text-sm"
        />
        <select
          value={secaoFiltro}
          onChange={(e) => setSecaoFiltro(e.target.value)}
          className="w-full bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Todas as seções</option>
          {SECOES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {msg && <p className="text-sm text-amber-300">{msg}</p>}

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          Nenhum produto. Importe o catálogo em Importar.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((it) => {
            const isDirty = Boolean(dirty[it.id] && Object.keys(dirty[it.id]).length);
            const secao = (get(it.id, 'secao') as string) || it.secao;
            const unidade = (get(it.id, 'unidade') as string) || it.unidade;
            const ordem = Number(get(it.id, 'ordem') ?? it.ordem);
            const ativo = Boolean(get(it.id, 'ativo') ?? it.ativo);

            return (
              <li
                key={it.id}
                className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-3 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {it.nome}
                    </p>
                    <p className="text-[10px] text-gray-600 truncate">{it.slug}</p>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                    <input
                      type="checkbox"
                      checked={ativo}
                      disabled={!canConfig}
                      onChange={(e) =>
                        patchLocal(it.id, { ativo: e.target.checked })
                      }
                      className="accent-amber-500"
                    />
                    Ativo
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">
                      Seção
                    </label>
                    <select
                      value={secao}
                      disabled={!canConfig}
                      onChange={(e) =>
                        patchLocal(it.id, {
                          secao: e.target.value as Item['secao'],
                        })
                      }
                      className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-2 py-2 text-xs disabled:opacity-60"
                    >
                      {SECOES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">
                      Unidade
                    </label>
                    <select
                      value={unidade}
                      disabled={!canConfig}
                      onChange={(e) =>
                        patchLocal(it.id, {
                          unidade: e.target.value as Item['unidade'],
                        })
                      }
                      className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-2 py-2 text-xs disabled:opacity-60"
                    >
                      <option value="KG">KG</option>
                      <option value="UN">UN</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-500 block mb-0.5">
                      Ordem
                    </label>
                    <input
                      type="number"
                      value={ordem}
                      disabled={!canConfig}
                      onChange={(e) =>
                        patchLocal(it.id, { ordem: Number(e.target.value) || 0 })
                      }
                      className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-2 py-2 text-xs disabled:opacity-60"
                    />
                  </div>
                  {canConfig && (
                    <button
                      type="button"
                      disabled={!isDirty || saving === it.id}
                      onClick={() => void salvar(it.id)}
                      className="flex items-center gap-1 rounded-lg bg-amber-500 text-black text-xs font-semibold px-3 py-2 disabled:opacity-40"
                    >
                      {saving === it.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Salvar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
