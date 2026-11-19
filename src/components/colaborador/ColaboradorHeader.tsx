'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ColaboradorHeader({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSair() {
    setLoading(true);
    try {
      await fetch('/api/colaborador/auth', { method: 'DELETE' });
    } catch {
      /* ignore */
    }
    router.replace('/colaborador/login');
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between gap-3 py-4">
      <p className="text-base font-semibold tracking-tight text-foreground">
        Calenzano
      </p>
      {loggedIn ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          loading={loading}
          onClick={handleSair}
          className="text-muted-foreground"
        >
          Sair
        </Button>
      ) : (
        <span className="h-8 w-8" aria-hidden />
      )}
    </header>
  );
}
