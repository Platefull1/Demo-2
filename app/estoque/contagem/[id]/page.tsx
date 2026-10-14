'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStockSession } from '../../hooks/useStockSession';
import { Contagem } from '../../pages/Contagem';
import type { StockSession } from '../../types';

export default function EstoqueContagemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const activated = useRef(false);
  const [exiting, setExiting] = useState(false);
  // Mantém o último snapshot enquanto flush/navega (finalizar zera activeSessionId)
  const sessionRef = useRef<StockSession | null>(null);

  const {
    sessions,
    activeSession,
    hydrated,
    saveStatus,
    retomarContagem,
    fecharContagem,
    atualizarQuantidade,
    atualizarObservacao,
    concluirCategoria,
    reabrirCategoria,
    finalizarContagem,
    flushPendingSavesAsync,
  } = useStockSession();

  if (activeSession?.id === id) {
    sessionRef.current = activeSession;
  }

  useEffect(() => {
    if (!hydrated || activated.current || exiting) return;
    const session = sessions.find(s => s.id === id);
    if (!session) {
      router.replace('/estoque');
      return;
    }
    if (session.status !== 'em_andamento') {
      router.replace(`/estoque/resultado/${id}`);
      return;
    }
    activated.current = true;
    // Refresh / deep-link: reabre a mesma contagem sem re-sincronizar catálogo
    retomarContagem(id);
  }, [hydrated, sessions, id, retomarContagem, router, exiting]);

  const sairParaHome = async () => {
    setExiting(true);
    await flushPendingSavesAsync();
    fecharContagem();
    router.push('/estoque');
  };

  const session = activeSession?.id === id ? activeSession : sessionRef.current;

  if (!hydrated || !session || session.id !== id) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500">
          {exiting ? 'Salvando…' : 'Carregando contagem…'}
        </p>
      </div>
    );
  }

  return (
    <Contagem
      session={session}
      saveStatus={saveStatus}
      onFechar={() => {
        void sairParaHome();
      }}
      onQuantidade={atualizarQuantidade}
      onObservacao={atualizarObservacao}
      onConcluirCategoria={concluirCategoria}
      onReabrirCategoria={reabrirCategoria}
      onFinalizar={() => {
        void (async () => {
          setExiting(true);
          finalizarContagem();
          await flushPendingSavesAsync();
          router.push(`/estoque/resultado/${id}`);
        })();
      }}
    />
  );
}
