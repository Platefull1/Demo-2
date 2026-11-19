import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { maskCpf } from '@/lib/holerites/mask';
import {
  detectarPaginaSemTexto,
  extrairCpfsDaPagina,
  extrairLiquido,
  extrairTextoPorPagina,
} from '@/lib/holerites/pdf-ingest';
import { extrairPaginasPdf } from '@/lib/holerites/pdf-split';
import {
  downloadPayslipObject,
  movePayslipObject,
  removePayslipObjects,
  uploadPayslipObject,
} from '@/lib/holerites/storage';
import type { IgnoredPage, UnmatchedPage } from '@/lib/holerites/types-ingest';
import type { PayslipType } from '@/lib/shared/holerites/types';

function sha256Hex(bytes: Buffer | Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function previewText(texto: string): string {
  return (texto ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);
}

function asUnmatched(raw: unknown): UnmatchedPage[] {
  return Array.isArray(raw) ? (raw as UnmatchedPage[]) : [];
}

async function requireBatchReview(batchId: string, userId: string) {
  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      status: true,
      competencia: true,
      type: true,
      unmatchedPages: true,
    },
  });
  if (!batch) {
    throw Object.assign(new Error('Lote não encontrado'), { status: 404 });
  }
  if (batch.status !== 'REVIEW') {
    throw Object.assign(new Error('Lote precisa estar em REVIEW'), { status: 409 });
  }
  return batch;
}

export async function vincularPaginas(opts: {
  batchId: string;
  userId: string;
  sourcePath: string;
  pageIndexes: number[];
  funcionarioId: string;
}) {
  const { batchId, userId, sourcePath, pageIndexes, funcionarioId } = opts;
  const batch = await requireBatchReview(batchId, userId);

  const funcionario = await prisma.rhFuncionario.findFirst({
    where: { id: funcionarioId, userId },
    select: { id: true, lojaId: true, cpf: true },
  });
  if (!funcionario || !funcionario.lojaId) {
    throw Object.assign(new Error('Funcionário não encontrado'), { status: 404 });
  }

  const existing = await prisma.payslip.findFirst({
    where: { batchId, userId, funcionarioId, status: 'DRAFT' },
    select: { id: true },
  });
  if (existing) {
    throw Object.assign(new Error('Já existe DRAFT deste funcionário neste lote'), {
      status: 409,
    });
  }

  const sourceFiles = await prisma.payslipBatch.findFirst({
    where: { id: batchId },
    select: { sourceFiles: true },
  });
  const files = (sourceFiles?.sourceFiles as Array<{ path: string }> | null) ?? [];
  if (!files.some((f) => f.path === sourcePath)) {
    throw Object.assign(new Error('Arquivo de origem inválido'), { status: 400 });
  }
  if (!sourcePath.startsWith(`${userId}/_staging/${batchId}/`)) {
    throw Object.assign(new Error('Arquivo de origem inválido'), { status: 400 });
  }

  const buffer = await downloadPayslipObject(sourcePath);
  const pdfBytes = await extrairPaginasPdf(buffer, pageIndexes);
  const textos = await extrairTextoPorPagina(buffer);
  const joined = pageIndexes.map((i) => textos[i] ?? '').join('\n');

  const storagePath = `${userId}/${funcionarioId}/${batch.competencia}/${batch.type}-${randomUUID()}.pdf`;
  await uploadPayslipObject(storagePath, pdfBytes);

  try {
    const payslip = await prisma.payslip.create({
      data: {
        userId,
        batchId,
        funcionarioId,
        lojaId: funcionario.lojaId,
        competencia: batch.competencia,
        type: batch.type as PayslipType,
        status: 'DRAFT',
        storagePath,
        fileSha256: sha256Hex(pdfBytes),
        fileSizeBytes: pdfBytes.byteLength,
        pageCount: pageIndexes.length,
        netAmountCents: extrairLiquido(joined),
        sourcePath,
        sourcePageIndexes: pageIndexes,
      },
      select: { id: true },
    });

    const unmatched = asUnmatched(batch.unmatchedPages).filter(
      (u) =>
        !(
          u.sourcePath === sourcePath &&
          u.pageIndexes.length === pageIndexes.length &&
          u.pageIndexes.every((p, i) => p === pageIndexes[i])
        ),
    );

    await prisma.payslipBatch.update({
      where: { id: batchId },
      data: { unmatchedPages: unmatched },
    });

    return payslip;
  } catch (err) {
    await removePayslipObjects([storagePath]).catch(() => undefined);
    throw err;
  }
}

