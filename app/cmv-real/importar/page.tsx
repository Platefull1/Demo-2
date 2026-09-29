'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileSpreadsheet, Loader2, RefreshCw, Upload } from 'lucide-react';

type PreviewItem = {
  linha: number;
  nome: string;
  secao: string;
  unidade: string;
  ordem: number;
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  estoqueInsumoId?: string;
  estoqueNome?: string;
  score?: number;
};

export default function CmvRealImportarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [abas, setAbas] = useState<string[]>([]);
  const [aba, setAba] = useState('');
  const [preview, setPreview] = useState<PreviewItem[] | null>(null);
  const [resumo, setResumo] = useState<{
    total: number;
    casados: number;
    sugeridos: number;
    naoEncontrados: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [reproc, setReproc] = useState<string | null>(null);

  const listarAbas = useCallback(async (f: File) => {
    setLoading(true);
    setMsg(null);
    setPreview(null);
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
      setPreview(data.itens);
      setResumo({
        total: data.total,
        casados: data.casados,
        sugeridos: data.sugeridos,
        naoEncontrados: data.naoEncontrados,
      });
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [file, aba]);

  const confirmar = useCallback(async () => {
    if (!preview) return;
    setLoading(true);
    setMsg(null);
    try {
      // Criar insumos não encontrados
      const criar = preview
        .filter((p) => p.status === 'nao_encontrado')
        .map((p) => ({
          nome: p.nome,
          secao: p.secao as 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA',
          unidade: p.unidade as 'KG' | 'UN',
          ordem: p.ordem,
        }));

      let criadosMap = new Map<string, string>();
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

      const itens = preview
        .map((p) => {
          const id =
            p.estoqueInsumoId ||
            (p.status === 'nao_encontrado' ? criadosMap.get(p.nome) : undefined);
          if (!id) return null;
          return {
            nome: p.nome,
            secao: p.secao,
            unidade: p.unidade,
            ordem: p.ordem,
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
  }, [preview]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-400" />
              CMV Real — Importar catálogo
            </h1>
            <p className="text-sm text-gray-500">
              Lê a planilha CMV DESPERDÍCIO e cria/atualiza CmvRealInsumoConfig (sem saldo).
            </p>
          </div>
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
                setPreview(null);
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
              disabled={!preview || loading}
              onClick={() => void confirmar()}
              className="inline-flex items-center gap-2 rounded-lg border border-green-500/40 text-green-400 hover:bg-green-500/10 px-4 py-2 text-sm disabled:opacity-40"
            >
              Confirmar (casados + criar faltantes)
            </button>
          </div>

          {resumo && (
            <p className="text-sm text-gray-400">
              {resumo.total} produtos · {resumo.casados} casados · {resumo.sugeridos} sugeridos ·{' '}
              {resumo.naoEncontrados} não encontrados
            </p>
          )}
          {msg && <p className="text-sm text-amber-300">{msg}</p>}
        </section>

        <section className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">Após importar o catálogo</h2>
          <p className="text-xs text-gray-500">
            Reprocessa notas em revisão para gerar sugestões por similaridade (antes vinham 100%
            SEM_MAPEAMENTO sem catálogo ativo).
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

        {preview && (
          <div className="rounded-xl border border-[#2a2a2e] overflow-hidden">
            <div className="max-h-[50vh] overflow-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a1a1e] sticky top-0">
                  <tr className="text-left text-gray-400">
                    <th className="px-3 py-2">Linha</th>
                    <th className="px-3 py-2">Produto</th>
                    <th className="px-3 py-2">Seção</th>
                    <th className="px-3 py-2">Un</th>
                    <th className="px-3 py-2">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((p) => (
                    <tr key={`${p.linha}-${p.nome}`} className="border-t border-[#2a2a2e]">
                      <td className="px-3 py-1.5 text-gray-500">{p.linha}</td>
                      <td className="px-3 py-1.5">{p.nome}</td>
                      <td className="px-3 py-1.5 text-gray-400">{p.secao}</td>
                      <td className="px-3 py-1.5">{p.unidade}</td>
                      <td className="px-3 py-1.5">
                        <span
                          className={
                            p.status === 'casado'
                              ? 'text-green-400'
                              : p.status === 'sugerido'
                                ? 'text-amber-400'
                                : 'text-red-400'
                          }
                        >
                          {p.status}
                          {p.estoqueNome ? ` → ${p.estoqueNome}` : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
