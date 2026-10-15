'use client';

import { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';

export type AnimatedNumberFormat = 'currency' | 'integer' | 'percent';

function formatOptions(format: AnimatedNumberFormat) {
  switch (format) {
    case 'currency':
      return {
        style: 'currency' as const,
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
    case 'percent':
      return {
        style: 'percent' as const,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      };
    default:
      return {
        maximumFractionDigits: 0,
      };
  }
}

const TIMING: EffectTiming = {
  duration: 700,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

type AnimatedNumberProps = {
  value: number;
  format?: AnimatedNumberFormat;
  className?: string;
};

/**
 * Número animado para KPIs de destaque.
 * - Primeira renderização: valor direto (sem rolar de zero).
 * - Mudanças seguintes: dígitos sobem/descem (~700ms).
 * - Respeita prefers-reduced-motion (NumberFlow).
 */
export function AnimatedNumber({
  value,
  format = 'integer',
  className,
}: AnimatedNumberProps) {
  const [canAnimate, setCanAnimate] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setCanAnimate(true);
  }, [value]);

  return (
    <NumberFlow
      value={value}
      locales="pt-BR"
      format={formatOptions(format)}
      animated={canAnimate}
      respectMotionPreference
      transformTiming={TIMING}
      spinTiming={TIMING}
      opacityTiming={{ duration: 350, easing: 'ease-out' }}
      className={cn('tabular-nums', className)}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    />
  );
}

/**
 * Mantém o último valor válido na camada de exibição enquanto
 * `isLoading` — útil ao trocar loja/período sem zerar os KPIs.
 */
export function useStickyNumber(
  value: number | null | undefined,
  isLoading: boolean,
): { display: number | null; isStale: boolean } {
  const last = useRef<number | null>(null);
  if (value != null && Number.isFinite(value)) {
    last.current = value;
  }
  const hasLast = last.current != null;
  const display = value != null && Number.isFinite(value) ? value : last.current;
  const isStale = Boolean(isLoading && hasLast && (value == null || !Number.isFinite(value)));
  return { display, isStale };
}
