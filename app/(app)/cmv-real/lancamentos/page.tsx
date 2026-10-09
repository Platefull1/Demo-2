'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };
type Lanc = {
  id: string;
  storeSlug: string;
  data: string;
  tipo: string;
  estoqueInsumoId: string;
  quantidade: number;
  valorTotal: number;
  lojaOrigem: string | null;
  lojaDestino: string | null;
  observacao: string | null;
};

const TIPOS = [
  { value: 'COMPRA_MANUAL', label: 'Compra manual' },
  { value: 'DESPERDICIO', label: 'Desperdício' },
  { value: 'TRANSFERENCIA_SAIDA', label: 'Transf. saída' },
  { value: 'TRANSFERENCIA_ENTRADA', label: 'Transf. entrada' },
] as const;

const STORES = Object.entries(CMV_STORE_LABELS);

export default function CmvRealLancamentosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lancs, setLancs] = useState<Lanc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [storeSlug, setStoreSlug] = useState('ahu');
  const [tipo, setTipo] = useState<string>('COMPRA_MANUAL');
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [lojaDestino, setLojaDestino] = useState('');
  const [lojaOrigem, setLojaOrigem] = useState('');
  const [observacao, setObservacao] = useState('');

  const lojasOpts =
    allowed && allowed.length > 0 ? allowed : STORES.map(([s]) => s);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resL, resP] = await Promise.all([
        fetch(`/api/cmv-real/lancamentos?storeSlug=${storeSlug}`, {
          cache: 'no-store',
        }),
        fetch('/api/cmv-real/produtos', { cache: 'no-store' }),
      ]);
      const dl = await resL.json();
      if (!resL.ok) throw new Error(dl.error || 'Erro');
      setLancs(dl.lancamentos || []);
      setLojaTravada(dl.lojaTravada === true);
      setAllowed(dl.allowedStoreSlugs);
      if (
        dl.lojaTravada &&
        Array.isArray(dl.allowedStoreSlugs) &&
        dl.allowedStoreSlugs.length === 1
      ) {
        setStoreSlug(dl.allowedStoreSlugs[0]);
      }
      if (resP.ok) {
        const dp = await resP.json();
        setProdutos(
          (dp.itens || [])
            .filter((p: { ativo: boolean }) => p.ativo !== false)
            .map((p: Produto & { nome: string }) => ({
              estoqueInsumoId: p.estoqueInsumoId,
              nome: p.nome,
              unidade: p.unidade,
            })),
        );
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const salvar = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/lancamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          storeSlug,
          data,
          estoqueInsumoId: produtoId,
          quantidade: Number(String(quantidade).replace(',', '.')),
          valorTotal: Number(String(valorTotal).replace(',', '.')),
          lojaDestino: tipo === 'TRANSFERENCIA_SAIDA' ? lojaDestino : undefined,
          lojaOrigem: tipo === 'TRANSFERENCIA_ENTRADA' ? lojaOrigem : undefined,
          observacao: observacao || undefined,
        }),
      });
      const dataRes = await res.json();
      if (!res.ok) throw new Error(dataRes.error || 'Falha');
      setShowForm(false);
      setQuantidade('');
      setValorTotal('');
      setObservacao('');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  };

  const labelTipo = (t: string) =>
    TIPOS.find((x) => x.value === t)?.label || t;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Lançamentos</h2>
          <p className="text-xs text-muted-foreground">Compras, desperdício e transferências</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold px-3 py-2"
        >
          <Plus className="w-3.5 h-3.5" /> Novo
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground shrink-0">Loja</label>
        <select
          value={storeSlug}
          disabled={lojaTravada && lojasOpts.length <= 1}
          onChange={(e) => setStoreSlug(e.target.value)}
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm disabled:opacity-60"
        >
          {lojasOpts.map((s) => (
            <option key={s} value={s}>
              {CMV_STORE_LABELS[s] || s}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-3">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
          />
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
          >
            <option value="">Produto…</option>
            {produtos.map((p) => (
              <option key={p.estoqueInsumoId} value={p.estoqueInsumoId}>
                {p.nome} ({p.unidade})
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              inputMode="decimal"
              placeholder="Qtd"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
            />
            <input
              inputMode="decimal"
              placeholder="Valor R$"
              value={valorTotal}
              onChange={(e) => setValorTotal(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          {tipo === 'TRANSFERENCIA_SAIDA' && (
            <select
              value={lojaDestino}
              onChange={(e) => setLojaDestino(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Loja destino…</option>
              {STORES.filter(([s]) => s !== storeSlug).map(([s, lab]) => (
                <option key={s} value={s}>
                  {lab}
                </option>
              ))}
            </select>
          )}
          {tipo === 'TRANSFERENCIA_ENTRADA' && (
            <select
              value={lojaOrigem}
              onChange={(e) => setLojaOrigem(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
            >
              <option value="">Loja origem…</option>
              {STORES.filter(([s]) => s !== storeSlug).map(([s, lab]) => (
                <option key={s} value={s}>
                  {lab}
                </option>
              ))}
            </select>
          )}
          <input
            placeholder="Observação (opcional)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm"
          />
          <button
            type="button"
            disabled={saving || !produtoId}
            onClick={() => void salvar()}
            className="w-full rounded-lg bg-primary text-primary-foreground font-semibold text-sm py-2.5 disabled:opacity-40"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Salvar'}
          </button>
        </div>
      )}

      {msg && <p className="text-sm text-warning">{msg}</p>}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : lancs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Nenhum lançamento.</p>
      ) : (
        <ul className="space-y-2">
          {lancs.map((l) => {
            const prod = produtos.find((p) => p.estoqueInsumoId === l.estoqueInsumoId);
            return (
              <li
                key={l.id}
                className="rounded-xl border border-border bg-card px-3 py-2.5"
              >
                <div className="flex justify-between gap-2 text-sm">
                  <span className="text-foreground font-medium">{labelTipo(l.tipo)}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date(l.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-0.5 truncate">
                  {prod?.nome || l.estoqueInsumoId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {l.quantidade} · R${' '}
                  {l.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {l.lojaDestino && ` → ${CMV_STORE_LABELS[l.lojaDestino] || l.lojaDestino}`}
                  {l.lojaOrigem && ` ← ${CMV_STORE_LABELS[l.lojaOrigem] || l.lojaOrigem}`}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
