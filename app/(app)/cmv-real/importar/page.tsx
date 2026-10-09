'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileDropzone } from './FileDropzone';
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

function statusLabel(status: PreviewStatus) {
  if (status === 'casado') return 'Encontrado';
  if (status === 'sugerido') return 'Sugerido';
  return 'Não encontrado';
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
          list.map((i: { id: string; nome: string }) => ({
            id: i.id,
            nome: i.nome,
          }))
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
      const res = await fetch('/api/cmv-real/importar-catalogo', {
        method: 'POST',
        body: fd,
      });
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

  const onFile = useCallback(
    (f: File | null) => {
      setFile(f);
      setAbas([]);
      setRows(null);
      if (f) void listarAbas(f);
    },
    [listarAbas]
  );

  const gerarPreview = useCallback(async () => {
    if (!file || !aba) return;
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set('action', 'preview');
      fd.set('file', file);
      fd.set('aba', aba);
      const res = await fetch('/api/cmv-real/importar-catalogo', {
        method: 'POST',
        body: fd,
      });
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

  const setRowAction = (
    idx: number,
    action: RowAction,
    chosen?: CatalogOption
  ) => {
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
          return {
            ...r,
            action: 'escolher',
            chosenId: undefined,
            chosenNome: undefined,
          };
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
      setMsg(`Catálogo atualizado: ${data.upserted} produtos.`);
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
          `Aprovadas: ${data.aprovadas} · Ainda em revisão: ${data.aindaEmRevisao}`
      );
    } catch (e) {
      setReproc(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmLabel = rows
    ? `Confirmar importação · Vincular ${counts.vincular} · Criar ${counts.criar} · Ignorar ${counts.ignorar}`
    : 'Confirmar importação';

  return (
    <div className="space-y-6">
      {/* Etapa 1 */}
      <section className="rounded-md border border-border bg-card p-4 space-y-4">
        <div className="flex gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground tabular-nums">
            1
          </span>
          <div className="min-w-0 space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Importar catálogo
            </h2>
            <p className="text-sm text-muted-foreground">
              Envie a planilha CMV Desperdício para criar ou atualizar a lista de
              insumos.
            </p>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer inline-flex items-center gap-1 hover:text-foreground">
                Detalhes técnicos
                <ChevronDown className="size-3" />
              </summary>
              <p className="mt-1.5">
                Atualiza a configuração de insumos do CMV Real (sem importar
                saldo). Aba da planilha corresponde ao mês.
              </p>
            </details>
          </div>
        </div>

        <FileDropzone file={file} disabled={loading} onFile={onFile} />

        {abas.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Aba (mês)</label>
            <Select value={aba} onValueChange={setAba}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {abas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!file || !aba || loading}
            onClick={() => void gerarPreview()}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Pré-visualizar
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canConfirm}
            onClick={() => void confirmar()}
            title={
              counts.pendentes > 0
                ? `${counts.pendentes} sugestão(ões) sem decisão`
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </div>

        {resumo && (
          <p className="text-sm text-muted-foreground">
            {resumo.total} na planilha · {resumo.casados} encontrados ·{' '}
            {resumo.sugeridos} sugeridos · {resumo.naoEncontrados} não
            encontrados
            {resumo.catalogoEstoqueSize != null && (
              <> · {resumo.catalogoEstoqueSize} produtos no estoque</>
            )}
            {counts.pendentes > 0 && (
              <span className="text-warning">
                {' '}
                · {counts.pendentes} sugestão(ões) aguardando decisão
              </span>
            )}
          </p>
        )}
        {msg && (
          <p className="text-sm text-warning" role="alert">
            {msg}
          </p>
        )}

        {rows && (
          <div className="rounded-md border border-border overflow-hidden">
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2">Linha</th>
                    <th className="px-3 py-2">Produto</th>
                    <th className="px-3 py-2">Correspondência</th>
                    <th className="px-3 py-2 min-w-[220px]">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={`${r.linha}-${r.nome}`}
                      className={
                        r.action === null
                          ? 'border-t border-border bg-warning/5'
                          : 'border-t border-border'
                      }
                    >
                      <td className="px-3 py-2 text-muted-foreground align-top">
                        {r.linha}
                      </td>
                      <td className="px-3 py-2 align-top">
                        <div className="text-foreground">{r.nome}</div>
                        <div className="text-muted-foreground">
                          {r.secao} · {r.unidade}
                        </div>
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={
                            r.status === 'casado'
                              ? 'text-success'
                              : r.status === 'sugerido'
                                ? 'text-warning'
                                : 'text-destructive'
                          }
                        >
                          {statusLabel(r.status)}
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
                            className="w-full bg-background border border-border rounded-md px-2 py-1.5"
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
                              className={`w-full bg-background border rounded-md px-2 py-1.5 ${
                                r.action === null
                                  ? 'border-warning/50'
                                  : 'border-border'
                              }`}
                            >
                              <option value="">Escolher…</option>
                              <option value="vincular">
                                Vincular à sugestão
                                {r.estoqueNome ? ` (${r.estoqueNome})` : ''}
                              </option>
                              <option value="escolher">
                                Escolher outro produto
                              </option>
                              <option value="criar">Criar novo</option>
                              <option value="ignorar">Ignorar</option>
                            </select>
                            {r.action === 'escolher' && (
                              <select
                                value={r.chosenId || ''}
                                onChange={(e) => {
                                  const opt = catalogo.find(
                                    (c) => c.id === e.target.value
                                  );
                                  if (opt) setRowAction(idx, 'escolher', opt);
                                }}
                                className="w-full bg-background border border-border rounded-md px-2 py-1.5"
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
                            className="w-full bg-background border border-border rounded-md px-2 py-1.5"
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
      </section>

      {/* Etapa 2 */}
      <section className="rounded-md border border-border bg-card p-4 space-y-3">
        <div className="flex gap-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground tabular-nums">
            2
          </span>
          <div className="min-w-0 space-y-1">
            <h2 className="text-base font-semibold text-foreground">
              Reprocessar notas em revisão
            </h2>
            <p className="text-sm text-muted-foreground">
              Depois de atualizar o catálogo, rode isso para gerar novas
              sugestões nas notas ainda em revisão.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => void reprocessar()}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Reprocessar notas em revisão
        </Button>
        {reproc && <p className="text-sm text-muted-foreground">{reproc}</p>}
      </section>

      <ImportarSaldoBlock />
    </div>
  );
}
