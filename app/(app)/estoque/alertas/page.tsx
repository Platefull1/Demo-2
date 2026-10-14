'use client';

import { useRouter } from 'next/navigation';
import { useStockSession } from '../../../estoque/hooks/useStockSession';
import { Alertas } from '../../../estoque/pages/Alertas';

export default function EstoqueAlertasPage() {
  const router = useRouter();
  const { sessions, hydrated } = useStockSession();

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  return (
    <Alertas sessions={sessions} onVoltar={() => router.push('/estoque')} />
  );
}
