'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type Linha = { storeSlug: string; cnpj: string };

function maskCnpj(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function LojasCnpjBlock() {
  const [lojas, setLojas] = useState<Linha[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cmv-real/lojas', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setLojas(data.lojas || []);
      setCanEdit(data.canEdit === true);
      setDraft(
        Object.fromEntries(
          (data.lojas || []).map((l: Linha) => [l.storeSlug, maskCnpj(l.cnpj)]),
        ),
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const salvar = async (storeSlug: string) => {
    setSaving(storeSlug);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/lojas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeSlug, cnpj: draft[storeSlug] || '' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setLojas(data.lojas || []);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-card p-4">
      <div>
        <p className="text-base font-semibold text-foreground">CNPJ das lojas</p>
        <p className="text-sm text-muted-foreground mt-1">
          Usado para reconhecer NF de transferência. Deixe vazio até preencher o
          CNPJ real — o escritório edita aqui ou em RH → Lojas.
        </p>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : (
        <div className="space-y-3">
          {lojas.map((l) => (
            <div
              key={l.storeSlug}
              className="flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <p className="text-sm text-foreground sm:w-36 shrink-0">
                {CMV_STORE_LABELS[l.storeSlug] || l.storeSlug}
              </p>
              <Input
                value={draft[l.storeSlug] ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    [l.storeSlug]: maskCnpj(e.target.value),
                  }))
                }
                placeholder="00.000.000/0000-00"
                disabled={!canEdit}
                className="h-9 tabular-nums sm:max-w-xs"
                inputMode="numeric"
              />
              {canEdit ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={saving === l.storeSlug}
                  onClick={() => void salvar(l.storeSlug)}
                >
                  {saving === l.storeSlug ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Salvar
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}
      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
