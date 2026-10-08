/**
 * Transferências entre lojas: SAÍDA e ENTRADA são registros independentes.
 * Conciliação por (origem, destino, produto) em janela de 7 dias.
 */

import { prisma } from '@/lib/prisma';
import { storeLabel } from './lojas';

const JANELA_MS = 7 * 24 * 60 * 60 * 1000;
const QTD_TOL = 0.05; // 5% ou absoluto pequeno

export type AlertaTransferencia =
  | {
      tipo: 'SAIDA_SEM_ENTRADA';
      mensagem: string;
      saidaId: string;
      lojaDestino: string;
      estoqueInsumoId: string;
    }
  | {
      tipo: 'ENTRADA_SEM_SAIDA';
      mensagem: string;
      entradaId: string;
      lojaOrigem: string;
      estoqueInsumoId: string;
    }
  | {
      tipo: 'QTD_DIVERGENTE';
      mensagem: string;
      saidaId: string;
      entradaId: string;
      enviou: number;
      recebeu: number;
    };

function num(d: { toNumber?: () => number } | number | null | undefined): number {
  if (d == null) return 0;
  if (typeof d === 'number') return d;
  return Number(d);
}

function key(origem: string, destino: string, produto: string): string {
  return `${origem}|${destino}|${produto}`;
}

/**
 * Concilia transferências da competência (todas as lojas do tenant),
 * filtrando alertas relevantes para storeSlug (loja do fechamento).
 */
export async function conciliarTransferencias(params: {
  tenantUserId: string;
  competencia: string;
  storeSlug: string;
}): Promise<AlertaTransferencia[]> {
  const lancs = await prisma.cmvLancamento.findMany({
    where: {
      userId: params.tenantUserId,
      competencia: params.competencia,
      tipo: { in: ['TRANSFERENCIA_SAIDA', 'TRANSFERENCIA_ENTRADA'] },
    },
    orderBy: { data: 'asc' },
  });

  const saidas = lancs.filter((l) => l.tipo === 'TRANSFERENCIA_SAIDA');
  const entradas = lancs.filter((l) => l.tipo === 'TRANSFERENCIA_ENTRADA');

  type Match = { saidaId: string; entradaId: string; enviou: number; recebeu: number };
  const matchedSaida = new Set<string>();
  const matchedEntrada = new Set<string>();
  const matches: Match[] = [];

  for (const s of saidas) {
    const destino = s.lojaDestino;
    if (!destino) continue;
    const origem = s.storeSlug;
    const candidatos = entradas.filter((e) => {
      if (matchedEntrada.has(e.id)) return false;
      if (e.estoqueInsumoId !== s.estoqueInsumoId) return false;
      if (e.storeSlug !== destino) return false;
      const origE = e.lojaOrigem || '';
      if (origE && origE !== origem) return false;
      const dt = Math.abs(e.data.getTime() - s.data.getTime());
      return dt <= JANELA_MS;
    });
    if (candidatos.length === 0) continue;
    // melhor: menor diff de data, depois qtd
    candidatos.sort((a, b) => {
      const da = Math.abs(a.data.getTime() - s.data.getTime());
      const db = Math.abs(b.data.getTime() - s.data.getTime());
      if (da !== db) return da - db;
      return Math.abs(num(a.quantidade) - num(s.quantidade)) -
        Math.abs(num(b.quantidade) - num(s.quantidade));
    });
    const best = candidatos[0];
    matchedSaida.add(s.id);
    matchedEntrada.add(best.id);
    matches.push({
      saidaId: s.id,
      entradaId: best.id,
      enviou: num(s.quantidade),
      recebeu: num(best.quantidade),
    });
  }

  const alertas: AlertaTransferencia[] = [];
  const slug = params.storeSlug;

  for (const s of saidas) {
    if (s.storeSlug !== slug) continue;
    if (matchedSaida.has(s.id)) continue;
    const dest = s.lojaDestino || '?';
    alertas.push({
      tipo: 'SAIDA_SEM_ENTRADA',
      mensagem: `Transferência enviada sem entrada correspondente na loja ${storeLabel(dest)}`,
      saidaId: s.id,
      lojaDestino: dest,
      estoqueInsumoId: s.estoqueInsumoId,
    });
  }

  for (const e of entradas) {
    if (e.storeSlug !== slug) continue;
    if (matchedEntrada.has(e.id)) continue;
    const orig = e.lojaOrigem || '?';
    alertas.push({
      tipo: 'ENTRADA_SEM_SAIDA',
      mensagem: `Entrada recebida sem saída correspondente na loja ${storeLabel(orig)}`,
      entradaId: e.id,
      lojaOrigem: orig,
      estoqueInsumoId: e.estoqueInsumoId,
    });
  }

  for (const m of matches) {
    const s = saidas.find((x) => x.id === m.saidaId)!;
    const e = entradas.find((x) => x.id === m.entradaId)!;
    if (s.storeSlug !== slug && e.storeSlug !== slug) continue;
    const base = Math.max(m.enviou, m.recebeu, 0.0001);
    const diff = Math.abs(m.enviou - m.recebeu);
    if (diff > QTD_TOL && diff / base > 0.01) {
      alertas.push({
        tipo: 'QTD_DIVERGENTE',
        mensagem: `Quantidade divergente: enviou ${m.enviou}, recebeu ${m.recebeu}`,
        saidaId: m.saidaId,
        entradaId: m.entradaId,
        enviou: m.enviou,
        recebeu: m.recebeu,
      });
    }
  }

  return alertas;
}

/** Soma qtd/valor de transferências da loja na competência. */
export async function totaisTransferenciasLoja(params: {
  tenantUserId: string;
  storeSlug: string;
  competencia: string;
  estoqueInsumoId?: string;
}): Promise<{
  enviadaQtd: number;
  enviadaValor: number;
  recebidaQtd: number;
  recebidaValor: number;
}> {
  const whereBase = {
    userId: params.tenantUserId,
    storeSlug: params.storeSlug,
    competencia: params.competencia,
    ...(params.estoqueInsumoId
      ? { estoqueInsumoId: params.estoqueInsumoId }
      : {}),
  };

  const [saidas, entradas] = await Promise.all([
    prisma.cmvLancamento.findMany({
      where: { ...whereBase, tipo: 'TRANSFERENCIA_SAIDA' },
    }),
    prisma.cmvLancamento.findMany({
      where: { ...whereBase, tipo: 'TRANSFERENCIA_ENTRADA' },
    }),
  ]);

  return {
    enviadaQtd: saidas.reduce((a, l) => a + num(l.quantidade), 0),
    enviadaValor: saidas.reduce((a, l) => a + num(l.valorTotal), 0),
    recebidaQtd: entradas.reduce((a, l) => a + num(l.quantidade), 0),
    recebidaValor: entradas.reduce((a, l) => a + num(l.valorTotal), 0),
  };
}

export { key as transferenciaKey };
