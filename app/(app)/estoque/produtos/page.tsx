'use client';

import { useRouter } from 'next/navigation';
import { useEstoqueConfig } from '../../../estoque/hooks/useEstoqueConfig';
import { useProdutosEstoque } from '../../../estoque/hooks/useProdutosEstoque';
import { GerenciarProdutos } from '../../../estoque/pages/GerenciarProdutos';

export default function EstoqueProdutosPage() {
  const router = useRouter();
  const {
    config,
    productOrder,
    hydrated: configHydrated,
    setAtivo,
    setMinimo,
    setModoContagem,
    setKgPorUnidade,
    setProductOrder,
    moverProdutoAcima,
    moverProdutoAbaixo,
  } = useEstoqueConfig();
  const { produtos, refetch, removeLocal } = useProdutosEstoque(config, productOrder);

  if (!configHydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  return (
    <GerenciarProdutos
      produtos={produtos}
      config={config}
      productOrder={productOrder}
      onVoltar={() => router.push('/estoque')}
      onSetAtivo={setAtivo}
      onSetMinimo={setMinimo}
      onSetModoContagem={setModoContagem}
      onSetKgPorUnidade={setKgPorUnidade}
      onMoverAcima={moverProdutoAcima}
      onMoverAbaixo={moverProdutoAbaixo}
      onSetProductOrder={setProductOrder}
      onRefetch={refetch}
      onRemoveLocal={removeLocal}
    />
  );
}
