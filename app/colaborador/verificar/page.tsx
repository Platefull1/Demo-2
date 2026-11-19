'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { safeNext } from '@/lib/holerites/safe-next';
import {
  clearLoginFlow,
  readLoginFlow,
} from '@/components/colaborador/session-storage';

const RESEND_SECONDS = 60;

export default function ColaboradorVerificarPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState<string | null>(null);
  const [phoneHint, setPhoneHint] = useState<string | null>(null);
  const [nextPath, setNextPath] = useState('/colaborador/inicio');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const submittingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const flow = readLoginFlow();
    if (!flow.cpf) {
      router.replace('/colaborador/login');
      return;
    }
    setCpf(flow.cpf);
    setPhoneHint(flow.phoneHint);
    setNextPath(safeNext(flow.next));
    inputRef.current?.focus();
  }, [router]);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const t = setTimeout(() => setResendLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendLeft]);

  const verify = useCallback(
    async (digits: string) => {
      if (!cpf || submittingRef.current) return;
      if (!/^\d{6}$/.test(digits)) return;
      submittingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/colaborador/auth/verify-code', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ cpf, code: digits }),
        });
        if (!res.ok) {
          setError('Código inválido ou expirado');
          setCode('');
          return;
        }
        clearLoginFlow();
        router.replace(safeNext(nextPath));
        router.refresh();
      } catch {
        setError('Código inválido ou expirado');
        setCode('');
      } finally {
        setLoading(false);
        submittingRef.current = false;
      }
    },
    [cpf, nextPath, router],
  );

  useEffect(() => {
    if (code.length === 6) {
      void verify(code);
    }
  }, [code, verify]);

  async function handleResend() {
    if (!cpf || resendLeft > 0) return;
    setResending(true);
    setError(null);
    try {
      const res = await fetch('/api/colaborador/auth/request-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cpf }),
      });
      if (res.status === 429) {
        setError('Muitas tentativas. Tente de novo em alguns minutos.');
        return;
      }
      const body = (await res.json().catch(() => ({}))) as {
        phoneHint?: string | null;
      };
      if (body.phoneHint !== undefined) {
        setPhoneHint(body.phoneHint ?? null);
      }
      setResendLeft(RESEND_SECONDS);
    } catch {
      setError('Não foi possível reenviar. Tente de novo.');
    } finally {
      setResending(false);
    }
  }

  if (!cpf) {
    return (
      <main className="flex flex-1 items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </main>
    );
  }

  const hintText = phoneHint
    ? `Enviamos um código para o WhatsApp terminado em ${phoneHint}`
    : 'Se seu CPF estiver cadastrado, você receberá um código no WhatsApp';

  return (
    <main className="flex flex-1 flex-col justify-center gap-6 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Digite o código
        </h1>
        <p className="text-sm text-muted-foreground">{hintText}</p>
      </div>

      <div className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]*"
          value={code}
          disabled={loading}
          onChange={(ev) => {
            const v = ev.target.value.replace(/\D/g, '').slice(0, 6);
            setCode(v);
          }}
          className="flex h-14 w-full rounded-md border border-input bg-muted px-3 text-center text-2xl font-semibold tabular-nums tracking-[0.4em] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Código de 6 dígitos"
        />

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">Verificando…</p>
        )}

        <Button
          type="button"
          variant="outline"
          className="min-h-12 w-full text-base"
          disabled={resendLeft > 0 || resending}
          loading={resending}
          onClick={handleResend}
        >
          {resendLeft > 0
            ? `Reenviar código (${resendLeft}s)`
            : 'Reenviar código'}
        </Button>
      </div>
    </main>
  );
}
