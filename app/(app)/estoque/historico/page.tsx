'use client';

import { useRouter } from 'next/navigation';
import { useStockSession } from '../../../estoque/hooks/useStockSession';
import { useProdutosEstoque, construirSessoes } from '../../../estoque/hooks/useProdutosEstoque';
import { useEstoqueConfig } from '../../../estoque/hooks/useEstoqueConfig';
import { Historico } from '../../../estoque/pages/Historico';

export default function EstoqueHistoricoPage() {
  const router = useRouter();
  const { config, productOrder, hydrated: configHydrated } = useEstoqueConfig();
  const {
    sessions,
    hydrated,
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
    <Historico
      sessions={sessions}
      onVoltar={() => router.push('/estoque')}
      onRetomar={handleRetomar}
      onExcluir={excluirContagem}
      onVerResultado={s => router.push(`/estoque/resultado/${s.id}`)}
    />
  );
}
