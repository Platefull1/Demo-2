'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CMV_STORE_LABELS, formatQuantidadeBr } from '@/lib/nfe/ui-labels';

type Orfao = {
  estoqueInsumoId: string;
  nome: string;
  unidade: 'KG' | 'UN';
  secaoSugerida: 'MATERIA_PRIMA' | 'EMBALAGEM' | 'BEBIDA';
  lojas: string[];
  qtdSaldoPorLoja: Record<string, number>;
  comprasValorPorLoja?: Record<string, number>;
  comprasValor: number;
};

const SECAO_LABEL: Record<Orfao['secaoSugerida'], string> = {
  MATERIA_PRIMA: 'Matéria-prima',
  EMBALAGEM: 'Embalagem',
  BEBIDA: 'Bebida',
};

function money(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Produtos com saldo/compras sem CmvRealInsumoConfig ativo.
 * Aberto via ?orfaos=1 (link do fechamento).
 */
export function OrfaosCatalogoBlock({
  canConfig,
  onIncluidos,
}: {
  canConfig: boolean;
  onIncluidos?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const open = searchParams.get('orfaos') === '1';

  const [orfaos, setOrfaos] = useState<Orfao[]>([]);
  const [secoes, setSecoes] = useState<
    Record<string, Orfao['secaoSugerida']>
  >({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/produtos?fonte=orfaos', {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      const list = (data.orfaos || []) as Orfao[];
      setOrfaos(list);
      const init: Record<string, Orfao['secaoSugerida']> = {};
      for (const o of list) init[o.estoqueInsumoId] = o.secaoSugerida;
      setSecoes(init);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const porSecao = useMemo(() => {
    const groups: Record<Orfao['secaoSugerida'], Orfao[]> = {
      EMBALAGEM: [],
      BEBIDA: [],
      MATERIA_PRIMA: [],
    };
    for (const o of orfaos) {
      const s = secoes[o.estoqueInsumoId] ?? o.secaoSugerida;
      groups[s].push(o);
    }
    return groups;
  }, [orfaos, secoes]);

  const incluirTodos = useCallback(async () => {
    if (!orfaos.length) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'incluir_orfaos',
          itens: orfaos.map((o) => ({
            estoqueInsumoId: o.estoqueInsumoId,
            secao: secoes[o.estoqueInsumoId] ?? o.secaoSugerida,
            unidade: o.unidade,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setMsg(`${data.incluidos} produto(s) incluído(s) no catálogo.`);
      await load();
      onIncluidos?.();
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  }, [orfaos, secoes, load, onIncluidos, router]);

  if (!open) return null;

  return (
    <Alert variant="warning" className="py-3 px-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <AlertTitle className="text-sm text-warning">
            Fora do catálogo CMV Real
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground mt-1">
            Produtos com saldo (mês anterior) ou compras sem config ativo —
            não entram no fechamento até serem incluídos.
          </AlertDescription>
        </div>
        <div className="flex gap-2">
          {canConfig && orfaos.length > 0 && (
            <Button
              type="button"
              size="sm"
              disabled={saving || loading}
              onClick={() => void incluirTodos()}
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              Incluir todos
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => router.replace('/cmv-real/produtos')}
          >
            Fechar
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="size-3.5 animate-spin" /> Carregando…
        </p>
      ) : orfaos.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nenhum produto órfão no momento.
        </p>
      ) : (
        <div className="space-y-4">
          {(
            ['EMBALAGEM', 'BEBIDA', 'MATERIA_PRIMA'] as const
          ).map((sec) => {
            const list = porSecao[sec];
            if (!list.length) return null;
            return (
              <div key={sec} className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {SECAO_LABEL[sec]} ({list.length})
                </p>
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-muted-foreground text-left bg-muted/50">
                        <th className="py-2 px-2">Produto</th>
                        <th className="py-2 px-2">Lojas</th>
                        <th className="py-2 px-2 text-right">Saldo</th>
                        <th className="py-2 px-2 text-right">Compras</th>
                        <th className="py-2 px-2">Seção</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((o) => (
                        <tr
                          key={o.estoqueInsumoId}
                          className="border-t border-border"
                        >
                          <td className="py-1.5 px-2 text-foreground">
                            {o.nome}
                          </td>
                          <td className="py-1.5 px-2 text-muted-foreground">
                            {o.lojas
                              .map((s) => CMV_STORE_LABELS[s] || s)
                              .join(', ')}
                          </td>
                          <td className="py-1.5 px-2 text-right tabular-nums text-foreground">
                            {Object.entries(o.qtdSaldoPorLoja)
                              .map(
                                ([loja, q]) =>
                                  `${CMV_STORE_LABELS[loja] || loja}=${formatQuantidadeBr(q)}`,
                              )
                              .join(' · ') || '–'}
                          </td>
                          <td className="py-1.5 px-2 text-right tabular-nums text-foreground">
                            {money(o.comprasValor)}
                          </td>
                          <td className="py-1.5 px-2">
                            {canConfig ? (
                              <Select
                                value={
                                  secoes[o.estoqueInsumoId] ?? o.secaoSugerida
                                }
                                onValueChange={(v) =>
                                  setSecoes((prev) => ({
                                    ...prev,
                                    [o.estoqueInsumoId]:
                                      v as Orfao['secaoSugerida'],
                                  }))
                                }
                              >
                                <SelectTrigger className="h-7 w-[140px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(
                                    [
                                      'MATERIA_PRIMA',
                                      'EMBALAGEM',
                                      'BEBIDA',
                                    ] as const
                                  ).map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {SECAO_LABEL[s]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              SECAO_LABEL[
                                secoes[o.estoqueInsumoId] ?? o.secaoSugerida
                              ]
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}
    </Alert>
  );
}
