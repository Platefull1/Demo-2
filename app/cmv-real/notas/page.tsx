'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ChevronRight } from 'lucide-react';

type NotaRow = {
  id: string;
  numero: string;
  storeSlug: string;
  status: string;
  dataEntrada: string;
  valorTotal: number;
  fornecedor: { razaoSocial: string; nomeFantasia: string | null; ignorarCmv: boolean };
  itensTotal: number;
  itensSugeridos: number;
  itensSemMap: number;
};

export default function CmvRealNotasPage() {
  const [notas, setNotas] = useState<NotaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[] | null>(null);
  const [storeSlug, setStoreSlug] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status: 'EM_REVISAO' });
      if (storeSlug) q.set('storeSlug', storeSlug);
      const res = await fetch(`/api/cmv-real/notas?${q}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setNotas(data.notas || []);
      setLojaTravada(data.lojaTravada === true);
      setAllowed(data.allowedStoreSlugs);
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
  }, [storeSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  const lojasOpts =
    allowed && allowed.length > 0
      ? allowed
      : ['ahu', 'pilarzinho', 'portao', 'uberaba'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500 shrink-0">Loja</label>
        <select
          value={storeSlug}
          disabled={lojaTravada && (allowed?.length ?? 0) <= 1}
          onChange={(e) => setStoreSlug(e.target.value)}
          className="flex-1 bg-[#121214] border border-[#2a2a2e] rounded-lg px-3 py-2 text-sm disabled:opacity-60"
        >
          {!lojaTravada && <option value="">Todas</option>}
          {lojasOpts.map((s) => (
            <option key={s} value={s}>
              {s}
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
        <p className="text-sm text-gray-500 text-center py-10">
          Nenhuma nota em revisão.
        </p>
      ) : (
        <ul className="space-y-2">
          {notas.map((n) => (
            <li key={n.id}>
              <Link
                href={`/cmv-real/notas/${n.id}`}
                className="flex items-center gap-3 rounded-xl border border-[#2a2a2e] bg-[#121214] px-3 py-3 active:bg-[#1a1a1e]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <span>NF {n.numero}</span>
                    <span className="text-[10px] uppercase text-gray-500 bg-[#2a2a2e] px-1.5 py-0.5 rounded">
                      {n.storeSlug}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {new Date(n.dataEntrada).toLocaleDateString('pt-BR')} ·{' '}
                    R$ {n.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {(n.itensSugeridos > 0 || n.itensSemMap > 0) && (
                      <span className="text-amber-400">
                        {' '}
                        · {n.itensSugeridos + n.itensSemMap} pendente(s)
                      </span>
                    )}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
