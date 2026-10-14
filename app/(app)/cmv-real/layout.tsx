'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ModuleTabs, moduleTabClass } from '@/components/layout/ModuleTabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCmvRealAccess } from '@/hooks/useCmvRealAccess';
import { notasListHref, parseNotasListFilters } from '@/lib/nfe/notas-list-query';

const TABS = [
  { href: '/cmv-real/notas', label: 'Revisão', match: '/cmv-real/notas', preserveFilters: true },
  { href: '/cmv-real/lancamentos', label: 'Lançamentos', match: '/cmv-real/lancamentos' },
  { href: '/cmv-real/fechamento', label: 'Fechamento', match: '/cmv-real/fechamento' },
  { href: '/cmv-real/produtos', label: 'Produtos', match: '/cmv-real/produtos' },
  { href: '/cmv-real/importar', label: 'Importar', match: '/cmv-real/importar' },
];

function CmvRealLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { canView, lojaNaoConfigurada, loading } = useCmvRealAccess();

  const revisaoHref = pathname?.startsWith('/cmv-real/notas')
    ? notasListHref(parseNotasListFilters(searchParams))
    : '/cmv-real/notas';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (lojaNaoConfigurada) {
    return (
      <div className="flex items-center justify-center px-6 py-20">
        <div className="max-w-sm space-y-2">
          <p className="text-base font-semibold text-warning">Loja não configurada</p>
          <p className="text-sm text-muted-foreground">
            Peça ao administrador para definir a loja deste usuário em RH → Usuários.
          </p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center px-6 py-20">
        <p className="text-sm text-muted-foreground">Sem permissão para o CMV Real.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 md:px-8 space-y-6">
      <div className="space-y-4">
        <PageHeader
          title="CMV Real"
          description="Custo real das mercadorias a partir das notas de compra"
        />
        <ModuleTabs>
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.match);
            const href =
              'preserveFilters' in t && t.preserveFilters ? revisaoHref : t.href;
            return (
              <Link key={t.href} href={href} className={moduleTabClass(Boolean(active))}>
                {t.label}
              </Link>
            );
          })}
        </ModuleTabs>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function CmvRealLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <CmvRealLayoutInner>{children}</CmvRealLayoutInner>
    </Suspense>
  );
}
