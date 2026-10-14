'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ModuleTabsProps = {
  children: ReactNode;
  className?: string;
  /** Sem borda inferior (quando o pai já tem border-b). */
  borderless?: boolean;
};

/**
 * Faixa de abas de módulo (CMV Real, RH, Pontos).
 * Esconde a scrollbar e impede setas verticais do overflow no Windows.
 */
export function ModuleTabs({ children, className, borderless }: ModuleTabsProps) {
  return (
    <nav
      className={cn(
        'flex items-center gap-1 overflow-x-auto overflow-y-hidden -mx-1 px-1 scrollbar-none',
        !borderless && 'border-b border-border',
        className
      )}
    >
      {children}
    </nav>
  );
}

export const moduleTabClass = (active: boolean) =>
  cn(
    'shrink-0 inline-flex items-center gap-1 text-sm font-medium px-3 py-2 -mb-px border-b-2 transition-colors',
    'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
    active
      ? 'border-primary text-foreground'
      : 'border-transparent text-muted-foreground hover:text-foreground'
  );
