'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { linhasEspelho } from '@/lib/nfe/transferencia-concilicao';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';
import {
  TransferenciaForm,
  type TransferenciaFormPrefill,
} from '../TransferenciaForm';

type Item = {
  id: string;
  estoqueInsumoId: string;
  nome: string;
  quantidade: number;
  unidade: string;
  custoUnitario: number | null;
  valorTotal: number | null;
  custoOrigem: string | null;
};

type Lado = {
  tipo: string;
  storeSlug: string;
  rascunho: boolean;
  registradoEm: string | null;
  itens: Item[];
};

type Doc = {
  id: string;
  numeroDocumento: string;
  data: string;
  competencia: string;
  lojaOrigem: string;
  lojaDestino: string;
  status: string;
  origem: string;
  observacao: string | null;
  lados: Lado[];
};

type Produto = { estoqueInsumoId: string; nome: string; unidade: string };

const STATUS_LABEL: Record<string, string> = {
  AGUARDANDO_ENTRADA: 'Aguardando entrada',
  AGUARDANDO_SAIDA: 'Aguardando saída',
  CONCILIADA: 'Conciliada',
  DIVERGENTE: 'Divergente',
};

const CUSTO_LABEL: Record<string, string> = {
  ULTIMO_CUSTO_ORIGEM: 'Último custo da origem',
  ESTOQUE_INICIAL_ORIGEM: 'Estoque inicial da origem',
  ULTIMO_CUSTO_QUALQUER_LOJA: 'Último custo de outra loja',
  CUSTO_MANUAL: 'Custo manual',
};

