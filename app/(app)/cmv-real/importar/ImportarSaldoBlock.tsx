'use client';

import { useCallback, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type SaldoPreview = {
  linha: number;
  nome: string;
  qtdFinal: number;
  custoMedio: number | null;
  status: string;
  estoqueInsumoId?: string;
  estoqueNome?: string;
};

/**
 * Bloco SALDO da planilha (AE=qtd, AG=custo) — uma planilha por loja.
 * Não lê o resumo a partir da linha 187.
 */
export function ImportarSaldoBlock() {
  const now = new Date();
  const [file, setFile] = useState<File | null>(null);
  const [abas, setAbas] = useState<string[]>([]);
  const [aba, setAba] = useState('');
  const [storeSlug, setStoreSlug] = useState('ahu');
  const [competencia, setCompetencia] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  );
  const [itens, setItens] = useState<SaldoPreview[] | null>(null);
  const [resumo, setResumo] = useState<{
    total: number;
    casados: number;
    sugeridos: number;
    naoEncontrados: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const listarAbas = useCallback(async (f: File) => {
    setLoading(true);
    setMsg(null);
    setItens(null);
    try {
      const fd = new FormData();
      fd.set('action', 'listar-abas');
      fd.set('file', f);
      const res = await fetch('/api/cmv-real/importar-saldo', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setAbas(data.abas || []);
      setAba(data.abas?.[0] || '');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  const preview = useCallback(async () => {
    if (!file || !aba) return;
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set('action', 'preview');
      fd.set('file', file);
      fd.set('aba', aba);
      fd.set('storeSlug', storeSlug);
      fd.set('competencia', competencia);
      const res = await fetch('/api/cmv-real/importar-saldo', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setItens(data.itens || []);
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
  }, [file, aba, storeSlug, competencia]);

  const confirmar = useCallback(async () => {
    if (!itens) return;
    const payload = itens
      .filter((i) => i.estoqueInsumoId && i.status !== 'nao_encontrado')
      .map((i) => ({
        estoqueInsumoId: i.estoqueInsumoId!,
        qtdFinal: i.qtdFinal,
        custoMedio: i.custoMedio,
      }));
    if (payload.length === 0) {
      setMsg('Nenhum item casado para gravar');
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/importar-saldo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'confirmar',
          storeSlug,
          competencia,
          itens: payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setMsg(
        `Saldo gravado (${CMV_STORE_LABELS[storeSlug] || storeSlug} / ${competencia}): ${data.upserted} itens. Vira estoque inicial do mês seguinte.`,
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [itens, storeSlug, competencia]);

  return (
    <section className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Saldo (estoque final)</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Uma planilha por loja. Lê AE (qtd) e AG (custo médio). Não importa o
          bloco de resumo (linha 187+).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground text-xs">Loja</span>
          <select
            value={storeSlug}
            onChange={(e) => setStoreSlug(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2"
          >
            {Object.entries(CMV_STORE_LABELS).map(([s, lab]) => (
              <option key={s} value={s}>
                {lab}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground text-xs">Competência do saldo</span>
          <input
            type="month"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="text-muted-foreground">Arquivo .xlsx da loja</span>
        <input
          type="file"
          accept=".xlsx,.xls"
          className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-primary"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setAbas([]);
            setItens(null);
            if (f) void listarAbas(f);
          }}
        />
      </label>

      {abas.length > 0 && (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground text-xs">Aba (ex.: SETEMBRO 2026)</span>
          <select
            value={aba}
            onChange={(e) => setAba(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2"
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
          onClick={() => void preview()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium px-4 py-2 text-sm disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          Prévia do saldo
        </button>
        <button
          type="button"
          disabled={!itens || loading}
          onClick={() => void confirmar()}
          className="inline-flex items-center gap-2 rounded-lg border border-primary/40 text-primary px-4 py-2 text-sm disabled:opacity-40"
        >
          Gravar saldo
        </button>
      </div>

      {resumo && (
        <p className="text-xs text-muted-foreground">
          {resumo.total} linhas · {resumo.casados} casados · {resumo.sugeridos}{' '}
          sugeridos · {resumo.naoEncontrados} sem match
        </p>
      )}
      {msg && <p className="text-sm text-warning">{msg}</p>}

      {itens && itens.length > 0 && (
        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-left">
                <th className="py-1 pr-2">Linha</th>
                <th className="py-1 pr-2">Produto</th>
                <th className="py-1 pr-2">Qtd AE</th>
                <th className="py-1 pr-2">Custo AG</th>
                <th className="py-1">Match</th>
              </tr>
            </thead>
            <tbody>
              {itens.slice(0, 80).map((i) => (
                <tr key={i.linha} className="border-t border-border">
                  <td className="py-1 pr-2 text-muted-foreground">{i.linha}</td>
                  <td className="py-1 pr-2 text-foreground truncate max-w-[180px]">
                    {i.nome}
                  </td>
                  <td className="py-1 pr-2">{i.qtdFinal}</td>
                  <td className="py-1 pr-2">{i.custoMedio ?? '—'}</td>
                  <td className="py-1 text-muted-foreground">
                    {i.status}
                    {i.estoqueNome ? ` → ${i.estoqueNome}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
