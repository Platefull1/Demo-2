'use client';

import { use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStockSession } from '../../../../estoque/hooks/useStockSession';
import { ContagemResultado } from '../../../../estoque/components/ContagemResultado';

export default function EstoqueResultadoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { sessions, hydrated } = useStockSession();

  const session = useMemo(
    () => sessions.find(s => s.id === id) ?? null,
    [sessions, id],
  );

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="px-6 py-20 text-sm text-muted-foreground">
        Contagem não encontrada.{' '}
        <button
          type="button"
          className="underline text-foreground"
          onClick={() => router.push('/estoque')}
        >
          Voltar ao Estoque
        </button>
      </div>
    );
  }

  const contagens = session.sessoes.flatMap(cat =>
    cat.itens.map(item => ({
      nome: item.nome,
      quantidade: item.quantidadeContada,
      unidade: item.unidade,
    })),
  );

  return (
    <ContagemResultado
      storeId="loja"
      storeName={session.lojaNome || 'Loja'}
      contagens={contagens}
      sessoes={session.sessoes.length}
      finalizadaEm={new Date(session.dataCriacao)}
      onVoltar={() => router.push('/estoque/historico')}
    />
  );
}
