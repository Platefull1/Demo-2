'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ItemLinha = {
  estoqueInsumoId: string;
  nome: string;
  unidade: string;
  qtdEnviada: number;
  qtdRecebida: number;
};

type Escolha = 'ENVIADA' | 'RECEBIDA' | 'OUTRA';

function qtdLabel(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}

function parseQtd(raw: string): number | null {
  const t = raw.trim().replace(/\./g, '').replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function ResolverDivergenciaForm({
  transferenciaId,
  itens,
  disabled,
  onResolved,
}: {
  transferenciaId: string;
  itens: ItemLinha[];
  disabled?: boolean;
  onResolved: () => void;
}) {
  const [escolhas, setEscolhas] = useState<Record<string, Escolha>>({});
  const [outras, setOutras] = useState<Record<string, string>>({});
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const init: Record<string, Escolha> = {};
    for (const it of itens) {
      init[it.estoqueInsumoId] =
        Math.abs(it.qtdEnviada - it.qtdRecebida) < 0.0001 ? 'ENVIADA' : 'ENVIADA';
    }
    setEscolhas(init);
    setOutras({});
    setMotivo('');
    setMsg(null);
  }, [itens, transferenciaId]);

  const prontos = useMemo(() => {
    if (!motivo.trim()) return false;
    for (const it of itens) {
      const e = escolhas[it.estoqueInsumoId];
      if (!e) return false;
      if (e === 'OUTRA') {
        const n = parseQtd(outras[it.estoqueInsumoId] || '');
        if (n == null || !(n > 0)) return false;
      }
    }
    return true;
  }, [escolhas, outras, motivo, itens]);

  const salvar = async () => {
    if (!prontos || disabled) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/cmv-real/transferencias/${transferenciaId}/resolver-divergencia`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            motivo: motivo.trim(),
            itens: itens.map((it) => {
              const escolha = escolhas[it.estoqueInsumoId];
              return {
                estoqueInsumoId: it.estoqueInsumoId,
                escolha,
                quantidade:
                  escolha === 'OUTRA'
                    ? parseQtd(outras[it.estoqueInsumoId] || '')
                    : null,
              };
            }),
          }),
        },
      );
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Falha ao resolver');
      onResolved();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  };

  if (itens.length === 0) return null;

  return (
    <Card className="p-4 space-y-4">
      <div>
        <p className="text-base font-semibold text-foreground">Resolver divergência</p>
        <p className="text-xs text-muted-foreground mt-1">
          Escolha a quantidade válida por item. Os dois lados serão confirmados e
          entrarão no CMV.
        </p>
      </div>

      <ul className="space-y-4">
        {itens.map((it) => {
          const escolha = escolhas[it.estoqueInsumoId] || 'ENVIADA';
          return (
            <li key={it.estoqueInsumoId} className="space-y-2">
              <p className="text-sm font-medium text-foreground">{it.nome}</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="space-y-1 min-w-0 sm:w-64">
                  <Label className="text-xs text-muted-foreground">Quantidade válida</Label>
                  <Select
                    value={escolha}
                    disabled={disabled || saving}
                    onValueChange={(v) =>
                      setEscolhas((prev) => ({
                        ...prev,
                        [it.estoqueInsumoId]: v as Escolha,
                      }))
                    }
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENVIADA">
                        Enviada ({qtdLabel(it.qtdEnviada)} {it.unidade})
                      </SelectItem>
                      <SelectItem value="RECEBIDA">
                        Recebida ({qtdLabel(it.qtdRecebida)} {it.unidade})
                      </SelectItem>
                      <SelectItem value="OUTRA">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {escolha === 'OUTRA' ? (
                  <div className="space-y-1 sm:w-40">
                    <Label className="text-xs text-muted-foreground">Quantidade</Label>
                    <Input
                      className="h-8 text-sm tabular-nums"
                      inputMode="decimal"
                      disabled={disabled || saving}
                      value={outras[it.estoqueInsumoId] || ''}
                      onChange={(e) =>
                        setOutras((prev) => ({
                          ...prev,
                          [it.estoqueInsumoId]: e.target.value,
                        }))
                      }
                      placeholder="0"
                    />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Motivo (obrigatório)</Label>
        <Textarea
          className="text-sm min-h-[72px]"
          disabled={disabled || saving}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex.: conferência com a gerente da origem; pesagem no destino"
        />
      </div>

      {msg ? (
        <p className="text-sm text-destructive" role="alert">
          {msg}
        </p>
      ) : null}

      <Button
        type="button"
        size="sm"
        disabled={!prontos || disabled}
        loading={saving}
        onClick={() => void salvar()}
      >
        Resolver e lançar no CMV
      </Button>
    </Card>
  );
}
