/**
 * Cron contínuo do canal iFood (grupos): agrupa mensagens próximas, espera
 * o cluster "assentar" e anexa a reclamação ao ComplaintReviewRun EM_ANDAMENTO do mês.
 */

import { prisma } from '@/lib/prisma';
import type { ConversationMessage } from '@/lib/complaints/classify';
import {
  clusterHasContent,
  clusterIfoodMessages,
  extractIfoodGroupComplaint,
  ifoodSettleMs,
} from '@/lib/complaints/ifood-group';
import { monthPeriodFromDate, previousMonthPeriod } from '@/lib/complaints/period';
import {
  bumpRunComplaintCount,
  ensureEmAndamentoRun,
  markMessagesComplaintProcessed,
} from '@/lib/complaints/continuous';
import {
  matchLojaFromText,
  pickOperationalLojas,
  resolveLojaFromGrupoNome,
} from '@/lib/complaints/loja-match';

// Re-export para callers antigos
export {
  ensureEmAndamentoRun,
  markMessagesComplaintProcessed,
  bumpRunComplaintCount,
} from '@/lib/complaints/continuous';

const MAX_CLUSTERS_PER_TICK = 20;

/** Variantes de JID para achar msgs mesmo com cadastro inconsistente (@g.us / só dígitos). */
export function groupContactIdVariants(groupWhatsAppId: string): string[] {
  const s = String(groupWhatsAppId || '').trim();
  if (!s) return [];
  const variants = new Set<string>([s]);
  const atGus = s.match(/([\w.-]+)@g\.us/i);
  if (atGus?.[1]) {
    variants.add(`${atGus[1]}@g.us`);
    variants.add(atGus[1]);
  } else {
    const digits = s.replace(/\D/g, '');
    if (digits) {
      variants.add(digits);
      variants.add(`${digits}@g.us`);
    }
  }
  return [...variants];
}

async function resolveLojaIdByNome(userId: string, lojaNome: string): Promise<string | null> {
  const lojas = await prisma.rhLoja.findMany({
    where: { userId },
    select: { id: true, nome: true },
  });
  const operational = pickOperationalLojas({
    rhLojas: lojas,
    ifoodLojaNomes: [lojaNome],
  });
  return (
    resolveLojaFromGrupoNome(lojaNome, lojas, operational)?.id ??
    matchLojaFromText(lojaNome, operational)?.id ??
    matchLojaFromText(lojaNome, lojas)?.id ??
    null
  );
}

function continuousLookbackStart(): Date {
  return previousMonthPeriod().start;
}

export type IfoodCronResult = {
  groupsScanned: number;
  clustersReady: number;
  complaintsCreated: number;
  messagesMarked: number;
  skippedUnsettled: number;
};

function toConv(messages: {
  id: string;
  direction: string;
  messageType: string;
  textContent: string | null;
  sentByAgent: boolean;
  timestamp: Date;
}[]): ConversationMessage[] {
  return messages.map((m) => ({
    id: m.id,
    direction: m.direction,
    messageType: m.messageType,
    textContent: m.textContent,
    sentByAgent: m.sentByAgent,
    timestamp: m.timestamp,
  }));
}

export function isClusterSettled(
  cluster: ConversationMessage[],
  now = new Date(),
  settleMs?: number,
): boolean {
  const last = cluster[cluster.length - 1];
  if (!last) return false;
  const ms = settleMs ?? ifoodSettleMs();
  return now.getTime() - last.timestamp.getTime() >= ms;
}

async function clusterAlreadyInRun(params: {
  runId: string;
  userId: string;
  evidenceIds: string[];
}): Promise<boolean> {
  if (params.evidenceIds.length === 0) return false;
  const existing = await prisma.complaint.findMany({
    where: {
      reviewRunId: params.runId,
      userId: params.userId,
      origem: 'GRUPO_IFOOD',
    },
    select: { evidenciaMessageIds: true },
  });
  const evidenceSet = new Set(params.evidenceIds);
  return existing.some((c) => c.evidenciaMessageIds.some((id) => evidenceSet.has(id)));
}

/**
 * Processa clusters iFood quietos.
 * `settleMs: 0` força classificação (fechamento / resíduo).
 */
