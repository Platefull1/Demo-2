'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Ban, Unlock } from 'lucide-react';
import {
  notasListHref,
  parseNotasListFilters,
} from '@/lib/nfe/notas-list-query';
import { formatNumBr, notaStatusLabel, storeLabel } from '@/lib/nfe/ui-labels';
import { catalogoPareceGenericoDemais } from '@/lib/nfe/similarity';
import {
  fatorEfetivoDaEntrada,
  formatFatorBr,
  interpretarRevisaoItem,
  opcaoEProvavel,
  parseFatorBr,
  textoAlertaAmbiguoRevisao,
  type OpcaoPesoId,
} from '@/lib/nfe/revisao-interpretacao';

type Sugestao = { id: string; nome: string; score: number };

type DraftItem = {
  produtoId: string;
  fator: string;
  criarMap: boolean;
  outro: boolean;
  opcaoPeso: OpcaoPesoId | null;
};

type Item = {
  id: string;
  numeroItem: number;
  descricao: string;
  status: string;
  quantidade: number;
  unidadeComercial: string;
  valorBruto: number;
  valorLiquido: number | null;
  fatorSugerido: number | null;
  fatorSugeridoOrigem: string | null;
  fatorConversao: number | null;
  sugestaoInsumoId: string | null;
  sugestaoScore: number | null;
  sugestoes: Sugestao[] | unknown;
  estoqueInsumoId: string | null;
  alertas: string[];
};

type ProdutoOpt = {
  estoqueInsumoId: string;
  nome: string;
  unidade: string;
  secao: string;
};

function parseSugestoes(raw: unknown): Sugestao[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      const o = s as Record<string, unknown>;
      return {
        id: String(o.id ?? ''),
        nome: String(o.nome ?? ''),
        score: Number(o.score ?? 0),
      };
    })
    .filter((s) => s.id);
}

function parseFator(raw: string): number | null {
  return parseFatorBr(raw);
}

function statusBadgeClass(status: string): string {
  if (status === 'APROVADA') return 'bg-success/15 text-success border-success/30';
  if (status === 'IGNORADA') return 'bg-muted text-muted-foreground border-border';
  return 'bg-warning/15 text-warning border-warning/30';
}

function CmvRealNotaDetalhePageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = String(params?.id || '');
  const backHref = useMemo(() => {
    const f = parseNotasListFilters(searchParams);
    return notasListHref(f);
  }, [searchParams]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [canRevisar, setCanRevisar] = useState(false);
  const [canMapeamentoCriar, setCanMapeamentoCriar] = useState(false);
  const [canMapeamentoEditar, setCanMapeamentoEditar] = useState(false);
  const [custoMedioPorInsumo, setCustoMedioPorInsumo] = useState<Record<string, number>>({});
  const [nota, setNota] = useState<{
    id: string;
    numero: string;
    storeSlug: string;
    status: string;
    dataEntrada: string;
    valorTotal: number;
    fornecedor: {
      razaoSocial: string;
      nomeFantasia: string | null;
      cnpj: string;
      ignorarCmv: boolean;
    };
    itens: Item[];
  } | null>(null);
  const [produtos, setProdutos] = useState<ProdutoOpt[]>([]);

  const [draft, setDraft] = useState<Record<string, DraftItem>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const [resNota, resProd] = await Promise.all([
        fetch(`/api/cmv-real/notas/${id}`, { cache: 'no-store' }),
        // Mesma fonte da aba Produtos em /estoque
        fetch('/api/cmv-real/produtos?fonte=estoque', { cache: 'no-store' }),
      ]);
      const data = await resNota.json();
      if (!resNota.ok) throw new Error(data.error || 'Erro');
      setCanRevisar(data.canRevisar === true);
      setCanMapeamentoCriar(data.canMapeamentoCriar === true);
      setCanMapeamentoEditar(data.canMapeamentoEditar === true);
      setCustoMedioPorInsumo(data.custoMedioPorInsumo || {});
      setNota(data.nota);

      let prodList: ProdutoOpt[] = [];
      if (resProd.ok) {
        const pd = await resProd.json();
        prodList = (pd.itens || []).map(
          (p: {
            estoqueInsumoId: string;
            nome: string;
            unidade: string;
            secao: string;
          }) => ({
            estoqueInsumoId: p.estoqueInsumoId,
            nome: p.nome,
            unidade: p.unidade,
            secao: p.secao,
          }),
        );
        setProdutos(prodList);
      }

      const prodMap = new Map(prodList.map((p) => [p.estoqueInsumoId, p]));
      const custoMedio: Record<string, number> = data.custoMedioPorInsumo || {};

      const next: Record<string, DraftItem> = {};
      for (const it of data.nota.itens as Item[]) {
        const sugs = parseSugestoes(it.sugestoes);
        const first =
          it.estoqueInsumoId || it.sugestaoInsumoId || sugs[0]?.id || '';
        const prod = prodMap.get(first);
        const undCmv = prod?.unidade || 'KG';
        const valor = it.valorLiquido ?? it.valorBruto;
        const interp = interpretarRevisaoItem({
          descricao: it.descricao,
          quantidade: it.quantidade,
          unidadeComercial: it.unidadeComercial,
          unidadeCmv: undCmv,
          valorItem: valor,
          secao: prod?.secao,
          custoMedio: first ? custoMedio[first] : undefined,
        });

        let fatorNum = it.fatorConversao ?? it.fatorSugerido ?? 1;
        let opcaoPeso: OpcaoPesoId | null = null;
        if (interp.opcoes.length > 0 && interp.opcaoPadrao) {
          opcaoPeso = interp.opcaoPadrao;
          const opt = interp.opcoes.find((o) => o.id === opcaoPeso);
          if (opt?.fator != null) fatorNum = opt.fator;
        }

        // Peso por interna: campo mostra peso da peça (fator salvo ÷ N)
        let fatorStr = formatFatorBr(fatorNum);
        if (interp.pesoPorInterna && interp.opcoes.length === 0) {
          if (it.fatorConversao != null && interp.nPack && interp.nPack > 1) {
            fatorStr = formatFatorBr(it.fatorConversao / interp.nPack);
          } else if (it.fatorConversao == null) {
            fatorStr = '';
          }
        }

        next[it.id] = {
          produtoId: first,
          fator: fatorStr,
          criarMap: true,
          outro: false,
          opcaoPeso,
        };
      }
      setDraft(next);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) void load();
  }, [id, load]);

  useEffect(() => {
    setDraft((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        next[k] = { ...next[k], criarMap: canMapeamentoCriar };
      }
      return next;
    });
  }, [canMapeamentoCriar]);

  const pendentes = useMemo(
    () =>
      (nota?.itens || []).filter(
        (i) => i.status === 'SUGERIDO' || i.status === 'SEM_MAPEAMENTO',
      ),
    [nota],
  );
  const resolvidos = useMemo(
    () =>
      (nota?.itens || []).filter(
        (i) => i.status === 'MAPEADO' || i.status === 'IGNORADO',
      ),
    [nota],
  );

  const produtoById = useMemo(() => {
    const m = new Map<string, ProdutoOpt>();
    for (const p of produtos) m.set(p.estoqueInsumoId, p);
    return m;
  }, [produtos]);

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/cmv-real/notas/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha');
    return data;
  };

  const confirmar = async (itemId: string) => {
    const d = draft[itemId];
    if (!d?.produtoId) {
      setMsg('Selecione um produto');
      return;
    }
    const pesoOuFator = parseFator(d.fator);
    if (pesoOuFator == null) {
      setMsg('Valor de conversão inválido');
      return;
    }
    const it = nota?.itens.find((x) => x.id === itemId);
    const prod = produtoById.get(d.produtoId);
    const interp = it
      ? interpretarRevisaoItem({
          descricao: it.descricao,
          quantidade: it.quantidade,
          unidadeComercial: it.unidadeComercial,
          unidadeCmv: prod?.unidade || 'KG',
          valorItem: it.valorLiquido ?? it.valorBruto,
          secao: prod?.secao,
        })
      : null;
    const fator = interp
      ? fatorEfetivoDaEntrada(pesoOuFator, interp)
      : pesoOuFator;
    setSaving(itemId);
    setMsg(null);
    try {
      await post({
        action: 'confirmar_item',
        itemId,
        estoqueInsumoId: d.produtoId,
        fatorConversao: fator,
        criarMapeamento: d.criarMap && canMapeamentoCriar,
      });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(null);
    }
  };

  const ignorar = async (itemId: string) => {
    setSaving(itemId);
    setMsg(null);
    try {
      await post({ action: 'ignorar_item', itemId });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(null);
    }
  };

  const fornecedorFora = async () => {
    if (
      !confirm(
        'Marcar este fornecedor como fora do CMV em todas as lojas? As notas em revisão deste fornecedor serão ignoradas.',
      )
    )
      return;
    setSaving('fornecedor');
    try {
      await post({ action: 'fornecedor_fora_cmv' });
      router.push(backHref);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
      setSaving(null);
    }
  };

  const aprovar = async () => {
    setSaving('aprovar');
    setMsg(null);
    try {
      await post({ action: 'aprovar_nota' });
      router.push(backHref);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
      setSaving(null);
    }
  };

  const reabrir = async () => {
    if (
      !confirm(
        'Reabrir esta nota? Os lançamentos do CMV serão removidos até você aprovar de novo. Só funciona se o mês estiver aberto no Fechamento.',
      )
    ) {
      return;
    }
    setSaving('reabrir');
    setMsg(null);
    try {
      await post({ action: 'reabrir_nota' });
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!nota) {
    return (
      <div className="space-y-3">
        <Link href={backHref} className="text-sm text-muted-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <p className="text-sm text-warning">{msg || 'Nota não encontrada'}</p>
      </div>
    );
  }

  const renderItem = (it: Item, editavel: boolean) => {
    const sugs = parseSugestoes(it.sugestoes);
    const d = draft[it.id] || {
      produtoId: '',
      fator: '1',
      criarMap: false,
      outro: false,
      opcaoPeso: null,
    };
    const ambiguo = (it.alertas || []).includes('FATOR_AMBIGUO');
    const suspeito = (it.alertas || []).includes('FATOR_SUSPEITO');
    const busy = saving === it.id;

    const prod = produtoById.get(d.produtoId);
    const undCmv = prod?.unidade || 'KG';
    const valor = it.valorLiquido ?? it.valorBruto;
    const interp = interpretarRevisaoItem({
      descricao: it.descricao,
      quantidade: it.quantidade,
      unidadeComercial: it.unidadeComercial,
      unidadeCmv: undCmv,
      valorItem: valor,
      secao: prod?.secao,
      custoMedio: d.produtoId
        ? custoMedioPorInsumo[d.produtoId]
        : undefined,
    });
    const { pergunta, sufixo } = interp;
    const usaCards = interp.opcoes.length > 0;
    const produtoGenerico =
      Boolean(prod?.nome) &&
      catalogoPareceGenericoDemais(it.descricao, prod!.nome, {
        secao: (prod?.secao as 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA') || null,
      });

    const selecionarOpcao = (opcaoId: OpcaoPesoId) => {
      const opt = interp.opcoes.find((o) => o.id === opcaoId);
      setDraft((p) => ({
        ...p,
        [it.id]: {
          ...d,
          opcaoPeso: opcaoId,
          fator:
            opt?.fator != null
              ? formatFatorBr(opt.fator)
              : d.opcaoPeso === 'outro'
                ? d.fator
                : '',
        },
      }));
    };

    return (
      <article
        key={it.id}
        className="rounded-xl border border-border bg-card p-3 space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Item {it.numeroItem}</p>
            <p className="text-sm text-foreground font-medium leading-snug mt-0.5">
              {it.descricao}
            </p>
          </div>
          <div className="text-right shrink-0 text-xs text-muted-foreground">
            <div>
                  {interp.unidadeNaoConfiavel ? (
                <>
                  {interp.qtdExibicao}
                  {interp.unidadeOriginalParen
                    ? ` (${interp.unidadeOriginalParen})`
                    : null}
                </>
              ) : (
                <>
                  {it.quantidade} {it.unidadeComercial}
                </>
              )}
            </div>
            <div>
              R${' '}
              {(it.valorLiquido ?? it.valorBruto).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {(ambiguo || suspeito) && (
          <div
            className={`rounded-lg px-2.5 py-2 text-xs ${
              ambiguo
                ? 'bg-warning/15 border border-warning/40 text-warning'
                : 'bg-warning/15 border border-warning/40 text-warning'
            }`}
          >
            {ambiguo && (
              <p className="font-medium">
                {textoAlertaAmbiguoRevisao(
                  it.unidadeComercial,
                  interp.unidadeNaoConfiavel,
                )}
              </p>
            )}
            {suspeito && (
              <p className={ambiguo ? 'mt-1.5' : ''}>
                Custo fora da faixa esperada — confira o valor digitado.
              </p>
            )}
          </div>
        )}

        {editavel && canRevisar ? (
          <>
            <div className="space-y-1.5">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Produto
              </p>
              {produtoGenerico && (
                <p className="text-xs text-warning font-medium">
                  Confira: é o mesmo produto?
                </p>
              )}
              {sugs.length > 0 && !d.outro ? (
                <ul className="space-y-1">
                  {sugs.slice(0, 3).map((s, idx) => (
                    <li key={s.id}>
                      <label
                        className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 cursor-pointer ${
                          d.produtoId === s.id
                            ? produtoGenerico
                              ? 'border-warning/50 bg-warning/10'
                              : 'border-primary/40 bg-accent'
                            : 'border-border bg-background'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`prod-${it.id}`}
                          checked={d.produtoId === s.id}
                          onChange={() => {
                            const novo = produtoById.get(s.id);
                            const nextInterp = interpretarRevisaoItem({
                              descricao: it.descricao,
                              quantidade: it.quantidade,
                              unidadeComercial: it.unidadeComercial,
                              unidadeCmv: novo?.unidade || 'KG',
                              valorItem: valor,
                              secao: novo?.secao,
                              custoMedio: custoMedioPorInsumo[s.id],
                            });
                            const padrao = nextInterp.opcaoPadrao;
                            const opt = nextInterp.opcoes.find(
                              (o) => o.id === padrao,
                            );
                            setDraft((p) => ({
                              ...p,
                              [it.id]: {
                                ...d,
                                produtoId: s.id,
                                outro: false,
                                opcaoPeso: padrao,
                                fator:
                                  opt?.fator != null
                                    ? formatFatorBr(opt.fator)
                                    : d.fator,
                              },
                            }));
                          }}
                          className="mt-1 accent-primary"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="text-sm text-foreground block truncate">
                            {s.nome}
                            {idx === 0 && !produtoGenerico ? (
                              <span className="text-[10px] text-muted-foreground ml-1">
                                (melhor)
                              </span>
                            ) : null}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            score {(s.score * 100).toFixed(0)}%
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}

              <button
                type="button"
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    [it.id]: { ...d, outro: !d.outro },
                  }))
                }
                className={
                  produtoGenerico
                    ? 'text-sm font-semibold text-primary underline underline-offset-2'
                    : 'text-[11px] text-muted-foreground underline'
                }
              >
                {d.outro || sugs.length === 0
                  ? 'Escolher da lista'
                  : 'Outro produto…'}
              </button>

              {(d.outro || sugs.length === 0) && (
                <select
                  value={d.produtoId}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      [it.id]: {
                        ...d,
                        produtoId: e.target.value,
                        outro: true,
                      },
                    }))
                  }
                  className="w-full bg-background border border-border text-sm rounded-lg px-2.5 py-2"
                >
                  <option value="">Selecione…</option>
                  {produtos.map((p) => (
                    <option key={p.estoqueInsumoId} value={p.estoqueInsumoId}>
                      {p.nome} ({p.unidade})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                {usaCards ? 'O que veio na nota?' : pergunta}
              </p>

              {usaCards ? (
                <ul className="space-y-2">
                  {interp.opcoes.map((opt) => {
                    const selected =
                      (d.opcaoPeso ?? interp.opcaoPadrao) === opt.id;
                    const provavel = opcaoEProvavel(opt.id, interp);
                    return (
                      <li key={opt.id}>
                        <button
                          type="button"
                          onClick={() => selecionarOpcao(opt.id)}
                          className={`w-full text-left rounded-xl border px-3 py-3 transition-colors ${
                            selected
                              ? 'border-primary bg-accent'
                              : 'border-border bg-background hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {selected ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                              ) : null}
                            </span>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-foreground">
                                  {opt.label}
                                </span>
                                {provavel && (
                                  <span className="text-[10px] uppercase tracking-wide text-accent-foreground bg-accent border border-primary/30 rounded px-1.5 py-0.5">
                                    provável
                                  </span>
                                )}
                              </div>
                              {opt.id !== 'outro' &&
                                opt.totalKg != null &&
                                opt.custoPorKg != null && (
                                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                                    <span className="text-xl font-semibold tabular-nums text-foreground">
                                      {formatNumBr(opt.totalKg)} kg
                                    </span>
                                    <span className="text-base font-semibold tabular-nums text-foreground">
                                      R$ {formatNumBr(opt.custoPorKg)}/kg
                                    </span>
                                  </div>
                                )}
                              {opt.precoImprovavel && (
                                <p className="text-xs text-destructive font-medium">
                                  preço improvável
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}

              {(!usaCards || d.opcaoPeso === 'outro') && (
                <div className="space-y-1.5">
                  {usaCards && (
                    <label className="block text-xs text-muted-foreground">
                      Informe o peso (kg por unidade da nota)
                    </label>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={d.fator}
                      onChange={(e) =>
                        setDraft((p) => ({
                          ...p,
                          [it.id]: {
                            ...d,
                            opcaoPeso: usaCards ? 'outro' : d.opcaoPeso,
                            fator: e.target.value,
                          },
                        }))
                      }
                      className={`w-full rounded-lg bg-muted pl-3 pr-10 py-2.5 text-base font-semibold text-foreground caret-foreground placeholder:text-muted-foreground ${
                        ambiguo && !usaCards
                          ? 'border-2 border-warning'
                          : 'border border-border'
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none">
                      {sufixo}
                    </span>
                  </div>
                  {(() => {
                    const pesoOuFator = parseFator(d.fator);
                    if (pesoOuFator == null) return null;
                    const fator = fatorEfetivoDaEntrada(pesoOuFator, interp);
                    const qtdConv = it.quantidade * fator;
                    const custo = qtdConv > 0 ? valor / qtdConv : 0;
                    if (
                      interp.pesoPorInterna &&
                      interp.nPack != null &&
                      interp.nPack > 1
                    ) {
                      return (
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatNumBr(
                            it.quantidade,
                            it.quantidade % 1 === 0 ? 0 : 2,
                          )}{' '}
                          CX × {interp.nPack}{' '}
                          {interp.labelInterna || 'un.'} ×{' '}
                          {formatFatorBr(pesoOuFator)} kg ={' '}
                          {formatNumBr(qtdConv)} kg
                          {' · '}
                          R$ {formatNumBr(custo)}/kg
                        </p>
                      );
                    }
                    return (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {formatNumBr(
                          it.quantidade,
                          it.quantidade % 1 === 0 ? 0 : 2,
                        )}{' '}
                        × {formatFatorBr(fator)} {sufixo} ={' '}
                        {formatNumBr(qtdConv)} {sufixo}
                        {' · '}
                        R$ {formatNumBr(custo)}/{sufixo}
                      </p>
                    );
                  })()}
                </div>
              )}

              {suspeito && !usaCards && (
                <p className="text-xs text-destructive">
                  Custo fora da faixa esperada — confira o valor digitado.
                </p>
              )}
            </div>

            {canMapeamentoCriar && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={d.criarMap}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      [it.id]: { ...d, criarMap: e.target.checked },
                    }))
                  }
                  className="accent-primary"
                />
                Salvar mapeamento para todas as lojas
              </label>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmar(it.id)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm py-2.5 active:scale-[0.98] disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Confirmar
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void ignorar(it.id)}
                className="rounded-lg border border-border px-3 py-2.5 text-sm text-muted-foreground active:bg-muted"
              >
                Ignorar
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">
            {it.estoqueInsumoId
              ? `Mapeado · fator ${it.fatorConversao ?? '—'}`
              : it.status}
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="space-y-4">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-muted-foreground"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Notas
      </Link>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              NF {nota.numero}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {storeLabel(nota.storeSlug)} ·{' '}
              {new Date(nota.dataEntrada).toLocaleDateString('pt-BR')} · R${' '}
              {nota.valorTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <span
            className={`text-[10px] font-medium border px-2 py-1 rounded ${statusBadgeClass(nota.status)}`}
          >
            {notaStatusLabel(nota.status)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial}
        </p>
        <p className="text-[11px] text-muted-foreground">{nota.fornecedor.cnpj}</p>

        {canMapeamentoEditar && !nota.fornecedor.ignorarCmv && (
          <button
            type="button"
            disabled={saving === 'fornecedor'}
            onClick={() => void fornecedorFora()}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm font-medium py-2.5 active:bg-destructive/20"
          >
            <Ban className="w-4 h-4" />
            Fornecedor fora do CMV
          </button>
        )}
      </header>

      {msg && (
        <p className="text-sm text-warning bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
          {msg}
        </p>
      )}

      {pendentes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-warning">
            Pendentes ({pendentes.length})
          </h3>
          {pendentes.map((it) => renderItem(it, true))}
        </section>
      )}

      {resolvidos.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Resolvidos ({resolvidos.length})
            {nota.status === 'EM_REVISAO' && canRevisar
              ? ' — corrija o fator se precisar'
              : ''}
          </h3>
          {resolvidos.map((it) =>
            renderItem(
              it,
              canRevisar &&
                nota.status === 'EM_REVISAO' &&
                it.status === 'MAPEADO',
            ),
          )}
        </section>
      )}

      {canRevisar && nota.status === 'APROVADA' && (
        <button
          type="button"
          disabled={saving === 'reabrir'}
          onClick={() => void reabrir()}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground font-semibold text-sm py-3 sticky bottom-4 shadow-lg"
        >
          {saving === 'reabrir' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Unlock className="w-4 h-4 text-muted-foreground" />
              Reabrir nota
            </>
          )}
        </button>
      )}

      {canRevisar && pendentes.length === 0 && nota.status === 'EM_REVISAO' && (
        <button
          type="button"
          disabled={saving === 'aprovar'}
          onClick={() => void aprovar()}
          className="w-full rounded-xl bg-primary text-primary-foreground font-semibold text-sm py-3 sticky bottom-4 shadow-lg"
        >
          {saving === 'aprovar' ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            'Aprovar nota'
          )}
        </button>
      )}
    </div>
  );
}

export default function CmvRealNotaDetalhePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <CmvRealNotaDetalhePageInner />
    </Suspense>
  );
}
