'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModuleTabs, moduleTabClass } from '@/components/layout/ModuleTabs';
import { EstoqueMobileNav } from './components/EstoqueMobileNav';

const TABS = [
  { href: '/estoque', label: 'Visão geral', matchExact: true },
  { href: '/estoque/historico', label: 'Histórico' },
  { href: '/estoque/produtos', label: 'Produtos' },
  { href: '/estoque/alertas', label: 'Alertas' },
] as const;

function tabActive(pathname: string | null, href: string, matchExact?: boolean) {
  if (!pathname) return false;
  if (matchExact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function EstoqueAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Resultado fica no AppShell mas sem sub-nav (foco na leitura)
  const hideChrome = Boolean(pathname?.startsWith('/estoque/resultado'));

  if (hideChrome) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <div className="w-full px-6 py-6 md:px-8 space-y-6 pb-24 md:pb-6">
      <div className="hidden md:block">
        <ModuleTabs>
          {TABS.map(t => {
            const active = tabActive(
              pathname,
              t.href,
              'matchExact' in t ? t.matchExact : false,
            );
            return (
              <Link key={t.href} href={t.href} className={moduleTabClass(active)}>
                {t.label}
              </Link>
            );
          })}
        </ModuleTabs>
      </div>
      <div>{children}</div>
      <EstoqueMobileNav />
    </div>
  );
}
