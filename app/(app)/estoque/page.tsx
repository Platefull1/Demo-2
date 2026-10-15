'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStockSession } from '../../estoque/hooks/useStockSession';
import { useProdutosEstoque, construirSessoes } from '../../estoque/hooks/useProdutosEstoque';
import { useEstoqueConfig } from '../../estoque/hooks/useEstoqueConfig';
import { HomeScreen } from '../../estoque/components/HomeScreen';
import { storeSlugFromLojaNome } from '@/lib/store-access';

interface Loja {
  id: string;
  nome: string;
}

interface EstoqueAccess {
  allowedStoreSlugs: string[] | null;
  lojaTravada: boolean;
  lojaNaoConfigurada: boolean;
  singleStoreSlug: string | null;
}

export default function EstoqueVisaoGeralPage() {
  const router = useRouter();
  const [showLojaModal, setShowLojaModal] = useState(false);
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [loadingLojas, setLoadingLojas] = useState(false);
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

  const filtrarLojasPermitidas = useCallback(
    (todas: Loja[]): Loja[] => {
      if (!access || access.allowedStoreSlugs === null) return todas;
      const allowed = new Set(access.allowedStoreSlugs);
      return todas.filter((loja) => {
        const slug = storeSlugFromLojaNome(loja.nome);
        return slug != null && allowed.has(slug);
      });
    },
    [access],
  );

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

    setLoadingLojas(true);
    try {
      const res = await fetch('/api/rh/lojas');
      const todas: Loja[] = res.ok ? await res.json() : [];
      const permitidas = filtrarLojasPermitidas(todas);

      if (access?.singleStoreSlug) {
        const unica =
          permitidas.find(
            (l) => storeSlugFromLojaNome(l.nome) === access.singleStoreSlug,
          ) ?? permitidas[0];
        if (unica) {
          await handleIniciarComLoja(unica.nome);
          return;
        }
      }

      setLojas(permitidas);
      setShowLojaModal(true);
    } catch {
      setStartError('Não foi possível carregar as lojas.');
    } finally {
      setLoadingLojas(false);
    }
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

  const podeContinuarSemLoja = access?.allowedStoreSlugs === null;

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
              {loadingLojas ? (
                <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground text-sm">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Carregando lojas…
                </div>
              ) : lojas.length > 0 ? (
                lojas.map((loja) => (
                  <button
                    key={loja.id}
                    type="button"
                    onClick={() => handleIniciarComLoja(loja.nome)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-accent border border-transparent text-foreground text-sm font-medium transition-all"
                  >
                    {loja.nome}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-left py-4 px-1">
                  Nenhuma loja permitida para o seu usuário
                </p>
              )}
            </div>
            {podeContinuarSemLoja && (
              <div className="px-3 pb-3 pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => handleIniciarComLoja(undefined)}
                  className="w-full py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Continuar sem selecionar loja
                </button>
              </div>
            )}
            {!podeContinuarSemLoja && (
              <div className="px-3 pb-3 pt-1 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowLojaModal(false)}
                  className="w-full py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}
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
