'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStockSession } from '../../estoque/hooks/useStockSession';
import { useProdutosEstoque, construirSessoes } from '../../estoque/hooks/useProdutosEstoque';
import { useEstoqueConfig } from '../../estoque/hooks/useEstoqueConfig';
import { HomeScreen } from '../../estoque/components/HomeScreen';
import { Button } from '@/components/ui/button';
import type { LojaSelecao } from '@/lib/store-access';

interface EstoqueAccess {
  allowedStoreSlugs: string[] | null;
  lojas: LojaSelecao[];
  lojaTravada: boolean;
  lojaNaoConfigurada: boolean;
  singleStoreSlug: string | null;
}

export default function EstoqueVisaoGeralPage() {
  const router = useRouter();
  const [showLojaModal, setShowLojaModal] = useState(false);
  const [access, setAccess] = useState<EstoqueAccess | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    fetch('/api/estoque/access')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: EstoqueAccess & { ok?: boolean }) => {
        if (cancelled) return;
        setAccess({
          allowedStoreSlugs: data.allowedStoreSlugs ?? null,
          lojas: Array.isArray(data.lojas) ? data.lojas : [],
          lojaTravada: Boolean(data.lojaTravada),
          lojaNaoConfigurada: Boolean(data.lojaNaoConfigurada),
          singleStoreSlug: data.singleStoreSlug ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setAccessError('Não foi possível carregar o escopo de lojas.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleIniciarComLoja = useCallback(
    async (lojaNome?: string) => {
      setShowLojaModal(false);
      setStartError(null);
      try {
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
      } catch {
        setStartError(
          'Não foi possível iniciar a contagem. Verifique se a loja está permitida para o seu usuário.',
        );
      }
    },
    [
      refetch,
      produtos,
      config,
      productOrder,
      iniciarContagem,
      flushPendingSavesAsync,
      router,
    ],
  );

  const abrirSelecaoLoja = async () => {
    setStartError(null);
    if (access?.lojaNaoConfigurada) {
      setStartError(
        'Loja não configurada. Peça ao administrador para definir a loja deste usuário.',
      );
      return;
    }

    const opcoes = access?.lojas ?? [];
    if (opcoes.length === 1) {
      await handleIniciarComLoja(opcoes[0]!.nome);
      return;
    }
    if (opcoes.length === 0) {
      setStartError(
        'Nenhuma loja permitida para o seu usuário. Peça ao administrador para conferir o perfil no RH.',
      );
      return;
    }
    setShowLojaModal(true);
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

  if (!hydrated || !configHydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (access?.lojaNaoConfigurada) {
    return (
      <div className="px-6 py-6 md:px-8 space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">Estoque</h1>
        <p className="text-sm text-muted-foreground">
          Loja não configurada. Peça ao administrador para definir a loja deste
          usuário no RH.
        </p>
      </div>
    );
  }

  const lojasModal = access?.lojas ?? [];

  return (
    <div className="relative">
      {(accessError || startError) && (
        <div className="mx-6 mt-4 md:mx-8 rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground">
          {startError || accessError}
        </div>
      )}

      {showLojaModal && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="px-5 pt-5 pb-3 border-b border-border">
              <h3 className="text-base font-semibold text-foreground">
                Qual loja está sendo contada?
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selecione para identificar o histórico
              </p>
            </div>
            <div className="p-3 space-y-1.5 max-h-72 overflow-y-auto">
              {lojasModal.length > 0 ? (
                lojasModal.map((loja) => (
                  <Button
                    key={loja.slug}
                    type="button"
                    variant="ghost"
                    onClick={() => handleIniciarComLoja(loja.nome)}
                    className="h-auto w-full justify-start px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {loja.nome}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-left py-4 px-1">
                  Nenhuma loja permitida para o seu usuário
                </p>
              )}
            </div>
            <div className="px-3 pb-3 pt-1 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => setShowLojaModal(false)}
              >
                Cancelar
              </Button>
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
