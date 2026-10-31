'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { saoPauloYmd } from '@/lib/ocorrencias-period';

type Item = {
  lojaId: string;
  lojaNome: string;
  quantidade: number | null;
  informado: boolean;
};

export function AtrasosMensaisDialog({
  open,
  onOpenChange,
  anoInicial,
  mesInicial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anoInicial?: number;
  mesInicial?: number;
  onSaved?: () => void;
}) {
  const hoje = saoPauloYmd();
  const [ano, setAno] = useState(anoInicial ?? hoje.year);
  const [mes, setMes] = useState(mesInicial ?? hoje.month);
  const [itens, setItens] = useState<Item[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const a = anoInicial ?? hoje.year;
    const m = mesInicial ?? hoje.month;
    setAno(a);
    setMes(m);
  }, [open, anoInicial, mesInicial, hoje.year, hoje.month]);

  useEffect(() => {
    if (!open) return;
    setCarregando(true);
    setErro(null);
    fetch(`/api/ocorrencias/atrasos?ano=${ano}&mes=${mes}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || 'Erro ao carregar');
        setItens(json.itens ?? []);
      })
      .catch((e: Error) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [open, ano, mes]);

  async function salvar() {
    setSalvando(true);
    setErro(null);
    try {
      const res = await fetch('/api/ocorrencias/atrasos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ano,
          mes,
          itens: itens.map((i) => ({
            lojaId: i.lojaId,
            quantidade: Math.min(9999, Math.max(0, Math.floor(Number(i.quantidade ?? 0)))),
          })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Não foi possível salvar');
      onSaved?.();
      onOpenChange(false);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Pedidos atrasados
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <select
            aria-label="Mês"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </select>
          <select
            aria-label="Ano"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm"
          >
            {Array.from({ length: 6 }, (_, i) => hoje.year - 2 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {carregando ? (
          <p className="text-sm text-muted-foreground">Carregando…</p>
        ) : (
          <div className="space-y-3">
            {itens.map((item) => (
              <div key={item.lojaId} className="flex items-center justify-between gap-4">
                <label className="text-sm text-foreground" htmlFor={`atraso-${item.lojaId}`}>
                  {item.lojaNome}
                </label>
                <Input
                  id={`atraso-${item.lojaId}`}
                  type="number"
                  min={0}
                  max={9999}
                  className="w-24 h-8 text-right tabular-nums"
                  value={item.quantidade ?? 0}
                  onChange={(e) => {
                    const n = e.target.value === '' ? 0 : Number(e.target.value);
                    setItens((prev) =>
                      prev.map((p) =>
                        p.lojaId === item.lojaId ? { ...p, quantidade: n } : p,
                      ),
                    );
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {erro && (
          <p className="text-sm text-destructive" role="alert">
            {erro}
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={salvando || carregando} onClick={() => void salvar()}>
            {salvando ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
