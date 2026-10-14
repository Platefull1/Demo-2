'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatFatorBr, parseFatorBr } from '@/lib/nfe/revisao-interpretacao';

type MapItem = {
  id: string;
  descricao: string | null;
  unidadeComercial: string;
  fatorConversao: number;
  produtoNome: string | null;
  fornecedor: { nome: string; cnpj: string };
};

export function MapeamentosBlock() {
  const [q, setQ] = useState('cobertura');
  const [itens, setItens] = useState<MapItem[]>([]);
  const [canEditar, setCanEditar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [draftFator, setDraftFator] = useState<Record<string, string>>({});

  const load = useCallback(async (query: string) => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/cmv-real/mapeamentos?q=${encodeURIComponent(query.trim())}`,
        { cache: 'no-store' },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      const list = (data.itens || []) as MapItem[];
      setItens(list);
      setCanEditar(data.canEditar === true);
      const next: Record<string, string> = {};
      for (const it of list) {
        next[it.id] = formatFatorBr(it.fatorConversao);
      }
      setDraftFator(next);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(q);
    // só na montagem com busca inicial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salvar = async (id: string) => {
    const fator = parseFatorBr(draftFator[id] || '');
    if (fator == null) {
      setMsg('Fator inválido');
      return;
    }
    setSaving(id);
    setMsg(null);
    try {
      const res = await fetch('/api/cmv-real/mapeamentos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, fatorConversao: fator }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setItens((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, fatorConversao: data.fatorConversao } : i,
        ),
      );
      setDraftFator((prev) => ({
        ...prev,
        [id]: formatFatorBr(data.fatorConversao),
      }));
      setMsg('Mapeamento atualizado');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-border bg-card p-4">
      <div>
        <p className="text-base font-semibold text-foreground">
          Mapeamentos de fornecedor
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Fator = kg (ou un) por unidade da nota. Ex.: caixa com 10 bisnagas de
          1,01 kg → fator <span className="tabular-nums text-foreground">10,1</span>
          .
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void load(q);
            }}
            placeholder="Buscar (ex.: cobertura, diehl)…"
            className="h-8 pl-8 text-sm"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          disabled={loading}
          onClick={() => void load(q)}
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            'Buscar'
          )}
        </Button>
      </div>

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}

      {loading && itens.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : itens.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Nenhum mapeamento encontrado
        </p>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8">Fornecedor / produto NF</TableHead>
                <TableHead className="h-8">Insumo</TableHead>
                <TableHead className="h-8 text-right w-36">
                  Fator (kg/un nota)
                </TableHead>
                <TableHead className="h-8 w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {itens.map((it) => {
                const dirty =
                  parseFatorBr(draftFator[it.id] || '') !== it.fatorConversao;
                return (
                  <TableRow key={it.id}>
                    <TableCell className="py-2 align-top">
                      <p className="text-xs text-muted-foreground">
                        {it.fornecedor.nome}
                      </p>
                      <p className="text-sm text-foreground">
                        {it.descricao || '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        und. nota: {it.unidadeComercial}
                      </p>
                    </TableCell>
                    <TableCell className="py-2 text-sm text-foreground">
                      {it.produtoNome || '—'}
                    </TableCell>
                    <TableCell className="py-2 text-right">
                      {canEditar ? (
                        <Input
                          value={draftFator[it.id] ?? ''}
                          onChange={(e) =>
                            setDraftFator((p) => ({
                              ...p,
                              [it.id]: e.target.value,
                            }))
                          }
                          className="h-8 text-sm tabular-nums text-right"
                        />
                      ) : (
                        <span className="text-sm tabular-nums text-foreground">
                          {formatFatorBr(it.fatorConversao)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      {canEditar && dirty ? (
                        <Button
                          type="button"
                          size="sm"
                          className="h-8"
                          disabled={saving === it.id}
                          onClick={() => void salvar(it.id)}
                        >
                          {saving === it.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Save className="size-3.5" />
                          )}
                          Salvar
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
