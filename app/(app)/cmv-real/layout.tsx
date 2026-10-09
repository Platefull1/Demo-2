'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { useCmvRealAccess } from '@/hooks/useCmvRealAccess';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/cmv-real/notas', label: 'Revisão', match: '/cmv-real/notas' },
  { href: '/cmv-real/lancamentos', label: 'Lançamentos', match: '/cmv-real/lancamentos' },
  { href: '/cmv-real/fechamento', label: 'Fechamento', match: '/cmv-real/fechamento' },
  { href: '/cmv-real/produtos', label: 'Produtos', match: '/cmv-real/produtos' },
  { href: '/cmv-real/importar', label: 'Importar', match: '/cmv-real/importar' },
];

export default function CmvRealLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { canView, lojaNaoConfigurada, loading } = useCmvRealAccess();

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
        <nav className="flex gap-1 overflow-x-auto border-b border-border -mx-1 px-1 scrollbar-none">
          {TABS.map((t) => {
            const active = pathname?.startsWith(t.match);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  'shrink-0 text-sm font-medium px-3 py-2 -mb-px border-b-2 transition-colors',
                  'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                  active
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
}
