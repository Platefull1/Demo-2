'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FileSpreadsheet, Loader2, RefreshCw, Upload } from 'lucide-react';
import { ImportarSaldoBlock } from './ImportarSaldoBlock';

type PreviewStatus = 'casado' | 'sugerido' | 'nao_encontrado';

type PreviewItem = {
  linha: number;
  nome: string;
  secao: string;
  unidade: string;
  ordem: number;
  status: PreviewStatus;
  estoqueInsumoId?: string;
  estoqueNome?: string;
  score?: number;
  kgPorUnidade?: number | null;
};

/** Decisão do usuário por linha */
type RowAction = 'vincular' | 'criar' | 'ignorar' | 'escolher' | null;

type RowState = PreviewItem & {
  action: RowAction;
  /** id escolhido (vincular / escolher outro) */
  chosenId?: string;
  chosenNome?: string;
};

type CatalogOption = { id: string; nome: string };

function defaultAction(status: PreviewStatus): RowAction {
  if (status === 'casado') return 'vincular';
  if (status === 'nao_encontrado') return 'ignorar';
  return null; // sugerido: exige escolha
}

export default function CmvRealImportarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [abas, setAbas] = useState<string[]>([]);
  const [aba, setAba] = useState('');
  const [rows, setRows] = useState<RowState[] | null>(null);
  const [resumo, setResumo] = useState<{
    total: number;
    casados: number;
    sugeridos: number;
    naoEncontrados: number;
    catalogoEstoqueSize?: number | null;
  } | null>(null);
  const [catalogo, setCatalogo] = useState<CatalogOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [reproc, setReproc] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/estoque/insumos', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.insumos ?? [];
        setCatalogo(
          list.map((i: { id: string; nome: string }) => ({ id: i.id, nome: i.nome })),
        );
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const counts = useMemo(() => {
    if (!rows) return { vincular: 0, criar: 0, ignorar: 0, pendentes: 0 };
    let vincular = 0;
    let criar = 0;
    let ignorar = 0;
    let pendentes = 0;
    for (const r of rows) {
      if (r.action === null) {
        pendentes++;
      } else if (r.action === 'escolher' && !r.chosenId) {
        pendentes++;
      } else if (r.action === 'criar') {
        criar++;
      } else if (r.action === 'ignorar') {
        ignorar++;
      } else if (r.action === 'vincular' || r.action === 'escolher') {
        vincular++;
      }
    }
    return { vincular, criar, ignorar, pendentes };
  }, [rows]);

  const canConfirm = !!rows && counts.pendentes === 0 && !loading;

  const listarAbas = useCallback(async (f: File) => {
    setLoading(true);
    setMsg(null);
    setRows(null);
    try {
      const fd = new FormData();
      fd.set('action', 'listar-abas');
      fd.set('file', f);
      const res = await fetch('/api/cmv-real/importar-catalogo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao ler abas');
      setAbas(data.abas || []);
      setAba(data.abas?.[0] || '');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  const gerarPreview = useCallback(async () => {
    if (!file || !aba) return;
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set('action', 'preview');
      fd.set('file', file);
      fd.set('aba', aba);
      const res = await fetch('/api/cmv-real/importar-catalogo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no preview');
      const itens = (data.itens as PreviewItem[]).map((p) => {
        const action = defaultAction(p.status);
        return {
          ...p,
          action,
          chosenId: action === 'vincular' ? p.estoqueInsumoId : undefined,
          chosenNome: action === 'vincular' ? p.estoqueNome : undefined,
        } satisfies RowState;
      });
      setRows(itens);
      setResumo({
        total: data.total,
        casados: data.casados,
        sugeridos: data.sugeridos,
        naoEncontrados: data.naoEncontrados,
        catalogoEstoqueSize: data.catalogoEstoqueSize,
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [file, aba]);

  const setRowAction = (idx: number, action: RowAction, chosen?: CatalogOption) => {
    setRows((prev) => {
      if (!prev) return prev;
      return prev.map((r, i) => {
        if (i !== idx) return r;
        if (action === 'vincular') {
          return {
            ...r,
            action: 'vincular',
            chosenId: r.estoqueInsumoId,
            chosenNome: r.estoqueNome,
          };
        }
        if (action === 'escolher' && chosen) {
          return {
            ...r,
            action: 'escolher',
            chosenId: chosen.id,
            chosenNome: chosen.nome,
          };
        }
        if (action === 'escolher') {
          return { ...r, action: 'escolher', chosenId: undefined, chosenNome: undefined };
        }
        return { ...r, action, chosenId: undefined, chosenNome: undefined };
      });
    });
  };

  const confirmar = useCallback(async () => {
    if (!rows || counts.pendentes > 0) return;
    setLoading(true);
    setMsg(null);
    try {
      const criar = rows
        .filter((r) => r.action === 'criar')
        .map((r) => ({
          nome: r.nome,
          secao: r.secao as 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA',
          unidade: r.unidade as 'KG' | 'UN',
          ordem: r.ordem,
        }));

      const criadosMap = new Map<string, string>();
      if (criar.length > 0) {
        const resC = await fetch('/api/cmv-real/importar-catalogo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'criar-insumo', criar }),
        });
        const dataC = await resC.json();
        if (!resC.ok) throw new Error(dataC.error || 'Falha ao criar insumos');
        for (const c of dataC.criados || []) {
          criadosMap.set(c.nome, c.estoqueInsumoId);
        }
      }

      const itens = rows
        .map((r) => {
          if (r.action === 'ignorar' || r.action === null) return null;
          let id: string | undefined;
          if (r.action === 'criar') id = criadosMap.get(r.nome);
          else id = r.chosenId || r.estoqueInsumoId;
          if (!id) return null;
          return {
            nome: r.nome,
            secao: r.secao,
            unidade: r.unidade,
            ordem: r.ordem,
            estoqueInsumoId: id,
          };
        })
        .filter(Boolean);

      const res = await fetch('/api/cmv-real/importar-catalogo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirmar', itens }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao confirmar');
      setMsg(`Catálogo atualizado: ${data.upserted} produtos em CmvRealInsumoConfig.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [rows, counts.pendentes]);

  const reprocessar = useCallback(async () => {
    setLoading(true);
    setReproc(null);
    try {
      const res = await fetch('/api/cmv-real/reprocessar', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao reprocessar');
      setReproc(
        `Reprocessadas: ${data.processadas} · Sugestões: ${data.sugeridos} · ` +
          `Aprovadas: ${data.aprovadas} · Ainda em revisão: ${data.aindaEmRevisao}`,
      );
    } catch (e) {
      setReproc(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmLabel = rows
    ? `Vincular ${counts.vincular} · Criar ${counts.criar} · Ignorar ${counts.ignorar}`
    : 'Confirmar';

  return (
    <div className="space-y-6">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2 text-white">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            Importar catálogo
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Lê a planilha CMV DESPERDÍCIO e cria/atualiza CmvRealInsumoConfig (sem saldo).
          </p>
        </div>

        <section className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-4 space-y-4">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-gray-400">Arquivo .xlsx</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-1.5 file:text-amber-300"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                setAbas([]);
                setRows(null);
                if (f) void listarAbas(f);
              }}
            />
          </label>

          {abas.length > 0 && (
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-gray-400">Aba (mês)</span>
              <select
                value={aba}
                onChange={(e) => setAba(e.target.value)}
                className="bg-[#0a0a0a] border border-[#2a2a2e] rounded-lg px-3 py-2"
              >
                {abas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!file || !aba || loading}
              onClick={() => void gerarPreview()}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500/90 hover:bg-amber-400 text-black font-medium px-4 py-2 text-sm disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Prévia do catálogo
            </button>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => void confirmar()}
              title={
                counts.pendentes > 0
                  ? `${counts.pendentes} sugestão(ões) sem decisão`
                  : undefined
              }
              className="inline-flex items-center gap-2 rounded-lg border border-green-500/40 text-green-400 hover:bg-green-500/10 px-4 py-2 text-sm disabled:opacity-40"
            >
              {confirmLabel}
            </button>
          </div>

          {resumo && (
            <p className="text-sm text-gray-400">
              {resumo.total} na planilha · {resumo.casados} casados · {resumo.sugeridos}{' '}
              sugeridos · {resumo.naoEncontrados} não encontrados
              {resumo.catalogoEstoqueSize != null && (
                <> · catálogo Estoque: {resumo.catalogoEstoqueSize} produtos</>
              )}
              {counts.pendentes > 0 && (
                <span className="text-amber-400">
                  {' '}
                  · {counts.pendentes} sugestão(ões) aguardando decisão
                </span>
              )}
            </p>
          )}
          {msg && <p className="text-sm text-amber-300">{msg}</p>}
        </section>

        <section className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">Após importar o catálogo</h2>
          <p className="text-xs text-gray-500">
            Reprocessa notas em revisão para gerar sugestões por similaridade.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={() => void reprocessar()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1a1a1e] border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 px-4 py-2 text-sm disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Reprocessar notas em revisão
          </button>
          {reproc && <p className="text-sm text-gray-300">{reproc}</p>}
        </section>

        {rows && (
          <div className="rounded-xl border border-[#2a2a2e] overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                  <tr className="text-left text-gray-400">
                    <th className="px-3 py-2">Linha</th>
                    <th className="px-3 py-2">Produto</th>
                    <th className="px-3 py-2">Match</th>
                    <th className="px-3 py-2 min-w-[220px]">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={`${r.linha}-${r.nome}`}
                      className={`border-t border-[#2a2a2e] ${
                        r.action === null ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-500 align-top">{r.linha}</td>
                      <td className="px-3 py-2 align-top">
                        <div>{r.nome}</div>
                        <div className="text-gray-500">
                          {r.secao} · {r.unidade}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            r.status === 'casado'
                              ? 'text-green-400'
                              : r.status === 'sugerido'
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }
                        >
                          {r.status}
                          {r.estoqueNome ? ` → ${r.estoqueNome}` : ''}
                          {r.score != null && r.status === 'sugerido'
                            ? ` (${Math.round(r.score * 100)}%)`
                            : ''}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top space-y-1.5">
                        {r.status === 'casado' && (
                          <select
                            value={r.action ?? 'vincular'}
                            onChange={(e) =>
                              setRowAction(idx, e.target.value as RowAction)
                            }
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-lg px-2 py-1.5"
                          >
                            <option value="vincular">
                              Vincular → {r.estoqueNome || r.estoqueInsumoId}
                            </option>
                            <option value="ignorar">Ignorar</option>
                          </select>
                        )}

                        {r.status === 'sugerido' && (
                          <>
                            <select
                              value={
                                r.action === null
                                  ? ''
                                  : r.action === 'escolher'
                                    ? 'escolher'
                                    : r.action
                              }
                              onChange={(e) => {
                                const v = e.target.value;
                                if (!v) setRowAction(idx, null);
                                else setRowAction(idx, v as RowAction);
                              }}
                              className={`w-full bg-[#0a0a0a] border rounded-lg px-2 py-1.5 ${
                                r.action === null
                                  ? 'border-amber-500/50'
                                  : 'border-[#2a2a2e]'
                              }`}
                            >
                              <option value="">Escolher…</option>
                              <option value="vincular">
                                Vincular à sugestão
                                {r.estoqueNome ? ` (${r.estoqueNome})` : ''}
                              </option>
                              <option value="escolher">Escolher outro produto</option>
                              <option value="criar">Criar novo</option>
                              <option value="ignorar">Ignorar</option>
                            </select>
                            {r.action === 'escolher' && (
                              <select
                                value={r.chosenId || ''}
                                onChange={(e) => {
                                  const opt = catalogo.find((c) => c.id === e.target.value);
                                  if (opt) setRowAction(idx, 'escolher', opt);
                                }}
                                className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-lg px-2 py-1.5"
                              >
                                <option value="">Selecione o produto…</option>
                                {catalogo.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nome}
                                  </option>
                                ))}
                              </select>
                            )}
                          </>
                        )}

                        {r.status === 'nao_encontrado' && (
                          <select
                            value={r.action ?? 'ignorar'}
                            onChange={(e) =>
                              setRowAction(idx, e.target.value as RowAction)
                            }
                            className="w-full bg-[#0a0a0a] border border-[#2a2a2e] rounded-lg px-2 py-1.5"
                          >
                            <option value="ignorar">Ignorar (não criar)</option>
                            <option value="criar">Criar novo</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ImportarSaldoBlock />
    </div>
  );
}
