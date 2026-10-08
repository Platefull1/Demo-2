'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Download, Loader2, Lock, Unlock } from 'lucide-react';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type Linha = {
  estoqueInsumoId: string;
  nome: string;
  secao: string;
  unidade: string;
  estoqueInicial: number;
  comprasQtd: number;
  comprasValor: number;
  transfEnviadaQtd: number;
  transfEnviadaValor: number;
  transfRecebidaQtd: number;
  transfRecebidaValor: number;
  desperdicioQtd: number;
  estoqueFinal: number;
  consumoQtd: number;
  consumoValor: number;
  comprasPorSemana: Record<string, { qtd: number; valor: number }>;
};

type Ajuste = {
  id: string;
  secao: string;
  descricao: string;
  valor: number;
  criadoEm: string;
};

function fmt(n: number, d = 2) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

export default function CmvRealFechamentoPage() {
  const now = new Date();
  const [storeSlug, setStoreSlug] = useState('ahu');
  const [competencia, setCompetencia] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
  );
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [ajustes, setAjustes] = useState<Ajuste[]>([]);
  const [pendencias, setPendencias] = useState<string[]>([]);
  const [status, setStatus] = useState('ABERTO');
  const [vendaMes, setVendaMes] = useState('');
  const [totais, setTotais] = useState<{
    consumoValor: number;
    ajustesValor: number;
    vendaMes: number | null;
  } | null>(null);
  const [canFechar, setCanFechar] = useState(false);
  const [canReabrir, setCanReabrir] = useState(false);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [adjSecao, setAdjSecao] = useState('MATERIA_PRIMA');
  const [adjDesc, setAdjDesc] = useState('');
  const [adjValor, setAdjValor] = useState('');
  const [contagens, setContagens] = useState<
    Array<{
      id: string;
      lojaNome: string | null;
      storeSlug: string | null;
      lojaNaoIdentificada: boolean;
      itensCount: number;
      updatedAt: string;
    }>
  >([]);
  const [contagemEscolhida, setContagemEscolhida] = useState('');
  const [storeOverrideContagem, setStoreOverrideContagem] = useState('');

  const lojasOpts = allowed.length > 0 ? allowed : Object.keys(CMV_STORE_LABELS);

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const [res, resC] = await Promise.all([
        fetch(
          `/api/cmv-real/fechamento?storeSlug=${storeSlug}&competencia=${competencia}`,
          { cache: 'no-store' },
        ),
        fetch('/api/cmv-real/contagens', { cache: 'no-store' }),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setLinhas(data.linhas || []);
      setAjustes(data.fechamento?.ajustes || []);
      setPendencias(data.pendencias || []);
      setStatus(data.fechamento?.status || 'ABERTO');
      setVendaMes(
        data.fechamento?.vendaMes != null ? String(data.fechamento.vendaMes) : '',
      );
      setTotais(data.totais);
      setCanFechar(data.canFechar === true);
      setCanReabrir(data.canReabrir === true);
      setLojaTravada(data.lojaTravada === true);
      setAllowed(data.allowedStoreSlugs || []);
      if (resC.ok) {
        const dc = await resC.json();
        setContagens(dc.contagens || []);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug, competencia]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch('/api/cmv-real/fechamento', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeSlug, competencia, ...body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha');
    return data;
  };

  const salvarVenda = async () => {
    try {
      await patch({
        action: 'set_venda',
        vendaMes: vendaMes === '' ? null : Number(String(vendaMes).replace(',', '.')),
      });
      setMsg('Venda/mês salva');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const addAjuste = async () => {
    try {
      await patch({
        action: 'add_ajuste',
        secao: adjSecao,
        descricao: adjDesc,
        valor: Number(String(adjValor).replace(',', '.')),
      });
      setAdjDesc('');
      setAdjValor('');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const aplicarContagem = async () => {
    if (!contagemEscolhida) return;
    const c = contagens.find((x) => x.id === contagemEscolhida);
    const slug =
      c?.lojaNaoIdentificada
        ? storeOverrideContagem
        : c?.storeSlug || storeSlug;
    if (!slug) {
      setMsg('Escolha a loja da contagem não identificada');
      return;
    }
    try {
      const res = await fetch('/api/cmv-real/contagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contagemId: contagemEscolhida,
          storeSlug: slug,
          competencia,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setMsg(`Contagem aplicada: ${data.gravados} itens`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const porSecao = useMemo(() => {
    const m = new Map<string, Linha[]>();
    for (const l of linhas) {
      const arr = m.get(l.secao) || [];
      arr.push(l);
      m.set(l.secao, arr);
    }
    return m;
  }, [linhas]);

  const aberto = status === 'ABERTO';

  return (
    <div className="space-y-4 max-w-none">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="text-[10px] text-gray-500 block">Loja</label>
          <select
            value={storeSlug}
            disabled={lojaTravada && lojasOpts.length <= 1}
            onChange={(e) => setStoreSlug(e.target.value)}
            className="bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
          >
            {lojasOpts.map((s) => (
              <option key={s} value={s}>
                {CMV_STORE_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block">Competência</label>
          <input
            type="month"
            value={competencia}
            onChange={(e) => setCompetencia(e.target.value)}
            className="bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <a
          href={`/api/cmv-real/fechamento?storeSlug=${storeSlug}&competencia=${competencia}&export=xlsx`}
          className="inline-flex items-center gap-1 rounded-lg border border-[#2a2a2e] px-3 py-2 text-xs text-gray-300"
        >
          <Download className="w-3.5 h-3.5" /> XLSX
        </a>
        {canFechar && aberto && (
          <button
            type="button"
            onClick={() =>
              void patch({ action: 'fechar' }).then(load).catch((e) =>
                setMsg(e.message),
              )
            }
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 text-black text-xs font-semibold px-3 py-2"
          >
            <Lock className="w-3.5 h-3.5" /> Fechar mês
          </button>
        )}
        {canReabrir && !aberto && (
          <button
            type="button"
            onClick={() =>
              void patch({ action: 'reabrir' }).then(load).catch((e) =>
                setMsg(e.message),
              )
            }
            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 text-amber-300 text-xs px-3 py-2"
          >
            <Unlock className="w-3.5 h-3.5" /> Reabrir
          </button>
        )}
        <span
          className={`text-[10px] uppercase px-2 py-1 rounded ${
            aberto ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
          }`}
        >
          {status}
        </span>
      </div>

      {pendencias.length > 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 space-y-1">
          <p className="text-xs font-semibold text-amber-300">Pendências (não bloqueiam)</p>
          {pendencias.map((p, i) => (
            <p key={i} className="text-xs text-amber-100/90">
              • {p}
            </p>
          ))}
        </div>
      )}

      {msg && <p className="text-sm text-amber-300">{msg}</p>}

      {/* Venda + ajustes */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-400">Venda / mês</p>
          <p className="text-[10px] text-gray-600">
            Manual por enquanto — preparado para Saipos total_pedidos.
          </p>
          <div className="flex gap-2">
            <input
              value={vendaMes}
              disabled={!aberto || !canFechar}
              onChange={(e) => setVendaMes(e.target.value)}
              placeholder="R$"
              className="flex-1 bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm disabled:opacity-50"
            />
            {canFechar && aberto && (
              <button
                type="button"
                onClick={() => void salvarVenda()}
                className="rounded-lg bg-amber-500 text-black text-xs font-semibold px-3"
              >
                Salvar
              </button>
            )}
          </div>
          {totais && (
            <p className="text-xs text-gray-500">
              Consumo R$ {fmt(totais.consumoValor)} · Ajustes R${' '}
              {fmt(totais.ajustesValor)}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-400">Ajustes manuais</p>
          <p className="text-[10px] text-gray-600">
            Sempre vazios no mês novo — nunca copiados.
          </p>
          {ajustes.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhum ajuste</p>
          ) : (
            <ul className="space-y-1">
              {ajustes.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between gap-2 text-xs text-gray-300 border-b border-[#2a2a2e] pb-1"
                >
                  <span>
                    <span className="text-gray-500">{a.secao}</span> · {a.descricao}
                  </span>
                  <span className="font-medium">R$ {fmt(a.valor)}</span>
                </li>
              ))}
            </ul>
          )}
          {canFechar && aberto && (
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <select
                value={adjSecao}
                onChange={(e) => setAdjSecao(e.target.value)}
                className="bg-[#0a0a0c] border border-[#2a2a2e] rounded px-2 py-1.5 text-xs col-span-2"
              >
                <option value="MATERIA_PRIMA">Matéria-prima</option>
                <option value="EMBALAGEM">Embalagem</option>
                <option value="BEBIDA">Bebida</option>
                <option value="GERAL">Geral</option>
              </select>
              <input
                placeholder="Descrição"
                value={adjDesc}
                onChange={(e) => setAdjDesc(e.target.value)}
                className="bg-[#0a0a0c] border border-[#2a2a2e] rounded px-2 py-1.5 text-xs col-span-2"
              />
              <input
                placeholder="Valor"
                value={adjValor}
                onChange={(e) => setAdjValor(e.target.value)}
                className="bg-[#0a0a0c] border border-[#2a2a2e] rounded px-2 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={() => void addAjuste()}
                className="rounded bg-amber-500/90 text-black text-xs font-semibold"
              >
                + Ajuste
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contagem */}
      {canFechar && aberto && (
        <div className="rounded-xl border border-[#2a2a2e] bg-[#121214] p-3 space-y-2">
          <p className="text-xs font-semibold text-gray-400">
            Estoque final (contagem)
          </p>
          <select
            value={contagemEscolhida}
            onChange={(e) => setContagemEscolhida(e.target.value)}
            className="w-full bg-[#0a0a0c] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Selecionar contagem concluída…</option>
            {contagens.map((c) => (
              <option key={c.id} value={c.id}>
                {c.lojaNaoIdentificada
                  ? `⚠ ${c.lojaNome || 'sem nome'} (loja não identificada)`
                  : `${CMV_STORE_LABELS[c.storeSlug || ''] || c.storeSlug} — ${c.lojaNome}`}{' '}
                · {c.itensCount} itens ·{' '}
                {new Date(c.updatedAt).toLocaleDateString('pt-BR')}
              </option>
            ))}
          </select>
          {contagens.find((c) => c.id === contagemEscolhida)?.lojaNaoIdentificada && (
            <select
              value={storeOverrideContagem}
              onChange={(e) => setStoreOverrideContagem(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-amber-500/40 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Associar à loja…</option>
              {Object.entries(CMV_STORE_LABELS).map(([s, lab]) => (
                <option key={s} value={s}>
                  {lab}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            disabled={!contagemEscolhida}
            onClick={() => void aplicarContagem()}
            className="rounded-lg bg-amber-500 text-black text-xs font-semibold px-3 py-2 disabled:opacity-40"
          >
            Aplicar como estoque final
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2a2a2e]">
          <table className="text-xs min-w-[1100px] w-full border-collapse">
            <thead>
              <tr className="bg-[#121214] text-gray-500">
                <th className="sticky left-0 z-10 bg-[#121214] text-left px-2 py-2 min-w-[160px] border-r border-[#2a2a2e]">
                  Produto
                </th>
                <th className="px-2 py-2 text-right">Ini</th>
                <th className="px-2 py-2 text-right">Compras</th>
                <th className="px-2 py-2 text-right">S1</th>
                <th className="px-2 py-2 text-right">S2</th>
                <th className="px-2 py-2 text-right">S3</th>
                <th className="px-2 py-2 text-right">S4</th>
                <th className="px-2 py-2 text-right">S5</th>
                <th className="px-2 py-2 text-right">Transf. env.</th>
                <th className="px-2 py-2 text-right">Transf. rec.</th>
                <th className="px-2 py-2 text-right">Desp.</th>
                <th className="px-2 py-2 text-right">Final</th>
                <th className="px-2 py-2 text-right">Consumo</th>
                <th className="px-2 py-2 text-right">R$</th>
              </tr>
            </thead>
            <tbody>
              {[...porSecao.entries()].map(([secao, items]) => (
                <Fragment key={secao}>
                  <tr className="bg-[#1a1a1e]">
                    <td
                      colSpan={14}
                      className="sticky left-0 z-10 bg-[#1a1a1e] px-2 py-1.5 text-[10px] uppercase tracking-wide text-amber-400/80 font-semibold"
                    >
                      {secao}
                    </td>
                  </tr>
                  {items.map((l) => (
                    <tr
                      key={l.estoqueInsumoId}
                      className="border-t border-[#2a2a2e] hover:bg-[#141416]"
                    >
                      <td className="sticky left-0 z-10 bg-[#0a0a0c] px-2 py-1.5 text-white border-r border-[#2a2a2e] max-w-[180px] truncate">
                        {l.nome}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmt(l.estoqueInicial, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmt(l.comprasQtd, 1)}
                      </td>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <td
                          key={s}
                          className="px-2 py-1.5 text-right tabular-nums text-gray-400"
                        >
                          {fmt(l.comprasPorSemana[String(s)]?.qtd ?? 0, 1)}
                        </td>
                      ))}
                      <td className="px-2 py-1.5 text-right tabular-nums text-red-300/80">
                        {fmt(l.transfEnviadaQtd, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-emerald-300/80">
                        {fmt(l.transfRecebidaQtd, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmt(l.desperdicioQtd, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {fmt(l.estoqueFinal, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums font-medium">
                        {fmt(l.consumoQtd, 1)}
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums text-amber-200/90">
                        {fmt(l.consumoValor)}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
