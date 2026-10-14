'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStockSession } from '../../estoque/hooks/useStockSession';
import { useProdutosEstoque, construirSessoes } from '../../estoque/hooks/useProdutosEstoque';
import { useEstoqueConfig } from '../../estoque/hooks/useEstoqueConfig';
import { HomeScreen } from '../../estoque/components/HomeScreen';

interface Loja {
  id: string;
  nome: string;
}

export default function EstoqueVisaoGeralPage() {
  const router = useRouter();
  const [showLojaModal, setShowLojaModal] = useState(false);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loadingLojas, setLoadingLojas] = useState(false);

  const { config, productOrder, hydrated: configHydrated } = useEstoqueConfig();
  const {
    sessions,
    hydrated,
    iniciarContagem,
    retomarContagem,
    excluirContagem,
    flushPendingSavesAsync,
  } = useStockSession();
  const { produtos, refetch } = useProdutosEstoque(config, productOrder);

  if (!hydrated || !configHydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  const abrirSelecaoLoja = async () => {
    setLoadingLojas(true);
    setShowLojaModal(true);
    try {
      const res = await fetch('/api/rh/lojas');
      if (res.ok) setLojas(await res.json());
    } catch {
      /* silencia */
    } finally {
      setLoadingLojas(false);
    }
  };

  const handleIniciarComLoja = async (lojaNome?: string) => {
    setShowLojaModal(false);
    const insumosAtualizados = await refetch();
    const sessoesIniciais = construirSessoes(
      insumosAtualizados ?? produtos,
      config,
      productOrder,
    );
    const session = await iniciarContagem(
      sessoesIniciais,
      'Gerente',
      false,
      lojaNome,
    );
    await flushPendingSavesAsync();
    router.push(`/estoque/contagem/${session.id}`);
  };

  const handleRetomar = async (sessionId: string) => {
    const insumosAtualizados = await refetch();
    const catalogo = construirSessoes(
      insumosAtualizados ?? produtos,
      config,
      productOrder,
    );
    retomarContagem(sessionId, catalogo);
    await flushPendingSavesAsync();
    router.push(`/estoque/contagem/${sessionId}`);
  };

  return (
    <div className="relative">
      {showLojaModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-5 pt-5 pb-3 border-b border-[#2a2a2e]">
              <h3 className="text-base font-semibold text-white">
                Qual loja está sendo contada?
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Selecione para identificar o histórico
              </p>
            </div>
            <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
              {loadingLojas ? (
                <div className="flex items-center justify-center py-6 gap-2 text-gray-500 text-sm">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Carregando lojas…
                </div>
              ) : lojas.length > 0 ? (
                lojas.map(loja => (
                  <button
                    key={loja.id}
                    type="button"
                    onClick={() => handleIniciarComLoja(loja.nome)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-[#2a2a2e] hover:bg-amber-500/10 hover:border-amber-500/30 border border-transparent text-white text-sm font-medium transition-all"
                  >
                    {loja.nome}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma loja cadastrada no RH
                </p>
              )}
            </div>
            <div className="px-3 pb-3 pt-1 border-t border-[#2a2a2e]">
              <button
                type="button"
                onClick={() => handleIniciarComLoja(undefined)}
                className="w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-[#2a2a2e] transition-colors"
              >
                Continuar sem selecionar loja
              </button>
            </div>
          </div>
        </div>
      )}

      <HomeScreen
        sessions={sessions}
        onIniciar={abrirSelecaoLoja}
        onRetomar={handleRetomar}
        onExcluir={excluirContagem}
      />
    </div>
  );
}