export async function processSettledIfoodClusters(opts?: {
  settleMs?: number;
  maxClusters?: number;
  userId?: string;
  periodStart?: Date;
  periodEnd?: Date;
}): Promise<IfoodCronResult> {
  const settleMs = opts?.settleMs ?? ifoodSettleMs();
  const maxClusters = opts?.maxClusters ?? MAX_CLUSTERS_PER_TICK;

  const result: IfoodCronResult = {
    groupsScanned: 0,
    clustersReady: 0,
    complaintsCreated: 0,
    messagesMarked: 0,
    skippedUnsettled: 0,
  };

  const groups = await prisma.iFoodComplaintGroup.findMany({
    where: {
      ativo: true,
      ...(opts?.userId ? { userId: opts.userId } : {}),
    },
    select: {
      userId: true,
      groupWhatsAppId: true,
      lojaNome: true,
      sessionSlot: true,
    },
  });

  const now = new Date();
  let clustersBudget = maxClusters;

  for (const group of groups) {
    if (clustersBudget <= 0) break;
    result.groupsScanned += 1;

    const messageSelect = {
      id: true,
      direction: true,
      messageType: true,
      textContent: true,
      sentByAgent: true,
      timestamp: true,
    } as const;

    const baseWhere = {
      userId: group.userId,
      contactId: { in: groupContactIdVariants(group.groupWhatsAppId) },
      // Atendentes podem postar de outro aparelho no mesmo grupo (IN para a sessão
      // monitorada). Grupos de feedback são dedicados a reclamações — processa ambos.
      direction: { in: ['OUT', 'IN'] as ('OUT' | 'IN')[] },
      complaintProcessedAt: null,
      timestamp: {
        gte: opts?.periodStart ?? continuousLookbackStart(),
        ...(opts?.periodEnd ? { lte: opts.periodEnd } : {}),
      },
    };

    let messages = await prisma.whatsAppMessage.findMany({
      where: { ...baseWhere, sessionSlot: group.sessionSlot },
      select: messageSelect,
      orderBy: { timestamp: 'asc' },
      take: 500,
    });

    // Cadastro com slot errado: ainda assim tenta achar msgs do JID do grupo.
    if (messages.length === 0) {
      messages = await prisma.whatsAppMessage.findMany({
        where: baseWhere,
        select: messageSelect,
        orderBy: { timestamp: 'asc' },
        take: 500,
      });
      if (messages.length > 0) {
        console.warn(
          `[complaints/ifood-cron] grupo ${group.groupWhatsAppId}: msgs achadas fora do slot ${group.sessionSlot}`,
        );
      }
    }

    if (messages.length === 0) continue;

    const conv = toConv(messages);
    const allClusters = clusterIfoodMessages(conv);

    for (const cluster of allClusters) {
      if (clustersBudget <= 0) break;

      if (!isClusterSettled(cluster, now, settleMs)) {
        result.skippedUnsettled += 1;
        continue;
      }

      const clusterIds = cluster.map((m) => m.id);

      if (!clusterHasContent(cluster)) {
        result.messagesMarked += await markMessagesComplaintProcessed(clusterIds);
        continue;
      }

      result.clustersReady += 1;
      clustersBudget -= 1;

      const period = monthPeriodFromDate(cluster[0]!.timestamp);
      const run = await ensureEmAndamentoRun(group.userId, period);

      try {
        const extracted = await extractIfoodGroupComplaint(cluster);
        if (extracted.evidenciaMessageIds.length === 0) {
          result.messagesMarked += await markMessagesComplaintProcessed(clusterIds);
          continue;
        }

        const dup = await clusterAlreadyInRun({
          runId: run.id,
          userId: group.userId,
          evidenceIds: extracted.evidenciaMessageIds,
        });
        if (dup) {
          result.messagesMarked += await markMessagesComplaintProcessed(clusterIds);
          continue;
        }

        const lojaId = await resolveLojaIdByNome(group.userId, group.lojaNome);

        await prisma.complaint.create({
          data: {
            reviewRunId: run.id,
            userId: group.userId,
            contactId: group.groupWhatsAppId,
            contactName: group.lojaNome,
            resumo: extracted.resumo,
            dataOcorrencia: extracted.dataOcorrencia,
            evidenciaMessageIds: extracted.evidenciaMessageIds,
            numeroPedido: extracted.numeroPedido,
            sessionSlot: group.sessionSlot,
            origem: 'GRUPO_IFOOD',
            lojaGrupo: group.lojaNome,
            categoria: extracted.categoria,
            lojaId: lojaId,
            lojaIdentificada: Boolean(lojaId),
          },
        });
        await bumpRunComplaintCount(run.id, 1);
        result.complaintsCreated += 1;
        result.messagesMarked += await markMessagesComplaintProcessed(clusterIds);
      } catch (err) {
        console.error(
          '[complaints/ifood-cron] cluster falhou:',
          group.groupWhatsAppId,
          err,
        );
      }
    }
  }

  return result;
}
