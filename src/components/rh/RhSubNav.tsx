'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModuleTabs, moduleTabClass } from '@/components/layout/ModuleTabs';
import { cn } from '@/lib/utils';

const MAIN_TABS = [
  { href: '/rh', label: 'Visão geral', match: (p: string) => p === '/rh' },
  {
    href: '/rh/funcionarios',
    label: 'Funcionários',
    match: (p: string) => p.startsWith('/rh/funcionarios'),
  },
  {
    href: '/rh/escala',
    label: 'Escala',
    match: (p: string) => p.startsWith('/rh/escala'),
  },
  {
    href: '/rh/custos',
    label: 'Custos',
    match: (p: string) => p.startsWith('/rh/custos'),
  },
  {
    href: '/rh/alertas',
    label: 'Alertas',
    match: (p: string) => p.startsWith('/rh/alertas'),
  },
  {
    href: '/rh/motoboys',
    label: 'Motoboys',
    match: (p: string) => p.startsWith('/rh/motoboys'),
  },
  {
    href: '/bonificacao',
    label: 'Bonificação',
    match: (p: string) => p.startsWith('/bonificacao'),
  },
] as const;

const MORE_ITEMS = [
  { href: '/rh/lojas', label: 'Lojas', match: (p: string) => p.startsWith('/rh/lojas') },
  {
    href: '/rh/quadro-ideal',
    label: 'Quadro ideal',
    match: (p: string) => p.startsWith('/rh/quadro-ideal'),
  },
  {
    href: '/rh/simulacao',
    label: 'Simulação',
    match: (p: string) => p.startsWith('/rh/simulacao'),
  },
  { href: '/rh/ia', label: 'IA', match: (p: string) => p.startsWith('/rh/ia') },
  {
    href: '/rh/usuarios',
    label: 'Usuários',
    match: (p: string) => p.startsWith('/rh/usuarios'),
  },
] as const;

export function RhSubNav() {
  const pathname = usePathname() || '';
  const moreActive = MORE_ITEMS.some((item) => item.match(pathname));

  return (
    <ModuleTabs>
      {MAIN_TABS.map((t) => {
        const active = t.match(pathname);
        return (
          <Link key={t.href} href={t.href} className={moduleTabClass(active)}>
            {t.label}
          </Link>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger className={moduleTabClass(moreActive)}>
          Mais
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          {MORE_ITEMS.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(item.match(pathname) && 'bg-accent text-accent-foreground')}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ModuleTabs>
  );
}
