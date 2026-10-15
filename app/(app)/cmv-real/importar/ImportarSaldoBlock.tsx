'use client';

import { useCallback, useMemo, useState } from 'react';
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
import {
  CMV_STORE_LABELS,
  formatCustoMedioBr,
  formatQuantidadeBr,
} from '@/lib/nfe/ui-labels';
import { cn } from '@/lib/utils';
import { FileDropzone } from './FileDropzone';

type CustoOrigem =
  | 'PLANILHA'
  | 'PLANILHA_RECALCULADO'
  | 'ULTIMA_COMPRA_LOJA'
  | 'ULTIMA_COMPRA_GRUPO'
  | 'OUTRA_LOJA'
  | 'PLANILHA_MES_ANTERIOR'
  | 'CMV_TEORICO'
  | 'MANUAL'
  | 'PENDENTE'
  | null;

type SaldoPreview = {
  linha: number;
  nome: string;
  secao: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
  qtdFinal: number;
  custoMedio: number | null;
  custoPlanilha: number | null;
  custoOrigem: CustoOrigem;
  custoOrigemDetalhe: string | null;
  custoAntigo?: boolean;
  status: 'casado' | 'sugerido' | 'nao_encontrado';
  statusExibicao:
    | 'casado'
    | 'sugerido'
    | 'nao_encontrado'
    | 'custo_pendente'
    | 'fora_do_catalogo';
  foraDoCatalogoCmv?: boolean;
  estoqueInsumoId?: string;
  estoqueNome?: string;
};

type FiltroSecao = 'TODAS' | SaldoPreview['secao'];
type FiltroStatus =
  | 'TODOS'
  | 'casado'
  | 'sugerido'
  | 'nao_encontrado'
  | 'custo_pendente'
  | 'fora_do_catalogo';

const SECAO_LABEL: Record<SaldoPreview['secao'], string> = {
  MATERIA_PRIMA: 'Matéria-prima',
  EMBALAGEM: 'Embalagens',
  BEBIDA: 'Bebidas',
};

const STATUS_LABEL: Record<FiltroStatus, string> = {
  TODOS: 'Todos',
  casado: 'Encontrado',
  sugerido: 'Sugerido',
  nao_encontrado: 'Sem correspondência',
  custo_pendente: 'Custo pendente',
  fora_do_catalogo: 'Fora do catálogo',
};

const CUSTO_ORIGEM_LABEL: Record<string, string> = {
  PLANILHA: 'Planilha',
  PLANILHA_RECALCULADO: 'Planilha (recalculado)',
  ULTIMA_COMPRA_LOJA: 'Última compra (loja)',
  ULTIMA_COMPRA_GRUPO: 'Última compra (grupo)',
  OUTRA_LOJA: 'Outra loja',
  PLANILHA_MES_ANTERIOR: 'Planilha mês anterior',
  CMV_TEORICO: 'CMV teórico',
  MANUAL: 'Manual',
  PENDENTE: 'Custo pendente',
};

type ContadoresSecao = {
  total: number;
  casados: number;
  sugeridos: number;
  naoEncontrados: number;
  custoPendente: number;
  foraDoCatalogo?: number;
};

