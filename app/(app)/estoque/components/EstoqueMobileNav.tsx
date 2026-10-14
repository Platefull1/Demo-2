'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { History, AlertTriangle, Package } from 'lucide-react';
import { useStockSession } from '../../../estoque/hooks/useStockSession';
import { AlertBadge } from '../../../estoque/components/AlertBadge';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/estoque/historico', label: 'Histórico', icon: History },
  { href: '/estoque/produtos', label: 'Produtos', icon: Package },
  { href: '/estoque/alertas', label: 'Alertas', icon: AlertTriangle },
] as const;

/** Bottom nav só em &lt; md — gerentes no celular. */
export function EstoqueMobileNav() {
  const pathname = usePathname();
  const { sessions, hydrated, calcularAlertasReposicao } = useStockSession();

  const totalAlertas = hydrated
    ? sessions
        .filter(s => s.status === 'concluida')
        .flatMap(s => calcularAlertasReposicao(s)).length
    : 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <div className="relative">
              <Icon className="w-5 h-5 text-muted-foreground" />
              {label === 'Alertas' && (
                <AlertBadge
                  count={totalAlertas}
                  className="absolute -top-2 -right-2 scale-75"
                />
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
