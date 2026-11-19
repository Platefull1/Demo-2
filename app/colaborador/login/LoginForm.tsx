'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { safeNext } from '@/lib/holerites/safe-next';
import {
  digitsOnly,
  maskCpfInput,
  saveLoginFlow,
} from '@/components/colaborador/session-storage';

export function ColaboradorLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cpfMasked, setCpfMasked] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cpf = digitsOnly(cpfMasked);
    if (cpf.length !== 11) {
      setError('Digite um CPF válido.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/colaborador/auth/request-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cpf }),
      });

      if (res.status === 429) {
        const body = (await res.json().catch(() => ({}))) as {
          retryAfterSeconds?: number;
        };
        const mins = Math.max(
          1,
          Math.ceil((body.retryAfterSeconds ?? 60) / 60),
        );
        setError(`Muitas tentativas. Tente de novo em ${mins} minutos.`);
        return;
      }

      if (!res.ok) {
        setError('Não foi possível enviar o código. Tente de novo.');
        return;
      }

      const body = (await res.json()) as { phoneHint?: string | null };
      const next = safeNext(searchParams.get('next'));
      saveLoginFlow({
        cpf,
        phoneHint: body.phoneHint ?? null,
        next,
      });
      router.push('/colaborador/verificar');
    } catch {
      setError('Falha de conexão. Tente de novo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col justify-center gap-6 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Acesse seus holerites
        </h1>
        <p className="text-sm text-muted-foreground">
          Digite seu CPF para receber um código no WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="cpf" className="text-sm text-muted-foreground">
            CPF
          </label>
          <input
            ref={inputRef}
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="000.000.000-00"
            value={cpfMasked}
            onChange={(ev) => setCpfMasked(maskCpfInput(ev.target.value))}
            className="flex h-12 w-full rounded-md border border-input bg-muted px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          loading={loading}
          className="min-h-12 w-full text-base"
        >
          Receber código no WhatsApp
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Não recebeu? Confira se seu WhatsApp está atualizado com o RH da sua
        loja.
      </p>
    </main>
  );
}