export async function trocarFuncionarioDraft(opts: {
  batchId: string;
  userId: string;
  payslipId: string;
  funcionarioId: string;
}) {
  const { batchId, userId, payslipId, funcionarioId } = opts;
  await requireBatchReview(batchId, userId);

  const draft = await prisma.payslip.findFirst({
    where: { id: payslipId, batchId, userId, status: 'DRAFT' },
    select: {
      id: true,
      storagePath: true,
      competencia: true,
      type: true,
      funcionarioId: true,
    },
  });
  if (!draft) {
    throw Object.assign(new Error('Holerite não encontrado'), { status: 404 });
  }

  const funcionario = await prisma.rhFuncionario.findFirst({
    where: { id: funcionarioId, userId },
    select: { id: true, lojaId: true },
  });
  if (!funcionario || !funcionario.lojaId) {
    throw Object.assign(new Error('Funcionário não encontrado'), { status: 404 });
  }

  if (draft.funcionarioId === funcionarioId) {
    return { id: draft.id };
  }

  const conflict = await prisma.payslip.findFirst({
    where: {
      batchId,
      userId,
      funcionarioId,
      status: 'DRAFT',
      NOT: { id: payslipId },
    },
    select: { id: true },
  });
  if (conflict) {
    throw Object.assign(new Error('Já existe DRAFT deste funcionário neste lote'), {
      status: 409,
    });
  }

  const newPath = `${userId}/${funcionarioId}/${draft.competencia}/${draft.type}-${randomUUID()}.pdf`;
  await movePayslipObject(draft.storagePath, newPath);

  try {
    await prisma.payslip.update({
      where: { id: draft.id },
      data: {
        funcionarioId,
        lojaId: funcionario.lojaId,
        storagePath: newPath,
      },
    });
  } catch (err) {
    await movePayslipObject(newPath, draft.storagePath).catch(() => undefined);
    throw err;
  }

  return { id: draft.id };
}

export async function desvincularDraft(opts: {
  batchId: string;
  userId: string;
  payslipId: string;
}) {
  const { batchId, userId, payslipId } = opts;
  const batch = await requireBatchReview(batchId, userId);

  const draft = await prisma.payslip.findFirst({
    where: { id: payslipId, batchId, userId, status: 'DRAFT' },
    select: {
      id: true,
      storagePath: true,
      sourcePath: true,
      sourcePageIndexes: true,
      funcionario: { select: { cpf: true } },
    },
  });
  if (!draft) {
    throw Object.assign(new Error('Holerite não encontrado'), { status: 404 });
  }

  const sourcePath = draft.sourcePath;
  const pageIndexes = draft.sourcePageIndexes ?? [];
  if (!sourcePath || pageIndexes.length === 0) {
    throw Object.assign(
      new Error('Holerite sem origem de staging — não é possível desvincular'),
      { status: 400 },
    );
  }

  let preview = '';
  let cpfDetectado: string | null = maskCpf(draft.funcionario.cpf);
  try {
    const buffer = await downloadPayslipObject(sourcePath);
    const textos = await extrairTextoPorPagina(buffer);
    const joined = pageIndexes.map((i) => textos[i] ?? '').join('\n');
    preview = previewText(joined);
    const first = textos[pageIndexes[0]!] ?? '';
    if (!detectarPaginaSemTexto(first)) {
      const { principal } = extrairCpfsDaPagina(first);
      if (principal) cpfDetectado = maskCpf(principal);
    }
  } catch {
    preview = '';
  }

  await prisma.payslipAccessLog.deleteMany({ where: { payslipId: draft.id } });
  await prisma.payslip.delete({ where: { id: draft.id } });
  await removePayslipObjects([draft.storagePath]);

  const unmatched = asUnmatched(batch.unmatchedPages);
  unmatched.push({
    sourcePath,
    pageIndexes,
    cpfDetectado,
    motivo: 'desvinculado_manual',
    previewText: preview,
  });

  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: { unmatchedPages: unmatched },
  });

  return { ok: true };
}

function samePageSet(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((p, i) => p === b[i]);
}

function removeUnmatched(
  list: UnmatchedPage[],
  sourcePath: string,
  pageIndexes: number[],
): UnmatchedPage[] {
  return list.filter(
    (u) => !(u.sourcePath === sourcePath && samePageSet(u.pageIndexes, pageIndexes)),
  );
}