/**
 * Bloco SALDO da planilha (AE=qtd, AG=custo) — uma planilha por loja.
 * Lê as 3 seções por âncoras; não descarta qtd quando AG é inválido.
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
    custoPendente: number;
    foraDoCatalogo?: number;
    qtdSemCorrespondencia: number;
    porSecao: Record<SaldoPreview['secao'], ContadoresSecao>;
  } | null>(null);
  const [filtroSecao, setFiltroSecao] = useState<FiltroSecao>('TODAS');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('TODOS');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const listarAbas = useCallback(async (f: File) => {
    setLoading(true);
    setMsg(null);
    setItens(null);
    setResumo(null);
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
      setResumo(null);
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
        custoPendente: data.custoPendente ?? 0,
        qtdSemCorrespondencia: data.qtdSemCorrespondencia ?? 0,
        porSecao: data.porSecao,
      });
      setFiltroSecao('TODAS');
      setFiltroStatus('TODOS');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [file, aba, storeSlug, competencia]);

  const setCustoManual = useCallback((linha: number, raw: string) => {
    setItens((prev) => {
      if (!prev) return prev;
      return prev.map((i) => {
        if (i.linha !== linha) return i;
        const trimmed = raw.trim();
        if (!trimmed) {
          return {
            ...i,
            custoMedio: null,
            custoOrigem: 'PENDENTE' as const,
            custoOrigemDetalhe: null,
            statusExibicao:
              i.status === 'nao_encontrado'
                ? i.status
                : 'custo_pendente',
          };
        }
        const n = Number(trimmed.replace(/\./g, '').replace(',', '.'));
        if (!Number.isFinite(n) || n <= 0) return i;
        return {
          ...i,
          custoMedio: n,
          custoOrigem: 'MANUAL' as const,
          custoOrigemDetalhe: 'Informado na prévia',
          statusExibicao:
            i.status === 'nao_encontrado'
              ? i.status
              : i.foraDoCatalogoCmv
                ? 'fora_do_catalogo'
                : i.status,
        };
      });
    });
  }, []);

  const confirmar = useCallback(async () => {
    if (!itens) return;
    const payload = itens
      .filter((i) => i.estoqueInsumoId && i.status !== 'nao_encontrado')
      .map((i) => ({
        estoqueInsumoId: i.estoqueInsumoId!,
        qtdFinal: i.qtdFinal,
        custoMedio: i.custoMedio,
        custoOrigem:
          i.custoOrigem ?? (i.custoMedio != null ? 'MANUAL' : 'PENDENTE'),
        custoOrigemDetalhe: i.custoOrigemDetalhe ?? null,
        secao: i.secao,
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
      const configs =
        typeof data.configsCriadas === 'number' && data.configsCriadas > 0
          ? ` ${data.configsCriadas} produto(s) incluído(s) no catálogo CMV Real.`
          : '';
      setMsg(
        `Saldo gravado (${CMV_STORE_LABELS[storeSlug] || storeSlug} / ${competencia}): ${data.upserted} itens. Vira estoque inicial do mês seguinte.${configs}`
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [itens, storeSlug, competencia]);

  const filtrados = useMemo(() => {
    if (!itens) return [];
    return itens.filter((i) => {
      if (filtroSecao !== 'TODAS' && i.secao !== filtroSecao) return false;
      if (filtroStatus === 'TODOS') return true;
      if (filtroStatus === 'custo_pendente') {
        return i.statusExibicao === 'custo_pendente' || i.custoOrigem === 'PENDENTE';
      }
      if (filtroStatus === 'fora_do_catalogo') {
        return Boolean(i.foraDoCatalogoCmv);
      }
      return i.status === filtroStatus;
    });
  }, [itens, filtroSecao, filtroStatus]);

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
              Lê Matéria-prima, Embalagens e Bebidas por âncoras na coluna B. Se
              AG for inválido (#DIV/0!), usa última compra ou mês anterior;
              senão fica como custo pendente.
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
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {resumo.total} linhas · {resumo.casados} encontrados ·{' '}
            {resumo.sugeridos} sugeridos · {resumo.naoEncontrados} sem
            correspondência · {resumo.custoPendente} custo pendente
            {(resumo.foraDoCatalogo ?? 0) > 0
              ? ` · ${resumo.foraDoCatalogo} fora do catálogo`
              : ''}
            {resumo.qtdSemCorrespondencia > 0
              ? ` · ${resumo.qtdSemCorrespondencia} com qtd sem correspondência`
              : ''}
          </p>
          {resumo.porSecao && (
            <p className="text-xs text-muted-foreground">
              {(
                ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA'] as const
              ).map((s, idx) => {
                const c = resumo.porSecao[s];
                if (!c) return null;
                return (
                  <span key={s}>
                    {idx > 0 ? ' · ' : ''}
                    {SECAO_LABEL[s]}: {c.total}
                  </span>
                );
              })}
            </p>
          )}
        </div>
      )}
      {msg && (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      )}

      {itens && itens.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Select
              value={filtroSecao}
              onValueChange={(v) => setFiltroSecao(v as FiltroSecao)}
            >
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue placeholder="Seção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODAS">Todas as seções</SelectItem>
                {(
                  ['MATERIA_PRIMA', 'EMBALAGEM', 'BEBIDA'] as const
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {SECAO_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filtroStatus}
              onValueChange={(v) => setFiltroStatus(v as FiltroStatus)}
            >
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    'TODOS',
                    'casado',
                    'sugerido',
                    'nao_encontrado',
                    'custo_pendente',
                    'fora_do_catalogo',
                  ] as const
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground self-center">
              Exibindo {filtrados.length} de {itens.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[28rem] overflow-y-auto rounded-md border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground text-left bg-muted/50 sticky top-0 z-10">
                  <th className="py-2 px-2">Linha</th>
                  <th className="py-2 px-2">Seção</th>
                  <th className="py-2 px-2">Produto</th>
                  <th className="py-2 px-2 text-right">Qtd</th>
                  <th className="py-2 px-2 text-right">Custo médio</th>
                  <th className="py-2 px-2">Origem</th>
                  <th className="py-2 px-2">Correspondência</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((i) => {
                  const perdido =
                    i.status === 'nao_encontrado' && i.qtdFinal > 0;
                  const pendente =
                    i.custoOrigem === 'PENDENTE' ||
                    i.statusExibicao === 'custo_pendente';
                  const foraCatalogo = Boolean(i.foraDoCatalogoCmv);
                  return (
                    <tr
                      key={`${i.linha}-${i.nome}`}
                      className={cn(
                        'border-t border-border',
                        perdido && 'bg-destructive/10 text-destructive',
                        foraCatalogo && !perdido && 'bg-warning/10'
                      )}
                    >
                      <td className="py-1.5 px-2 text-muted-foreground">
                        {i.linha}
                      </td>
                      <td className="py-1.5 px-2 text-muted-foreground">
                        {SECAO_LABEL[i.secao] || i.secao}
                      </td>
                      <td
                        className={cn(
                          'py-1.5 px-2 truncate max-w-[180px]',
                          perdido ? 'text-destructive' : 'text-foreground'
                        )}
                      >
                        {i.nome}
                      </td>
                      <td
                        className={cn(
                          'py-1.5 px-2 text-right tabular-nums',
                          perdido ? 'text-destructive' : 'text-foreground'
                        )}
                      >
                        {formatQuantidadeBr(i.qtdFinal)}
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        {pendente && i.status !== 'nao_encontrado' ? (
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="Digitar"
                            className="h-7 w-24 text-xs text-right ml-auto"
                            defaultValue=""
                            onBlur={(e) =>
                              setCustoManual(i.linha, e.target.value)
                            }
                          />
                        ) : i.custoMedio != null ? (
                          <span className="tabular-nums text-foreground">
                            {formatCustoMedioBr(i.custoMedio)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-muted-foreground max-w-[180px]">
                        <div>
                          {i.custoOrigem
                            ? CUSTO_ORIGEM_LABEL[i.custoOrigem] || i.custoOrigem
                            : '–'}
                        </div>
                        {i.custoOrigemDetalhe ? (
                          <div className="truncate text-[11px] opacity-80">
                            {i.custoOrigemDetalhe}
                          </div>
                        ) : null}
                        {i.custoAntigo ? (
                          <div className="text-[11px] text-warning">
                            Custo antigo (&gt;3 meses)
                          </div>
                        ) : null}
                      </td>
                      <td
                        className={cn(
                          'py-1.5 px-2',
                          perdido
                            ? 'text-destructive font-medium'
                            : foraCatalogo
                              ? 'text-warning font-medium'
                              : 'text-muted-foreground'
                        )}
                      >
                        {i.status === 'casado'
                          ? 'Encontrado'
                          : i.status === 'sugerido'
                            ? 'Sugerido'
                            : 'Sem correspondência'}
                        {foraCatalogo ? ' · Fora do catálogo' : ''}
                        {pendente && i.status !== 'nao_encontrado'
                          ? ' · Custo pendente'
                          : ''}
                        {i.estoqueNome ? ` → ${i.estoqueNome}` : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
