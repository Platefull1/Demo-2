'use client';

import { useCallback, useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
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
import { FileDropzone } from './FileDropzone';

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
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
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

  const onFile = useCallback(
    (f: File | null) => {
      setFile(f);
      setAbas([]);
      setItens(null);
      if (f) void listarAbas(f);
    },
    [listarAbas]
  );

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
        `Saldo gravado (${CMV_STORE_LABELS[storeSlug] || storeSlug} / ${competencia}): ${data.upserted} itens. Vira estoque inicial do mês seguinte.`
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [itens, storeSlug, competencia]);

  return (
    <section className="rounded-md border border-border bg-card p-4 space-y-4">
      <div className="flex gap-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground tabular-nums">
          3
        </span>
        <div className="min-w-0 space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Importar saldo (estoque final)
          </h3>
          <p className="text-sm text-muted-foreground">
            Envie a planilha de saldo da loja. Usamos a quantidade e o custo
            médio de cada insumo.
          </p>
          <details className="text-xs text-muted-foreground">
            <summary className="cursor-pointer inline-flex items-center gap-1 hover:text-foreground">
              Detalhes técnicos
              <ChevronDown className="size-3" />
            </summary>
            <p className="mt-1.5 pl-0.5">
              Uma planilha por loja. Colunas AE (quantidade) e AG (custo médio).
              O bloco de resumo a partir da linha 187 não é importado.
            </p>
          </details>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Loja</label>
          <Select value={storeSlug} onValueChange={setStoreSlug}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CMV_STORE_LABELS).map(([s, lab]) => (
                <SelectItem key={s} value={s}>
                  {lab}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Competência do saldo
          </label>
          <Input
            type="month"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <FileDropzone file={file} disabled={loading} onFile={onFile} />

      {abas.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Aba da planilha</label>
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
          onClick={() => void preview()}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Pré-visualizar
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!itens || loading}
          onClick={() => void confirmar()}
        >
          Gravar saldo
        </Button>
      </div>

      {resumo && (
        <p className="text-xs text-muted-foreground">
          {resumo.total} linhas · {resumo.casados} encontrados ·{' '}
          {resumo.sugeridos} sugeridos · {resumo.naoEncontrados} sem correspondência
        </p>
      )}
      {msg && (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      )}

      {itens && itens.length > 0 && (
        <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-md border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-muted-foreground text-left bg-muted/50">
                <th className="py-2 px-2">Linha</th>
                <th className="py-2 px-2">Produto</th>
                <th className="py-2 px-2 text-right">Qtd</th>
                <th className="py-2 px-2 text-right">Custo médio</th>
                <th className="py-2 px-2">Correspondência</th>
              </tr>
            </thead>
            <tbody>
              {itens.slice(0, 80).map((i) => (
                <tr key={i.linha} className="border-t border-border">
                  <td className="py-1.5 px-2 text-muted-foreground">{i.linha}</td>
                  <td className="py-1.5 px-2 text-foreground truncate max-w-[180px]">
                    {i.nome}
                  </td>
                  <td className="py-1.5 px-2 text-right tabular-nums text-foreground">
                    {i.qtdFinal}
                  </td>
                  <td className="py-1.5 px-2 text-right tabular-nums text-foreground">
                    {i.custoMedio ?? '–'}
                  </td>
                  <td className="py-1.5 px-2 text-muted-foreground">
                    {i.status === 'casado'
                      ? 'Encontrado'
                      : i.status === 'sugerido'
                        ? 'Sugerido'
                        : i.status === 'nao_encontrado'
                          ? 'Não encontrado'
                          : i.status}
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
