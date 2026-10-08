/**
 * Resumo diário CMV Real — texto WhatsApp com pendências por loja.
 * Não gera mensagem se não houver pendência.
 */

import { prisma } from '@/lib/prisma';
import { storeLabel, CMV_STORE_SLUGS } from './lojas';
import { conciliarTransferencias } from './transferencias';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  'https://platefull.com.br';

export type ResumoDiarioLoja = {
  storeSlug: string;
  label: string;
  notasRevisao: number;
  itensSemMap: number;
  notasFalha: Array<{ id: string; numero: string; motivo: string }>;
  transfSemPar: string[];
  notaMaisAntiga: { id: string; numero: string; dataEntrada: string } | null;
};

export type ResumoDiarioResult = {
  temPendencia: boolean;
  lojas: ResumoDiarioLoja[];
  mensagem: string | null;
};

export async function montarResumoDiario(params: {
  tenantUserId: string;
  storeSlugs?: string[] | null;
  competencia?: string | null;
}): Promise<ResumoDiarioResult> {
  const slugs =
    params.storeSlugs && params.storeSlugs.length > 0
      ? params.storeSlugs
      : [...CMV_STORE_SLUGS];

  const now = new Date();
  const competencia =
    params.competencia ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const lojas: ResumoDiarioLoja[] = [];

  for (const storeSlug of slugs) {
    const [notasRev, itensSem, notasFalha, alertas] = await Promise.all([
      prisma.nfeNota.findMany({
        where: {
          userId: params.tenantUserId,
          storeSlug,
          status: 'EM_REVISAO',
        },
        select: {
          id: true,
          numero: true,
          dataEntrada: true,
          itens: { select: { status: true } },
        },
        orderBy: { dataEntrada: 'asc' },
      }),
      prisma.nfeItem.count({
        where: {
          status: 'SEM_MAPEAMENTO',
          nota: {
            userId: params.tenantUserId,
            storeSlug,
            status: 'EM_REVISAO',
          },
        },
      }),
      prisma.nfeNota.findMany({
        where: {
          userId: params.tenantUserId,
          storeSlug,
          status: 'FALHA',
        },
        select: { id: true, numero: true, ultimoErro: true },
        take: 10,
      }),
      conciliarTransferencias({
        tenantUserId: params.tenantUserId,
        competencia,
        storeSlug,
      }),
    ]);

    const maisAntiga = notasRev[0]
      ? {
          id: notasRev[0].id,
          numero: notasRev[0].numero,
          dataEntrada: notasRev[0].dataEntrada.toISOString(),
        }
      : null;

    const row: ResumoDiarioLoja = {
      storeSlug,
      label: storeLabel(storeSlug),
      notasRevisao: notasRev.length,
      itensSemMap: itensSem,
      notasFalha: notasFalha.map((n) => ({
        id: n.id,
        numero: n.numero,
        motivo: n.ultimoErro || 'erro desconhecido',
      })),
      transfSemPar: alertas.map((a) => a.mensagem),
      notaMaisAntiga: maisAntiga,
    };

    const tem =
      row.notasRevisao > 0 ||
      row.itensSemMap > 0 ||
      row.notasFalha.length > 0 ||
      row.transfSemPar.length > 0;
    if (tem) lojas.push(row);
  }

  if (lojas.length === 0) {
    return { temPendencia: false, lojas: [], mensagem: null };
  }

  const lines: string[] = [
    `📋 *CMV Real — pendências*`,
    ``,
  ];

  for (const l of lojas) {
    lines.push(`🏪 *${l.label}*`);
    if (l.notasRevisao > 0) {
      lines.push(`• ${l.notasRevisao} nota(s) em revisão`);
    }
    if (l.itensSemMap > 0) {
      lines.push(`• ${l.itensSemMap} item(ns) sem mapeamento`);
    }
    for (const f of l.notasFalha) {
      lines.push(`• ❌ NF ${f.numero}: ${f.motivo.slice(0, 80)}`);
    }
    for (const t of l.transfSemPar.slice(0, 5)) {
      lines.push(`• ↔️ ${t}`);
    }
    if (l.notaMaisAntiga) {
      lines.push(
        `• Mais antiga: NF ${l.notaMaisAntiga.numero}`,
        `  ${BASE_URL}/cmv-real/notas/${l.notaMaisAntiga.id}`,
      );
    }
    lines.push('');
  }

  lines.push(`${BASE_URL}/cmv-real/notas`);

  return {
    temPendencia: true,
    lojas,
    mensagem: lines.join('\n').trim(),
  };
}
