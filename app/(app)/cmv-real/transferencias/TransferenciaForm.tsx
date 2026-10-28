'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };

type ItemForm = {
  key: string;
  estoqueInsumoId: string;
  nome: string;
  unidade: string;
  quantidade: string;
  custoUnitario: string;
  custoOrigem: string | null;
};

/** Transferência já existente (para modo edição) */
export type TransferenciaParaEditar = {
  id: string;
  lojaOrigem: string;
  lojaDestino: string;
  data: string; // ISO
  observacao: string | null;
  lados: Array<{
    tipo: string;
    itens: Array<{
      estoqueInsumoId: string;
      quantidade: number;
      unidade: string;
      custoUnitario: number | null;
    }>;
  }>;
};

export type TransferenciaFormPrefill = {
  tipoLado: 'SAIDA' | 'ENTRADA';
  lojaOrigem: string;
  lojaDestino: string;
  data: string;
  numero: string;
  observacao?: string | null;
  itens?: Array<{
    estoqueInsumoId: string;
    nome: string;
    unidade: string;
    quantidade: number;
    custoUnitario: number | null;
  }>;
};

const hoje = () => new Date().toISOString().slice(0, 10);

function fmtMoney(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


export function TransferenciaForm({
  open,
  onOpenChange,
  produtos,
  lojasOpts,
  lojaPadrao,
  edicao,
  onSaved,
  prefill,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  produtos: Produto[];
  lojasOpts: string[];
  lojaPadrao: string;
  /** Se fornecido, abre em modo edição (PATCH ao invés de POST) */
  edicao?: TransferenciaParaEditar;
  onSaved: () => Promise<void>;
  prefill?: TransferenciaFormPrefill | null;
}) {
  const isEdicao = Boolean(edicao);

  // Inicializar a partir do documento existente (edição) ou valores padrão (criação)
  const [lojaOrigem, setLojaOrigem] = useState(
    edicao?.lojaOrigem ?? lojaPadrao,
  );
  const [lojaDestino, setLojaDestino] = useState(edicao?.lojaDestino ?? '');
  const [data, setData] = useState(
    edicao ? edicao.data.slice(0, 10) : hoje(),
  );
  const [observacao, setObservacao] = useState(edicao?.observacao ?? '');
  const [itens, setItens] = useState<ItemForm[]>(() => {
    if (!edicao) return [];
    const ladoSaida = edicao.lados.find((l) => l.tipo === 'SAIDA');
    return (ladoSaida?.itens ?? []).map((it, i) => {
      const prod = produtos.find((p) => p.estoqueInsumoId === it.estoqueInsumoId);
      return {
        key: `${it.estoqueInsumoId}-${i}`,
        estoqueInsumoId: it.estoqueInsumoId,
        nome: prod?.nome ?? it.estoqueInsumoId,
        unidade: it.unidade,
        quantidade: String(it.quantidade).replace('.', ','),
        custoUnitario:
          it.custoUnitario != null ? String(it.custoUnitario).replace('.', ',') : '',
        custoOrigem: null,
      };
    });
  });
  const [busca, setBusca] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Ao reabrir com novo documento para edição, reinicializa
  useEffect(() => {
    if (!open) return;
    setMsg(null);
    setBusca('');
    if (edicao) {
      setLojaOrigem(edicao.lojaOrigem);
      setLojaDestino(edicao.lojaDestino);
      setData(edicao.data.slice(0, 10));
      setObservacao(edicao.observacao ?? '');
      const ladoSaida = edicao.lados.find((l) => l.tipo === 'SAIDA');
      setItens(
        (ladoSaida?.itens ?? []).map((it, i) => {
          const prod = produtos.find((p) => p.estoqueInsumoId === it.estoqueInsumoId);
          return {
            key: `${it.estoqueInsumoId}-${i}`,
            estoqueInsumoId: it.estoqueInsumoId,
            nome: prod?.nome ?? it.estoqueInsumoId,
            unidade: it.unidade,
            quantidade: String(it.quantidade).replace('.', ','),
            custoUnitario:
              it.custoUnitario != null
                ? String(it.custoUnitario).replace('.', ',')
                : '',
            custoOrigem: null,
          };
        }),
      );
    } else if (prefill) {
      setLojaOrigem(prefill.lojaOrigem);
      setLojaDestino(prefill.lojaDestino);
      setData(prefill.data);
      setObservacao(prefill.observacao || '');
      setItens(
        (prefill.itens || []).map((it) => ({
          key: `${it.estoqueInsumoId}-${prefill.tipoLado}`,
          estoqueInsumoId: it.estoqueInsumoId,
          nome: it.nome,
          unidade: it.unidade,
          quantidade: it.quantidade ? String(it.quantidade).replace('.', ',') : '',
          custoUnitario:
            it.custoUnitario != null
              ? String(it.custoUnitario).replace('.', ',')
              : '',
          custoOrigem: null,
        })),
      );
    } else {
      setLojaOrigem(lojaPadrao);
      setLojaDestino('');
      setData(hoje());
      setObservacao('');
      setItens([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, edicao?.id, prefill]);

  const outras = lojasOpts.filter((s) => s !== lojaOrigem);

  const sugestoes = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (q.length < 1) return [];
    const ja = new Set(itens.map((i) => i.estoqueInsumoId));
    return produtos
      .filter((p) => !ja.has(p.estoqueInsumoId) && p.nome.toLowerCase().includes(q))
      .slice(0, 8);
  }, [busca, produtos, itens]);

  const addProduto = async (p: Produto) => {
    setBusca('');
    let custo = '';
    let origem: string | null = null;
    if (lojaOrigem && data) {
      const comp = data.slice(0, 7);
      const res = await fetch(
        `/api/cmv-real/transferencias?acao=custo&lojaOrigem=${lojaOrigem}&estoqueInsumoId=${p.estoqueInsumoId}&competencia=${comp}`,
      );
      const d = await res.json();
      if (res.ok && d.custo != null) {
        custo = String(d.custo).replace('.', ',');
        origem = d.origem;
      }
    }
    setItens((prev) => [
      ...prev,
      {
        key: `${p.estoqueInsumoId}-${Date.now()}`,
        estoqueInsumoId: p.estoqueInsumoId,
        nome: p.nome,
        unidade: p.unidade,
        quantidade: '',
        custoUnitario: custo,
        custoOrigem: origem,
      },
    ]);
  };

  const totalPreview = useMemo(() => {
    return itens.reduce((acc, it) => {
      const q = Number(it.quantidade.replace(',', '.'));
      const c = Number(it.custoUnitario.replace(',', '.'));
      if (q > 0 && c > 0) acc += q * c;
      return acc;
    }, 0);
  }, [itens]);

  const canSave =
    lojaOrigem &&
    lojaDestino &&
    lojaOrigem !== lojaDestino &&
    data &&
    itens.length > 0 &&
    !saving;

  const salvar = async () => {
    if (!canSave) return;
    setSaving(true);
    setMsg(null);
    try {
      if (!lojaDestino) throw new Error('Escolha a loja de destino');
      if (lojaOrigem === lojaDestino) throw new Error('Origem e destino não podem ser iguais');

      const payloadItens = itens.map((it) => ({
        estoqueInsumoId: it.estoqueInsumoId,
        quantidade: Number(it.quantidade.replace(',', '.')),
        custoUnitario: it.custoUnitario
          ? Number(it.custoUnitario.replace(',', '.'))
          : null,
      }));
      if (payloadItens.some((i) => !(i.quantidade > 0))) {
        throw new Error('Informe a quantidade de todos os itens');
      }

      let res: Response;
      if (isEdicao && edicao) {
        res = await fetch(`/api/cmv-real/transferencias/${edicao.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data,
            observacao: observacao || null,
            itens: payloadItens,
          }),
        });
      } else {
        res = await fetch('/api/cmv-real/transferencias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lojaOrigem,
            lojaDestino,
            data,
            observacao: observacao || undefined,
            itens: payloadItens,
          }),
        });
      }

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Falha ao salvar');
      onOpenChange(false);
      await onSaved();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!inset-0 !h-full !w-full !max-w-none overflow-y-auto bg-card border-border p-4 sm:!inset-y-0 sm:!right-0 sm:!left-auto sm:!h-full sm:!w-full sm:!max-w-md sm:p-6"
      >
        <SheetHeader className="text-left pr-8">
          <SheetTitle className="text-base font-semibold">
            {isEdicao ? 'Editar transferência' : 'Nova transferência'}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {isEdicao
              ? 'Altere data, itens ou observação. Loja de origem e destino não podem ser editadas.'
              : 'Registre a saída e entrada entre lojas de uma vez.'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Origem e Destino */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Loja de origem</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                value={lojaOrigem}
                disabled={isEdicao}
                onChange={(e) => {
                  setLojaOrigem(e.target.value);
                  if (e.target.value === lojaDestino) setLojaDestino('');
                  // Limpa custos ao trocar origem
                  setItens((prev) =>
                    prev.map((it) => ({ ...it, custoUnitario: '', custoOrigem: null })),
                  );
                }}
              >
                {lojasOpts.map((s) => (
                  <option key={s} value={s}>
                    {CMV_STORE_LABELS[s] || s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Loja de destino</Label>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:opacity-50"
                value={lojaDestino}
                disabled={isEdicao}
                onChange={(e) => setLojaDestino(e.target.value)}
              >
                <option value="">Escolher…</option>
                {outras.map((s) => (
                  <option key={s} value={s}>
                    {CMV_STORE_LABELS[s] || s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {lojaOrigem && lojaDestino && lojaOrigem === lojaDestino && (
            <p className="text-xs text-destructive">Origem e destino não podem ser iguais</p>
          )}

          {/* Data */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Data da transferência</Label>
            <Input
              type="date"
              value={data}
              max={hoje()}
              onChange={(e) => setData(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Produtos */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Adicionar produto</Label>
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar no catálogo…"
              className="h-10"
              autoComplete="off"
            />
            {sugestoes.length > 0 && (
              <ul className="rounded-md border border-border bg-popover divide-y divide-border">
                {sugestoes.map((p) => (
                  <li key={p.estoqueInsumoId}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted"
                      onClick={() => void addProduto(p)}
                    >
                      <span className="text-foreground">{p.nome}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{p.unidade}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Itens */}
          <div className="space-y-3">
            {itens.map((it) => (
              <div key={it.key} className="rounded-md border border-border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{it.nome}</p>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive p-1"
                    onClick={() => setItens((prev) => prev.filter((x) => x.key !== it.key))}
                    aria-label="Remover item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Qtd ({it.unidade})</p>
                    <Input
                      inputMode="decimal"
                      value={it.quantidade}
                      onChange={(e) =>
                        setItens((prev) =>
                          prev.map((x) =>
                            x.key === it.key ? { ...x, quantidade: e.target.value } : x,
                          ),
                        )
                      }
                      className="h-9 tabular-nums"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Custo / {it.unidade}
                    </p>
                    <Input
                      inputMode="decimal"
                      value={it.custoUnitario}
                      onChange={(e) =>
                        setItens((prev) =>
                          prev.map((x) =>
                            x.key === it.key
                              ? { ...x, custoUnitario: e.target.value, custoOrigem: 'CUSTO_MANUAL' }
                              : x,
                          ),
                        )
                      }
                      className="h-9 tabular-nums"
                    />
                  </div>
                </div>
                {it.custoOrigem && it.custoOrigem !== 'CUSTO_MANUAL' ? (
                  <p className="text-xs text-muted-foreground">
                    Custo sugerido da origem
                  </p>
                ) : it.custoOrigem === 'CUSTO_MANUAL' ? (
                  <p className="text-xs text-muted-foreground">Custo manual</p>
                ) : (
                  <p className="text-xs text-warning">Preencha o custo — sem histórico</p>
                )}
              </div>
            ))}
            {itens.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum item. Busque um produto para adicionar.
              </p>
            )}
          </div>

          {/* Preview do total */}
          {totalPreview > 0 && (
            <div className="rounded-md bg-muted px-4 py-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total estimado</p>
              <p className="text-base font-semibold tabular-nums text-foreground">
                {fmtMoney(totalPreview)}
              </p>
            </div>
          )}

          {/* Observação */}
          <Input
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Observação (opcional)"
            className="h-10"
          />

          {msg && (
            <p className="text-sm text-destructive" role="alert">
              {msg}
            </p>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full h-11"
            disabled={!canSave}
            onClick={() => void salvar()}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {isEdicao ? 'Salvar alterações' : 'Registrar transferência'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
