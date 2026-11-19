import { prisma } from '@/lib/prisma';
import { normalizeTelefoneBr } from '@/lib/shared/holerites/schemas';
import {
  labelCompetencia,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import type { PayslipSourceFile } from '@/lib/holerites/types-ingest';
import { removePayslipObjects } from '@/lib/holerites/storage';
import { sendPayslipsPublishedWebhook } from '@/lib/holerites/n8n';
import type { PayslipType } from '@/lib/shared/holerites/types';

export function temContatoValido(func: {
  telefone: string | null;
  whatsappLid: string | null;
}): boolean {
  return Boolean(normalizeTelefoneBr(func.telefone) || func.whatsappLid);
}

export type PublishResult = {
  published: number;
  revoked: number;
  notified: number;
  semContato: number;
  batchId: string;
};

export async function publicarLoteHolerites(opts: {
  batchId: string;
  userId: string;
  actorId: string;
}): Promise<PublishResult> {
  const { batchId, userId, actorId } = opts;

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      status: true,
      unmatchedPages: true,
      sourceFiles: true,
      competencia: true,
      type: true,
    },
  });
  if (!batch) {
    throw Object.assign(new Error('Lote não encontrado'), { status: 404 });
  }
  if (batch.status !== 'REVIEW') {
    throw Object.assign(new Error('Lote precisa estar em REVIEW'), { status: 409 });
  }

  const unmatched = Array.isArray(batch.unmatchedPages) ? batch.unmatchedPages : [];
  if (unmatched.length > 0) {
    throw Object.assign(
      new Error('Ainda há páginas sem vínculo. Vincule, anexe ou ignore antes de publicar.'),
      { status: 409 },
    );
  }

  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const drafts = await tx.payslip.findMany({
      where: { batchId, userId, status: 'DRAFT' },
      select: {
        id: true,
        funcionarioId: true,
        competencia: true,
        type: true,
        funcionario: {
          select: {
            nome: true,
            telefone: true,
            whatsappLid: true,
          },
        },
      },
    });

    let revoked = 0;
    const publishedIds: string[] = [];

    for (const draft of drafts) {
      const ativo = await tx.payslip.findFirst({
        where: {
          userId,
          funcionarioId: draft.funcionarioId,
          competencia: draft.competencia,
          type: draft.type,
          status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'] },
          NOT: { id: draft.id },
        },
        select: { id: true },
      });

      if (ativo) {
        await tx.payslip.update({
          where: { id: ativo.id },
          data: { status: 'REVOKED' },
        });
        await tx.payslipAccessLog.create({
          data: {
            payslipId: ativo.id,
            actorType: 'rh',
            actorId,
            action: 'revoke',
          },
        });
        await tx.payslip.update({
          where: { id: draft.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: now,
            replacesId: ativo.id,
          },
        });
        revoked++;
      } else {
        await tx.payslip.update({
          where: { id: draft.id },
          data: { status: 'PUBLISHED', publishedAt: now },
        });
      }
      publishedIds.push(draft.id);
    }

    await tx.payslipBatch.update({
      where: { id: batchId },
      data: {
        status: 'PUBLISHED',
        publishedAt: now,
        publishedBy: actorId,
        notifyStatus: 'pending',
      },
    });

    return { drafts, revoked, publishedIds };
  });

  const semContato = result.drafts.filter((d) => !temContatoValido(d.funcionario)).length;
  const notified = result.drafts.length - semContato;

  return {
    published: result.drafts.length,
    revoked: result.revoked,
    notified,
    semContato,
    batchId,
  };
}

export async function afterPublicarLote(opts: {
  batchId: string;
  userId: string;
}): Promise<'sent' | 'failed'> {
  const { batchId, userId } = opts;

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      competencia: true,
      type: true,
      sourceFiles: true,
    },
  });
  if (!batch) return 'failed';

  const staging = ((batch.sourceFiles ?? []) as PayslipSourceFile[]).map((f) => f.path);
  try {
    await removePayslipObjects(staging);
  } catch (err) {
    console.error('[holerites/publish] falha ao apagar staging', err);
  }

  const payslips = await prisma.payslip.findMany({
    where: { batchId, userId, status: 'PUBLISHED' },
    select: {
      id: true,
      replacesId: true,
      funcionario: {
        select: { nome: true, telefone: true, whatsappLid: true },
      },
    },
  });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  const items = [];
  for (const p of payslips) {
    if (!temContatoValido(p.funcionario)) continue;
    const phone = normalizeTelefoneBr(p.funcionario.telefone);
    const firstName = (p.funcionario.nome || '').trim().split(/\s+/)[0] || 'Colaborador';
    items.push({
      payslipId: p.id,
      firstName,
      phone: phone ?? '',
      whatsappLid: p.funcionario.whatsappLid,
      competenciaLabel: labelCompetencia(batch.competencia),
      typeLabel: labelPayslipType(batch.type as PayslipType),
      isRetificacao: Boolean(p.replacesId),
      link: `${appUrl}/colaborador/holerites/${p.id}`,
    });
  }

  const ok = await sendPayslipsPublishedWebhook({
    batchId,
    items,
  });

  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: { notifyStatus: ok ? 'sent' : 'failed' },
  });

  return ok ? 'sent' : 'failed';
}

export async function reenviarAvisosLote(opts: {
  batchId: string;
  userId: string;
}): Promise<{ notified: number; semContato: number }> {
  const { batchId, userId } = opts;
  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      status: true,
      notifyStatus: true,
      competencia: true,
      type: true,
    },
  });
  if (!batch) {
    throw Object.assign(new Error('Lote não encontrado'), { status: 404 });
  }
  if (batch.status !== 'PUBLISHED') {
    throw Object.assign(new Error('Lote precisa estar publicado'), { status: 409 });
  }
  if (batch.notifyStatus !== 'failed') {
    throw Object.assign(new Error('Reenvio só disponível quando o aviso falhou'), {
      status: 409,
    });
  }

  const payslips = await prisma.payslip.findMany({
    where: { batchId, userId, status: { in: ['PUBLISHED', 'VIEWED', 'ACKNOWLEDGED'] } },
    select: {
      id: true,
      replacesId: true,
      funcionario: {
        select: { nome: true, telefone: true, whatsappLid: true },
      },
    },
  });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  const items = [];
  let semContato = 0;
  for (const p of payslips) {
    if (!temContatoValido(p.funcionario)) {
      semContato++;
      continue;
    }
    const phone = normalizeTelefoneBr(p.funcionario.telefone);
    const firstName = (p.funcionario.nome || '').trim().split(/\s+/)[0] || 'Colaborador';
    items.push({
      payslipId: p.id,
      firstName,
      phone: phone ?? '',
      whatsappLid: p.funcionario.whatsappLid,
      competenciaLabel: labelCompetencia(batch.competencia),
      typeLabel: labelPayslipType(batch.type as PayslipType),
      isRetificacao: Boolean(p.replacesId),
      link: `${appUrl}/colaborador/holerites/${p.id}`,
    });
  }

  const ok = await sendPayslipsPublishedWebhook({ batchId, items });
  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: { notifyStatus: ok ? 'sent' : 'failed' },
  });
  if (!ok) {
    throw Object.assign(new Error('Falha ao reenviar avisos'), { status: 502 });
  }
  return { notified: items.length, semContato };
}
