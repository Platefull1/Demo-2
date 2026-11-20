import { createHash, randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { resolverFuncionarioPorCpf } from '@/lib/holerites/funcionario';
import { maskCpf } from '@/lib/holerites/mask';
import {
  agruparPaginas,
  detectarPaginaSemTexto,
  extrairCpfsDaPagina,
  extrairLiquido,
  extrairTextoPorPagina,
  isPdfMagic,
  MAX_PDF_PAGES,
  type PaginaIngest,
} from '@/lib/holerites/pdf-ingest';
import { extrairPaginasPdf } from '@/lib/holerites/pdf-split';
import {
  downloadPayslipObject,
  removePayslipObjects,
  uploadPayslipObject,
} from '@/lib/holerites/storage';
import type {
  PayslipSourceFile,
  UnmatchedPage,
} from '@/lib/holerites/types-ingest';
import type { PayslipType } from '@/lib/shared/holerites/types';
import { limparCpfDigits } from '@/lib/shared/holerites/schemas';

function previewText(texto: string): string {
  return (texto ?? '').replace(/\s+/g, ' ').trim().slice(0, 200);
}

function sha256Hex(bytes: Buffer | Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

async function motivoCpfNaoResolvido(
  userId: string,
  cpf: string,
): Promise<'cpf_nao_cadastrado' | 'cpf_ambiguo'> {
  const digits = limparCpfDigits(cpf);
  const candidatos = await prisma.rhFuncionario.findMany({
    where: { userId, cpf: digits },
    select: { id: true, ativo: true },
  });
  if (candidatos.length === 0) return 'cpf_nao_cadastrado';
  if (candidatos.filter((c) => c.ativo).length > 1) return 'cpf_ambiguo';
  return 'cpf_nao_cadastrado';
}

/** Idempotência: remove DRAFTs do lote + arquivos gerados. Staging permanece. */
export async function limparDraftsDoLote(batchId: string, userId: string): Promise<void> {
  const drafts = await prisma.payslip.findMany({
    where: { batchId, userId, status: 'DRAFT' },
    select: { id: true, storagePath: true },
  });
  if (drafts.length === 0) return;

  const ids = drafts.map((d) => d.id);
  await prisma.payslipAccessLog.deleteMany({ where: { payslipId: { in: ids } } });
  await prisma.payslip.deleteMany({ where: { id: { in: ids } } });
  await removePayslipObjects(drafts.map((d) => d.storagePath));
}

export type ProcessBatchResult = {
  unmatchedPages: UnmatchedPage[];
  draftsCreated: number;
  allPagesSemTexto: boolean;
  elapsedMs: number;
};

export async function processarLoteHolerites(opts: {
  batchId: string;
  userId: string;
}): Promise<ProcessBatchResult> {
  const started = Date.now();
  const { batchId, userId } = opts;

  const batch = await prisma.payslipBatch.findFirst({
    where: { id: batchId, userId },
    select: {
      id: true,
      status: true,
      competencia: true,
      type: true,
      sourceFiles: true,
    },
  });
  if (!batch) {
    throw Object.assign(new Error('Lote não encontrado'), { status: 404 });
  }
  if (batch.status !== 'PROCESSING' && batch.status !== 'REVIEW') {
    throw Object.assign(new Error('Lote não pode ser processado neste status'), {
      status: 409,
    });
  }

  await limparDraftsDoLote(batchId, userId);
  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: { unmatchedPages: [], errorMessage: null, status: 'PROCESSING' },
  });

  const sourceFiles = (batch.sourceFiles ?? []) as PayslipSourceFile[];
  const unmatchedPages: UnmatchedPage[] = [];
  /** funcionarioId já com DRAFT neste lote (anti-duplicata). */
  const draftPorFuncionario = new Set<string>();
  let draftsCreated = 0;
  let totalPages = 0;
  let pagesSemTexto = 0;

  for (const file of sourceFiles) {
    const buffer = await downloadPayslipObject(file.path);
    if (buffer.byteLength !== file.sizeBytes) {
      throw Object.assign(
        new Error(
          `Tamanho do arquivo "${file.name}" diverge do declarado (${buffer.byteLength} ≠ ${file.sizeBytes} bytes). Reenvie o lote.`,
        ),
        { status: 400 },
      );
    }
    if (!isPdfMagic(buffer)) {
      throw new Error(`arquivo não é PDF válido: ${file.name}`);
    }

    const textos = await extrairTextoPorPagina(buffer);
    if (textos.length > MAX_PDF_PAGES) {
      throw Object.assign(
        new Error(
          `Arquivo "${file.name}" tem ${textos.length} páginas (máximo ${MAX_PDF_PAGES}).`,
        ),
        { status: 400 },
      );
    }
    totalPages += textos.length;
    const paginas: PaginaIngest[] = textos.map((texto, index) => {
      const semTexto = detectarPaginaSemTexto(texto);
      if (semTexto) pagesSemTexto++;
      const { principal } = semTexto ? { principal: null } : extrairCpfsDaPagina(texto);
      return { index, cpf: principal, semTexto };
    });

    const { grupos, semVinculo } = agruparPaginas(paginas);

    for (const sv of semVinculo) {
      const first = sv.pageIndexes[0]!;
      unmatchedPages.push({
        sourcePath: file.path,
        pageIndexes: sv.pageIndexes,
        cpfDetectado: null,
        motivo: sv.motivo,
        previewText: previewText(textos[first] ?? ''),
      });
    }

    for (const grupo of grupos) {
      const joinedText = grupo.pageIndexes.map((i) => textos[i] ?? '').join('\n');
      const firstIdx = grupo.pageIndexes[0]!;

      const func = await resolverFuncionarioPorCpf(
        userId,
        grupo.cpf,
        'vinculo',
        batch.competencia,
      );

      if (!func) {
        const motivo = await motivoCpfNaoResolvido(userId, grupo.cpf);
        unmatchedPages.push({
          sourcePath: file.path,
          pageIndexes: grupo.pageIndexes,
          cpfDetectado: maskCpf(grupo.cpf),
          motivo,
          previewText: previewText(joinedText),
        });
        continue;
      }

      if (!func.lojaId) {
        unmatchedPages.push({
          sourcePath: file.path,
          pageIndexes: grupo.pageIndexes,
          cpfDetectado: maskCpf(grupo.cpf),
          motivo: 'cpf_nao_cadastrado',
          previewText: previewText(joinedText),
        });
        continue;
      }

      if (draftPorFuncionario.has(func.id)) {
        unmatchedPages.push({
          sourcePath: file.path,
          pageIndexes: grupo.pageIndexes,
          cpfDetectado: maskCpf(grupo.cpf),
          motivo: 'duplicado_no_lote',
          previewText: previewText(joinedText),
        });
        continue;
      }

      const pdfBytes = await extrairPaginasPdf(buffer, grupo.pageIndexes);
      const fileSha256 = sha256Hex(pdfBytes);
      const storagePath = `${userId}/${func.id}/${batch.competencia}/${batch.type}-${randomUUID()}.pdf`;

      await uploadPayslipObject(storagePath, pdfBytes);

      try {
        await prisma.payslip.create({
          data: {
            userId,
            batchId,
            funcionarioId: func.id,
            lojaId: func.lojaId,
            competencia: batch.competencia,
            type: batch.type as PayslipType,
            status: 'DRAFT',
            storagePath,
            fileSha256,
            fileSizeBytes: pdfBytes.byteLength,
            pageCount: grupo.pageIndexes.length,
            netAmountCents: extrairLiquido(joinedText),
            sourcePath: file.path,
            sourcePageIndexes: grupo.pageIndexes,
          },
        });
      } catch (err) {
        await removePayslipObjects([storagePath]).catch(() => undefined);
        throw err;
      }

      draftPorFuncionario.add(func.id);
      draftsCreated++;
    }
  }

  const allPagesSemTexto = totalPages > 0 && pagesSemTexto === totalPages;
  const errorMessage = allPagesSemTexto
    ? 'PDF parece escaneado (sem texto). Vínculo automático indisponível.'
    : null;

  await prisma.payslipBatch.update({
    where: { id: batchId },
    data: {
      status: 'REVIEW',
      unmatchedPages,
      errorMessage,
    },
  });

  return {
    unmatchedPages,
    draftsCreated,
    allPagesSemTexto,
    elapsedMs: Date.now() - started,
  };
}
