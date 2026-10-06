'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Check, Ban } from 'lucide-react';
import {
  CUSTO_KG_MAX,
  CUSTO_KG_MIN,
  formatNumBr,
  notaStatusLabel,
  perguntaFator,
  storeLabel,
  textoAlertaAmbiguo,
} from '@/lib/nfe/ui-labels';

type Sugestao = { id: string; nome: string; score: number };

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
  const n = Number(String(raw).replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function statusBadgeClass(status: string): string {
  if (status === 'APROVADA') return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
  if (status === 'IGNORADA') return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
}

export default function CmvRealNotaDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [canRevisar, setCanRevisar] = useState(false);
  const [canMapeamentoCriar, setCanMapeamentoCriar] = useState(false);
  const [canMapeamentoEditar, setCanMapeamentoEditar] = useState(false);
  const [custoMedioPorInsumo, setCustoMedioPorInsumo] = useState<Record<string, number>>({});
  const [limiteVariacao, setLimiteVariacao] = useState(30);
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

  const [draft, setDraft] = useState<
    Record<
      string,
      { produtoId: string; fator: string; criarMap: boolean; outro: boolean }
    >
  >({});

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const [resNota, resProd] = await Promise.all([
        fetch(`/api/cmv-real/notas/${id}`, { cache: 'no-store' }),
        fetch('/api/cmv-real/produtos', { cache: 'no-store' }),
      ]);
      const data = await resNota.json();
      if (!resNota.ok) throw new Error(data.error || 'Erro');
      setCanRevisar(data.canRevisar === true);
      setCanMapeamentoCriar(data.canMapeamentoCriar === true);
      setCanMapeamentoEditar(data.canMapeamentoEditar === true);
      setCustoMedioPorInsumo(data.custoMedioPorInsumo || {});
      setLimiteVariacao(Number(data.limiteVariacaoCustoPercent ?? 30));
      setNota(data.nota);

      if (resProd.ok) {
        const pd = await resProd.json();
        setProdutos(
          (pd.itens || [])
            .filter((p: { ativo: boolean }) => p.ativo !== false)
            .map(
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
            ),
        );
      }

      const next: typeof draft = {};
      for (const it of data.nota.itens as Item[]) {
        const sugs = parseSugestoes(it.sugestoes);
        const first =
          it.estoqueInsumoId || it.sugestaoInsumoId || sugs[0]?.id || '';
        next[it.id] = {
          produtoId: first,
          fator: String(it.fatorConversao ?? it.fatorSugerido ?? 1),
          criarMap: true,
          outro: false,
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
    const fator = parseFator(d.fator);
    if (fator == null) {
      setMsg('Valor de conversão inválido');
      return;
    }
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
    if (!confirm('Marcar este fornecedor como fora do CMV? A nota será ignorada.'))
      return;
    setSaving('fornecedor');
    try {
      await post({ action: 'fornecedor_fora_cmv' });
      router.push('/cmv-real/notas');
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
      router.push('/cmv-real/notas');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
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

  if (!nota) {
    return (
      <div className="space-y-3">
        <Link href="/cmv-real/notas" className="text-sm text-gray-400 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <p className="text-sm text-amber-300">{msg || 'Nota não encontrada'}</p>
      </div>
    );
  }

  const renderContaAoVivo = (it: Item, fatorRaw: string, produtoId: string) => {
    const fator = parseFator(fatorRaw);
    if (fator == null) return null;

    const prod = produtoById.get(produtoId);
    const undCmv = (prod?.unidade || 'KG') as 'KG' | 'UN';
    const sufixo = undCmv === 'UN' ? 'un' : 'kg';
    const undNota = (it.unidadeComercial || 'UN').toUpperCase();
    const valor = it.valorLiquido ?? it.valorBruto;
    const qtdConv = it.quantidade * fator;
    const custo = qtdConv > 0 ? valor / qtdConv : 0;

    const isMateriaPrima = !prod || prod.secao === 'MATERIA_PRIMA';
    const foraFaixa =
      isMateriaPrima &&
      undCmv === 'KG' &&
      (custo < CUSTO_KG_MIN || custo > CUSTO_KG_MAX);

    const ref = produtoId ? custoMedioPorInsumo[produtoId] : undefined;
    const desvioHist =
      ref != null && ref > 0 && limiteVariacao > 0
        ? (Math.abs(custo - ref) / ref) * 100
        : 0;
    const foraHistorico = ref != null && ref > 0 && desvioHist > limiteVariacao;
    const alertaVermelho = foraFaixa || foraHistorico;

    return (
      <p
        className={`text-[11px] leading-relaxed ${
          alertaVermelho ? 'text-red-400' : 'text-gray-400'
        }`}
      >
        {formatNumBr(it.quantidade, it.quantidade % 1 === 0 ? 0 : 2)} {undNota} ×{' '}
        {formatNumBr(fator)} {sufixo} = {formatNumBr(qtdConv)} {sufixo}
        {' · '}
        R$ {formatNumBr(custo)}/{sufixo}
        {foraFaixa && (
          <span className="block mt-0.5">
            Fora da faixa esperada (R$ {formatNumBr(CUSTO_KG_MIN)}–{formatNumBr(CUSTO_KG_MAX)}/
            {sufixo})
          </span>
        )}
        {foraHistorico && ref != null && (
          <span className="block mt-0.5">
            Histórico ≈ R$ {formatNumBr(ref)}/{sufixo}
          </span>
        )}
      </p>
    );
  };

  const renderItem = (it: Item, editavel: boolean) => {
    const sugs = parseSugestoes(it.sugestoes);
    const d = draft[it.id] || {
      produtoId: '',
      fator: '1',
      criarMap: false,
      outro: false,
    };
    const ambiguo = (it.alertas || []).includes('FATOR_AMBIGUO');
    const suspeito = (it.alertas || []).includes('FATOR_SUSPEITO');
    const busy = saving === it.id;

    const prod = produtoById.get(d.produtoId);
    const undCmv = prod?.unidade || 'KG';
    const { pergunta, sufixo } = perguntaFator(it.unidadeComercial, undCmv);

    return (
      <article
        key={it.id}
        className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-3 space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] text-gray-500">Item {it.numeroItem}</p>
            <p className="text-sm text-white font-medium leading-snug mt-0.5">
              {it.descricao}
            </p>
          </div>
          <div className="text-right shrink-0 text-xs text-gray-400">
            <div>
              {it.quantidade} {it.unidadeComercial}
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
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-200'
                : 'bg-orange-500/15 border border-orange-500/40 text-orange-200'
            }`}
          >
            {ambiguo && <p className="font-medium">{textoAlertaAmbiguo(it.unidadeComercial)}</p>}
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
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Produto
              </p>
              {sugs.length > 0 && !d.outro ? (
                <ul className="space-y-1">
                  {sugs.slice(0, 3).map((s, idx) => (
                    <li key={s.id}>
                      <label
                        className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 cursor-pointer ${
                          d.produtoId === s.id
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-[#2a2a2e] bg-[#0a0a0c]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`prod-${it.id}`}
                          checked={d.produtoId === s.id}
                          onChange={() =>
                            setDraft((p) => ({
                              ...p,
                              [it.id]: { ...d, produtoId: s.id, outro: false },
                            }))
                          }
                          className="mt-1 accent-amber-500"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="text-sm text-white block truncate">
                            {s.nome}
                            {idx === 0 ? (
                              <span className="text-[10px] text-amber-400 ml-1">
                                (melhor)
                              </span>
                            ) : null}
                          </span>
                          <span className="text-[10px] text-gray-500">
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
                className="text-[11px] text-gray-400 underline"
              >
                {d.outro || sugs.length === 0
                  ? 'Escolher da lista CMV'
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
                  className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-2.5 py-2 text-sm"
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

            <div className="space-y-1.5">
              <label className="block text-sm text-gray-300 font-medium">
                {pergunta}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={d.fator}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      [it.id]: { ...d, fator: e.target.value },
                    }))
                  }
                  className={`w-full rounded-lg pl-3 pr-10 py-2.5 text-base font-semibold ${
                    ambiguo
                      ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-100'
                      : 'bg-[#0a0a0c] border border-[#2a2a2e] text-white'
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
                  {sufixo}
                </span>
              </div>
              {renderContaAoVivo(it, d.fator, d.produtoId)}
            </div>

            {canMapeamentoCriar && (
              <label className="flex items-center gap-2 text-xs text-gray-400">
                <input
                  type="checkbox"
                  checked={d.criarMap}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      [it.id]: { ...d, criarMap: e.target.checked },
                    }))
                  }
                  className="accent-amber-500"
                />
                Salvar mapeamento para próximas notas
              </label>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmar(it.id)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-black font-semibold text-sm py-2.5 active:scale-[0.98] disabled:opacity-50"
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
                className="rounded-lg border border-[#2a2a2e] px-3 py-2.5 text-sm text-gray-400 active:bg-[#1a1a1e]"
              >
                Ignorar
              </button>
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-500">
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
        href="/cmv-real/notas"
        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Notas
      </Link>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">
              NF {nota.numero}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
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
        <p className="text-sm text-gray-300">
          {nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial}
        </p>
        <p className="text-[11px] text-gray-600">{nota.fornecedor.cnpj}</p>

        {canMapeamentoEditar && !nota.fornecedor.ignorarCmv && (
          <button
            type="button"
            disabled={saving === 'fornecedor'}
            onClick={() => void fornecedorFora()}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm font-medium py-2.5 active:bg-red-500/20"
          >
            <Ban className="w-4 h-4" />
            Fornecedor fora do CMV
          </button>
        )}
      </header>

      {msg && (
        <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
          {msg}
        </p>
      )}

      {pendentes.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-400">
            Pendentes ({pendentes.length})
          </h3>
          {pendentes.map((it) => renderItem(it, true))}
        </section>
      )}

      {resolvidos.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Resolvidos ({resolvidos.length})
          </h3>
          {resolvidos.map((it) => renderItem(it, false))}
        </section>
      )}

      {canRevisar && pendentes.length === 0 && nota.status === 'EM_REVISAO' && (
        <button
          type="button"
          disabled={saving === 'aprovar'}
          onClick={() => void aprovar()}
          className="w-full rounded-xl bg-emerald-500 text-black font-semibold text-sm py-3 sticky bottom-4 shadow-lg"
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
