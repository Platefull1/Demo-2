'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, ChevronRight, MoreHorizontal } from 'lucide-react';
import { storeLabel } from '@/lib/nfe/ui-labels';

type NotaRow = {
  id: string;
  numero: string;
  storeSlug: string;
  status: string;
  dataEntrada: string;
  valorTotal: number;
  fornecedor: {
    razaoSocial: string;
    nomeFantasia: string | null;
    ignorarCmv: boolean;
  };
  itensTotal: number;
  itensProntos: number;
  itensSugeridos: number;
  itensSemMap: number;
};

type TabStatus = 'EM_REVISAO' | 'APROVADA' | 'IGNORADA';

const TABS: { status: TabStatus; label: string }[] = [
  { status: 'EM_REVISAO', label: 'Para revisar' },
  { status: 'APROVADA', label: 'Aprovadas' },
  { status: 'IGNORADA', label: 'Fora do CMV' },
];

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function emptyLabel(status: TabStatus): string {
  if (status === 'APROVADA') return 'Nenhuma nota aprovada neste mês.';
  if (status === 'IGNORADA') return 'Nenhuma nota fora do CMV neste mês.';
  return 'Nenhuma nota para revisar neste mês.';
}

export default function CmvRealNotasPage() {
  const agora = new Date();
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const [counts, setCounts] = useState({ EM_REVISAO: 0, APROVADA: 0, IGNORADA: 0 });
  const [loading, setLoading] = useState(true);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [storeSlug, setStoreSlug] = useState('');
  const [status, setStatus] = useState<TabStatus>('EM_REVISAO');
  const [mes, setMes] = useState(agora.getMonth() + 1);
  const [ano, setAno] = useState(agora.getFullYear());
  const [canMapeamentoEditar, setCanMapeamentoEditar] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const anos = [agora.getFullYear(), agora.getFullYear() - 1, agora.getFullYear() - 2];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        status,
        mes: String(mes),
        ano: String(ano),
      });
      if (storeSlug) q.set('storeSlug', storeSlug);
      const res = await fetch(`/api/cmv-real/notas?${q}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setNotas(data.notas || []);
      setCounts(data.counts || { EM_REVISAO: 0, APROVADA: 0, IGNORADA: 0 });
      setLojaTravada(data.lojaTravada === true);
      setAllowed(data.allowedStoreSlugs);
      setCanMapeamentoEditar(data.canMapeamentoEditar === true);
      if (
        data.lojaTravada &&
        Array.isArray(data.allowedStoreSlugs) &&
        data.allowedStoreSlugs.length === 1
      ) {
        setStoreSlug(data.allowedStoreSlugs[0]);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug, status, mes, ano]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!menuOpenId) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpenId]);

  const fornecedorFora = async (notaId: string) => {
    if (!confirm('Marcar este fornecedor como fora do CMV? A nota será ignorada.'))
      return;
    setSavingId(notaId);
    setMenuOpenId(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/cmv-real/notas/${notaId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fornecedor_fora_cmv' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Falha');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSavingId(null);
    }
  };

  const lojasOpts =
    allowed && allowed.length > 0
      ? allowed
      : ['ahu', 'pilarzinho', 'portao', 'uberaba'];

  return (
    <div className="space-y-4">
      {/* Abas de status */}
      <div className="flex gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const active = status === t.status;
          const n = counts[t.status] ?? 0;
          const label =
            t.status === 'EM_REVISAO' ? `${t.label} (${n})` : t.label;
          return (
            <button
              key={t.status}
              type="button"
              onClick={() => setStatus(t.status)}
              className={`shrink-0 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1e]'
              }`}
            >
              {label}
              {t.status !== 'EM_REVISAO' && n > 0 ? (
                <span className="ml-1 opacity-70">({n})</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Filtros loja + mês */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={storeSlug}
          disabled={lojaTravada && (allowed?.length ?? 0) <= 1}
          onChange={(e) => setStoreSlug(e.target.value)}
          className="flex-1 min-w-[120px] bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm disabled:opacity-60"
        >
          {!lojaTravada && <option value="">Todas as lojas</option>}
          {lojasOpts.map((s) => (
            <option key={s} value={s}>
              {storeLabel(s)}
            </option>
          ))}
        </select>
        <select
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          className="bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
        >
          {MESES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          className="bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm"
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {msg && <p className="text-sm text-amber-300">{msg}</p>}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        </div>
      ) : notas.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-10">{emptyLabel(status)}</p>
      ) : (
        <ul className="space-y-2">
          {notas.map((n) => {
            const prontos = n.itensProntos ?? Math.max(
              0,
              n.itensTotal - n.itensSugeridos - n.itensSemMap,
            );
            const total = n.itensTotal || 1;
            const pct = Math.min(100, Math.round((prontos / total) * 100));
            const menuOpen = menuOpenId === n.id;
            const busy = savingId === n.id;

            return (
              <li key={n.id} className="relative">
                <div className="flex items-stretch rounded-xl border border-[#2a2a2e] bg-[#121214] overflow-hidden">
                  <Link
                    href={`/cmv-real/notas/${n.id}`}
                    className="flex-1 min-w-0 flex items-center gap-3 px-3 py-3 active:bg-[#1a1a1e]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <span>NF {n.numero}</span>
                        <span className="text-[10px] text-gray-400 bg-[#2a2a2e] px-1.5 py-0.5 rounded">
                          {storeLabel(n.storeSlug)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {new Date(n.dataEntrada).toLocaleDateString('pt-BR')} · R${' '}
                        {n.valorTotal.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-gray-400">
                            {prontos} de {n.itensTotal} itens prontos
                          </span>
                          <span className="text-gray-600">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#2a2a2e] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 100 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
                  </Link>

                  {canMapeamentoEditar &&
                    !n.fornecedor.ignorarCmv &&
                    n.status === 'EM_REVISAO' && (
                      <div className="relative border-l border-[#2a2a2e] flex items-center">
                        <button
                          type="button"
                          disabled={busy}
                          aria-label="Mais opções"
                          onClick={(e) => {
                            e.preventDefault();
                            setMenuOpenId(menuOpen ? null : n.id);
                          }}
                          className="px-2.5 h-full text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1e] disabled:opacity-50"
                        >
                          {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4" />
                          )}
                        </button>
                        {menuOpen && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full mt-1 z-30 w-52 rounded-lg border border-[#2a2a2e] bg-[#1c1c1e] shadow-xl py-1"
                          >
                            <button
                              type="button"
                              onClick={() => void fornecedorFora(n.id)}
                              className="w-full text-left px-3 py-2.5 text-sm text-red-300 hover:bg-red-500/10"
                            >
                              Fornecedor fora do CMV
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