function brl(n: number | null) {
  if (n == null) return '—';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function qtd(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}

export default function TransferenciaDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lojasOpts, setLojasOpts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [competenciaFechada, setCompetenciaFechada] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [resD, resP] = await Promise.all([
        fetch(`/api/cmv-real/transferencias/${id}`, { cache: 'no-store' }),
        fetch('/api/cmv-real/produtos', { cache: 'no-store' }),
      ]);
      const dd = await resD.json();
      if (!resD.ok) throw new Error(dd.error || 'Não encontrada');
      setDoc(dd.transferencia);
      setCompetenciaFechada(dd.competenciaFechada === true);
      setLojasOpts(Object.keys(CMV_STORE_LABELS));
      if (resP.ok) {
        const dp = await resP.json();
        setProdutos(
          (dp.itens || [])
            .filter((p: { ativo: boolean }) => p.ativo !== false)
            .map((p: Produto) => ({
              estoqueInsumoId: p.estoqueInsumoId,
              nome: p.nome,
              unidade: p.unidade,
            })),
        );
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const saida = doc?.lados.find((l) => l.tipo === 'SAIDA');
  const entrada = doc?.lados.find((l) => l.tipo === 'ENTRADA');
  const nomes = useMemo(() => {
    const m = new Map<string, { nome: string; unidade: string }>();
    for (const l of doc?.lados ?? []) {
      for (const it of l.itens) {
        m.set(it.estoqueInsumoId, { nome: it.nome, unidade: it.unidade });
      }
    }
    return m;
  }, [doc]);

  const linhas = useMemo(() => {
    if (!doc) return [];
    return linhasEspelho(
      (saida?.itens ?? []).map((i) => ({
        estoqueInsumoId: i.estoqueInsumoId,
        quantidade: i.quantidade,
        custoUnitario: i.custoUnitario,
        valorTotal: i.valorTotal,
      })),
      (entrada?.itens ?? []).map((i) => ({
        estoqueInsumoId: i.estoqueInsumoId,
        quantidade: i.quantidade,
        custoUnitario: i.custoUnitario,
        valorTotal: i.valorTotal,
      })),
    );
  }, [doc, saida, entrada]);

  const ladoFaltando: 'SAIDA' | 'ENTRADA' | null = !doc
    ? null
    : !saida || saida.rascunho
      ? 'SAIDA'
      : !entrada || entrada.rascunho
        ? 'ENTRADA'
        : null;

  const prefill: TransferenciaFormPrefill | null =
    doc && ladoFaltando
      ? {
          tipoLado: ladoFaltando,
          lojaOrigem: doc.lojaOrigem,
          lojaDestino: doc.lojaDestino,
          data: doc.data.slice(0, 10),
          numero: doc.numeroDocumento,
          observacao: doc.observacao,
          itens: (ladoFaltando === 'ENTRADA' ? saida?.itens : entrada?.itens)?.map(
            (it) => ({
              estoqueInsumoId: it.estoqueInsumoId,
              nome: it.nome,
              unidade: it.unidade,
              quantidade: it.quantidade,
              custoUnitario: it.custoUnitario,
            }),
          ),
        }
      : null;

  const excluir = async () => {
    if (!doc) return;
    if (!window.confirm(`Excluir o documento ${doc.numeroDocumento}?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cmv-real/transferencias/${doc.id}`, {
        method: 'DELETE',
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Falha ao excluir');
      router.push('/cmv-real/transferencias');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="space-y-4">
        <Link
          href="/cmv-real/transferencias"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Transferências
        </Link>
        <p className="text-sm text-muted-foreground">{msg || 'Não encontrada'}</p>
      </div>
    );
  }

  const totalSaida = (saida?.itens ?? []).reduce((s, i) => s + (i.valorTotal ?? 0), 0);
  const totalEntrada = (entrada?.itens ?? []).reduce(
    (s, i) => s + (i.valorTotal ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 min-w-0">
          <Link
            href="/cmv-real/transferencias"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowLeft className="size-4" />
            Transferências
          </Link>
          <h2 className="text-base font-semibold text-foreground">
            Documento {doc.numeroDocumento}
          </h2>
          <p className="text-sm text-muted-foreground">
            {new Date(doc.data).toLocaleDateString('pt-BR')}
            {' · '}
            {CMV_STORE_LABELS[doc.lojaOrigem] || doc.lojaOrigem}
            {' → '}
            {CMV_STORE_LABELS[doc.lojaDestino] || doc.lojaDestino}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {STATUS_LABEL[doc.status] || doc.status}
          </Badge>
          {ladoFaltando ? (
            <Button
              type="button"
              size="sm"
              disabled={competenciaFechada}
              onClick={() => setFormOpen(true)}
            >
              {ladoFaltando === 'ENTRADA' ? 'Registrar entrada' : 'Registrar saída'}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={deleting || competenciaFechada}
            onClick={() => void excluir()}
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : 'Excluir'}
          </Button>
        </div>
      </div>

      {competenciaFechada ? (
        <p className="text-sm text-muted-foreground">
          Competência fechada — reabra o mês para registrar o outro lado ou excluir.
        </p>
      ) : null}

      {msg ? (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      ) : null}

      {doc.status === 'DIVERGENTE' ? (
        <Alert variant="warning">
          <AlertDescription className="text-sm">
            Quantidades diferentes entre saída e entrada. Confira o lado a lado.
          </AlertDescription>
        </Alert>
      ) : null}

      {doc.observacao ? (
        <p className="text-sm text-muted-foreground">{doc.observacao}</p>
      ) : null}

      <Card className="overflow-hidden">
        <div className="grid grid-cols-2 border-b border-border">
          <div className="p-4 border-r border-border">
            <p className="text-base font-semibold text-foreground">Saída</p>
            <p className="text-xs text-muted-foreground mt-1">
              {CMV_STORE_LABELS[doc.lojaOrigem] || doc.lojaOrigem}
              {saida?.rascunho ? ' · rascunho' : ''}
              {!saida ? ' · sem registro' : ''}
            </p>
          </div>
          <div className="p-4">
            <p className="text-base font-semibold text-foreground">Entrada</p>
            <p className="text-xs text-muted-foreground mt-1">
              {CMV_STORE_LABELS[doc.lojaDestino] || doc.lojaDestino}
              {entrada?.rascunho ? ' · rascunho' : ''}
              {!entrada ? ' · sem registro' : ''}
            </p>
          </div>
        </div>

        {linhas.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">Nenhum item neste documento</p>
        ) : (
          <ul>
            {linhas.map((ln) => {
              const meta = nomes.get(ln.estoqueInsumoId);
              return (
                <li
                  key={ln.estoqueInsumoId}
                  className="grid grid-cols-2 border-b border-border last:border-b-0"
                >
                  <div
                    className={`p-4 border-r border-border ${ln.divergente ? 'bg-warning/10' : ''}`}
                  >
                    <p className="text-sm font-medium text-foreground">
                      {meta?.nome || ln.estoqueInsumoId}
                    </p>
                    <p className="text-sm tabular-nums text-foreground mt-1">
                      {ln.qtdSaida > 0
                        ? `${qtd(ln.qtdSaida)} ${meta?.unidade || ''}`
                        : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ln.qtdSaida > 0 ? brl(ln.valorSaida) : ''}
                    </p>
                  </div>
                  <div className={`p-4 ${ln.divergente ? 'bg-warning/10' : ''}`}>
                    <p className="text-sm font-medium text-foreground">
                      {meta?.nome || ln.estoqueInsumoId}
                    </p>
                    <p className="text-sm tabular-nums text-foreground mt-1">
                      {ln.qtdEntrada > 0
                        ? `${qtd(ln.qtdEntrada)} ${meta?.unidade || ''}`
                        : '—'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ln.qtdEntrada > 0 ? brl(ln.valorEntrada) : ''}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="grid grid-cols-2 border-t border-border">
          <p className="p-4 text-sm tabular-nums text-foreground border-r border-border">
            {brl(totalSaida)}
          </p>
          <p className="p-4 text-sm tabular-nums text-foreground">{brl(totalEntrada)}</p>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <LadoDetalhe titulo="Origem do custo — saída" itens={saida?.itens ?? []} />
        <LadoDetalhe titulo="Origem do custo — entrada" itens={entrada?.itens ?? []} />
      </div>

      <TransferenciaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        produtos={produtos}
        lojasOpts={lojasOpts.length ? lojasOpts : Object.keys(CMV_STORE_LABELS)}
        lojaPadrao={doc.lojaOrigem}
        prefill={prefill}
        onSaved={load}
      />
    </div>
  );
}

function LadoDetalhe({ titulo, itens }: { titulo: string; itens: Item[] }) {
  if (itens.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className="text-base font-semibold text-foreground">{titulo}</p>
      <ul className="space-y-2">
        {itens.map((it) => (
          <li key={it.id} className="text-sm">
            <span className="text-foreground">{it.nome}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {it.custoOrigem ? CUSTO_LABEL[it.custoOrigem] || it.custoOrigem : '—'}
              {it.custoUnitario != null ? ` · ${brl(it.custoUnitario)}/${it.unidade}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