/**
 * Anexa páginas unmatched ao DRAFT do mesmo arquivo cuja última página
 * é imediatamente anterior ao início deste grupo.
 */
export async function anexarPaginasAnterior(opts: {
  batchId: string;
  userId: string;
  sourcePath: string;
  pageIndexes: number[];
}) {
  const { batchId, userId, sourcePath, pageIndexes } = opts;
  const batch = await requireBatchReview(batchId, userId);

  if (!sourcePath.startsWith(`${userId}/_staging/${batchId}/`)) {
    throw Object.assign(new Error('Arquivo de origem inválido'), { status: 400 });
  }

  const sorted = [...pageIndexes].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]! !== sorted[i - 1]! + 1) {
      throw Object.assign(new Error('Páginas devem ser consecutivas'), { status: 400 });
    }
  }
  const start = sorted[0]!;

  const drafts = await prisma.payslip.findMany({
    where: { batchId, userId, status: 'DRAFT', sourcePath },
    select: {
      id: true,
      storagePath: true,
      sourcePageIndexes: true,
      funcionario: { select: { nome: true } },
    },
  });

  const alvo = drafts.find((d) => {
    const pages = d.sourcePageIndexes ?? [];
    if (pages.length === 0) return false;
    const max = Math.max(...pages);
    return max + 1 === start;
  });

  if (!alvo) {
    throw Object.assign(
      new Error('Nenhum holerite adjacente encontrado neste arquivo'),
      { status: 409 },
    );
  }

  const novasPaginas = [...(alvo.sourcePageIndexes ?? []), ...sorted].sort(
    (a, b) => a - b,
  );
  const buffer = await downloadPayslipObject(sourcePath);
  const pdfBytes = await extrairPaginasPdf(buffer, novasPaginas);
  const newPath = alvo.storagePath; // upsert no mesmo path
  await removePayslipObjects([alvo.storagePath]);
  await uploadPayslipObject(newPath, pdfBytes);

  try {
    const textos = await extrairTextoPorPagina(buffer);
    const joined = novasPaginas.map((i) => textos[i] ?? '').join('\n');
    await prisma.payslip.update({
      where: { id: alvo.id },
      data: {
        storagePath: newPath,
        fileSha256: sha256Hex(pdfBytes),
        fileSizeBytes: pdfBytes.byteLength,
        pageCount: novasPaginas.length,
        sourcePageIndexes: novasPaginas,
        netAmountCents: extrairLiquido(joined),
      },
    });
  } catch (err) {
    throw err;
  }

  const unmatched = removeUnmatched(
    asUnmatched(batch.unmatchedPages),
    sourcePath,
    pageIndexes,
  );
  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: { unmatchedPages: unmatched },
  });

  return { payslipId: alvo.id, funcionarioNome: alvo.funcionario.nome };
}

export async function ignorarPaginas(opts: {
  batchId: string;
  userId: string;
  sourcePath: string;
  pageIndexes: number[];
}) {
  const { batchId, userId, sourcePath, pageIndexes } = opts;
  const batch = await requireBatchReview(batchId, userId);

  if (!sourcePath.startsWith(`${userId}/_staging/${batchId}/`)) {
    throw Object.assign(new Error('Arquivo de origem inválido'), { status: 400 });
  }

  const unmatched = asUnmatched(batch.unmatchedPages);
  const item = unmatched.find(
    (u) => u.sourcePath === sourcePath && samePageSet(u.pageIndexes, pageIndexes),
  );
  if (!item) {
    throw Object.assign(new Error('Página não encontrada em sem vínculo'), {
      status: 404,
    });
  }

  const full = await prisma.payslipBatch.findFirst({
    where: { id: batchId },
    select: { ignoredPages: true },
  });
  const ignored: IgnoredPage[] = Array.isArray(full?.ignoredPages)
    ? (full!.ignoredPages as IgnoredPage[])
    : [];
  ignored.push({
    sourcePath: item.sourcePath,
    pageIndexes: item.pageIndexes,
    cpfDetectado: item.cpfDetectado,
    previewText: item.previewText,
    ignoredAt: new Date().toISOString(),
  });

  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: {
      unmatchedPages: removeUnmatched(unmatched, sourcePath, pageIndexes),
      ignoredPages: ignored,
    },
  });

  return { ok: true };
}
