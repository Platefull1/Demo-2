/**
 * Integração etapa 3 — lote → upload → processar → vínculos (branch dev).
 *
 *   npx tsx scripts/test-holerites-ingest.ts
 */
import { config } from 'dotenv';
// .env primeiro, .env.local por último (dev) — nunca o contrário
config({ path: '.env', override: true });
config({ path: '.env.local', override: true });

import './guard-prisma-db';
// Reforça após imports ESM (hoist podem ter rodado dotenv cedo demais)
config({ path: '.env.local', override: true });

import { createHash, randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { TEST_EMPLOYEE_CPF } from '../src/lib/holerites/test-employee';
import {
  CPF_INEXISTENTE_VALIDO,
  gerarPdfSinteticoHolerites,
} from '../tests/helpers/gerar-pdf-sintetico';

const TENANT_EMAIL = 'platefull.app@gmail.com';
const BUCKET = process.env.SUPABASE_PAYSLIPS_BUCKET?.trim();
if (!BUCKET) {
  console.error('SUPABASE_PAYSLIPS_BUCKET ausente');
  process.exit(1);
}

function mask(cpf: string) {
  return `***${cpf.slice(-4)}`;
}

async function main() {
  console.log(`[ingest-test] bucket=${BUCKET} (deve ser payslips-dev)`);
  if (BUCKET === 'payslips') {
    throw new Error('Recusando rodar contra bucket de produção "payslips"');
  }

  const prisma = new PrismaClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  const fullUrl = url.startsWith('http') ? url : `https://${url}.supabase.co`;
  const supabase = createClient(fullUrl, key);

  const { data: buckets } = await supabase.storage.listBuckets();
  const b = buckets?.find((x) => x.name === BUCKET);
  if (!b) throw new Error(`Bucket ${BUCKET} não existe`);
  if (b.public) throw new Error(`Bucket ${BUCKET} está público — abortando`);
  console.log(`[ingest-test] bucket ok public=${b.public}`);

  try {
    console.log(
      `[ingest-test] db host=${new URL(process.env.DATABASE_URL || '').hostname}`,
    );

    const tenant = await prisma.user.findFirst({
      where: { email: TENANT_EMAIL },
      select: { id: true },
    });
    if (!tenant) throw new Error(`Tenant ${TENANT_EMAIL} não encontrado`);

    const loja = await prisma.rhLoja.findFirst({
      where: { userId: tenant.id, nome: 'CALENZANO AHÚ' },
      select: { id: true },
    });
    if (!loja) throw new Error('Loja CALENZANO AHÚ não encontrada');

    let funcionario = await prisma.rhFuncionario.findFirst({
      where: { userId: tenant.id, cpf: TEST_EMPLOYEE_CPF },
      select: { id: true, nome: true, lojaId: true },
    });
    if (!funcionario) {
      funcionario = await prisma.rhFuncionario.create({
        data: {
          userId: tenant.id,
          nome: 'TESTE HOLERITE',
          cpf: TEST_EMPLOYEE_CPF,
          telefone: '5541999999999',
          lojaId: loja.id,
          ativo: true,
          portalStatus: 'enabled',
          escala: '6x1',
          turno: 'comercial',
          salarioBase: 0,
        },
        select: { id: true, nome: true, lojaId: true },
      });
      console.log('[ingest-test] criado TESTE HOLERITE (telefone placeholder)');
    } else if (!funcionario.lojaId) {
      funcionario = await prisma.rhFuncionario.update({
        where: { id: funcionario.id },
        data: { lojaId: loja.id, ativo: true, nome: 'TESTE HOLERITE' },
        select: { id: true, nome: true, lojaId: true },
      });
    }
    console.log(
      `[ingest-test] funcionario=${funcionario.nome} cpf=${mask(TEST_EMPLOYEE_CPF)}`,
    );

    // Limpa resíduos de execuções anteriores (DRAFTs + staging de lotes de teste)
    {
      const staleDrafts = await prisma.payslip.findMany({
        where: {
          userId: tenant.id,
          status: 'DRAFT',
          batch: { createdBy: 'test-holerites-ingest' },
        },
        select: { id: true, storagePath: true },
      });
      if (staleDrafts.length) {
        await prisma.payslipAccessLog.deleteMany({
          where: { payslipId: { in: staleDrafts.map((d) => d.id) } },
        });
        await prisma.payslip.deleteMany({
          where: { id: { in: staleDrafts.map((d) => d.id) } },
        });
        await supabase.storage
          .from(BUCKET)
          .remove(staleDrafts.map((d) => d.storagePath));
      }
      const staleBatches = await prisma.payslipBatch.findMany({
        where: {
          userId: tenant.id,
          createdBy: 'test-holerites-ingest',
          status: { in: ['PROCESSING', 'REVIEW'] },
        },
        select: { id: true, sourceFiles: true },
      });
      for (const b of staleBatches) {
        const files = (b.sourceFiles as Array<{ path: string }> | null) ?? [];
        if (files.length) {
          await supabase.storage.from(BUCKET).remove(files.map((f) => f.path));
        }
        await prisma.payslipBatch.update({
          where: { id: b.id },
          data: { status: 'CANCELLED', unmatchedPages: [], errorMessage: null },
        });
      }
      if (staleDrafts.length || staleBatches.length) {
        console.log(
          `[ingest-test] limpeza prévia: ${staleDrafts.length} drafts, ${staleBatches.length} lotes`,
        );
      }
    }

    // Garante que CPF inexistente não está cadastrado
    const conflito = await prisma.rhFuncionario.count({
      where: { userId: tenant.id, cpf: CPF_INEXISTENTE_VALIDO },
    });
    if (conflito > 0) {
      throw new Error(`CPF de teste ${mask(CPF_INEXISTENTE_VALIDO)} está cadastrado`);
    }

    const pdfBytes = await gerarPdfSinteticoHolerites();
    const batchId = randomUUID().replace(/-/g, '').slice(0, 24);
    const stagingPath = `${tenant.id}/_staging/${batchId}/${randomUUID()}.pdf`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(stagingPath, Buffer.from(pdfBytes), {
        contentType: 'application/pdf',
        upsert: false,
      });
    if (upErr) throw upErr;

    await prisma.payslipBatch.create({
      data: {
        id: batchId,
        userId: tenant.id,
        competencia: '2026-10',
        type: 'MENSAL',
        status: 'PROCESSING',
        sourceFiles: [
          {
            path: stagingPath,
            name: 'sintetico-4paginas.pdf',
            sizeBytes: pdfBytes.byteLength,
          },
        ],
        createdBy: 'test-holerites-ingest',
      },
    });

    // Import dinâmico após dotenv/guard
    const { processarLoteHolerites } = await import('../src/lib/holerites/process-batch');
    const { vincularPaginas, trocarFuncionarioDraft, desvincularDraft } = await import(
      '../src/lib/holerites/vinculos'
    );

    const t0 = Date.now();
    const result = await processarLoteHolerites({ batchId, userId: tenant.id });
    console.log(
      `[ingest-test] processar #1 drafts=${result.draftsCreated} unmatched=${result.unmatchedPages.length} elapsedMs=${result.elapsedMs} (wall=${Date.now() - t0})`,
    );

    const drafts1 = await prisma.payslip.findMany({
      where: { batchId, status: 'DRAFT' },
      select: {
        id: true,
        pageCount: true,
        netAmountCents: true,
        storagePath: true,
        funcionarioId: true,
        sourcePageIndexes: true,
      },
    });
    const batch1 = await prisma.payslipBatch.findUniqueOrThrow({
      where: { id: batchId },
      select: { status: true, unmatchedPages: true },
    });

    assertEq(batch1.status, 'REVIEW', 'status REVIEW');
    assertEq(drafts1.length, 1, '1 DRAFT');
    assertEq(drafts1[0]!.funcionarioId, funcionario.id, 'DRAFT do TESTE HOLERITE');
    assertEq(drafts1[0]!.pageCount, 2, 'DRAFT com 2 páginas');
    assertEq(drafts1[0]!.netAmountCents, 123456, 'líquido 123456');

    const unmatched = batch1.unmatchedPages as Array<{
      pageIndexes: number[];
      motivo: string;
      cpfDetectado: string | null;
    }>;
    const u3 = unmatched.find((u) => u.pageIndexes.includes(2));
    const u4 = unmatched.find((u) => u.pageIndexes.includes(3));
    assertEq(u3?.motivo, 'cpf_nao_cadastrado', 'pág.3 cpf_nao_cadastrado');
    assertEq(u4?.motivo, 'pagina_sem_texto', 'pág.4 pagina_sem_texto');
    console.log('[ingest-test] unmatched motivos ok (sem dados pessoais)');

    // Reprocessar — idempotente
    const pathsBefore = drafts1.map((d) => d.storagePath);
    const result2 = await processarLoteHolerites({ batchId, userId: tenant.id });
    const drafts2 = await prisma.payslip.findMany({
      where: { batchId, status: 'DRAFT' },
      select: { id: true, storagePath: true, pageCount: true },
    });
    assertEq(drafts2.length, 1, 'reprocessar: 1 DRAFT');
    assertEq(result2.draftsCreated, 1, 'reprocessar: draftsCreated=1');

    // Arquivos antigos do DRAFT anterior não devem sobrar
    for (const p of pathsBefore) {
      if (drafts2[0]!.storagePath === p) continue;
      const { data } = await supabase.storage.from(BUCKET).download(p);
      if (data) throw new Error(`Arquivo órfão após reprocessar: ${p}`);
    }
    console.log('[ingest-test] reprocessar sem DRAFT duplicado / sem órfão do draft antigo');

    // Listar bucket do tenant e cruzar com DB
    await assertNoOrphans(supabase, prisma, tenant.id, BUCKET);

    // Caso extra: CPF só na 1ª página + EOF → DRAFT com 2 páginas
    {
      const { gerarPdfDuasPaginasCpfSoNaPrimeira } = await import(
        '../tests/helpers/gerar-pdf-sintetico'
      );
      const pdf2 = await gerarPdfDuasPaginasCpfSoNaPrimeira();
      const batch2Id = randomUUID().replace(/-/g, '').slice(0, 24);
      const staging2 = `${tenant.id}/_staging/${batch2Id}/${randomUUID()}.pdf`;
      const { error: up2 } = await supabase.storage
        .from(BUCKET)
        .upload(staging2, Buffer.from(pdf2), { contentType: 'application/pdf' });
      if (up2) throw up2;
      await prisma.payslipBatch.create({
        data: {
          id: batch2Id,
          userId: tenant.id,
          competencia: '2026-11',
          type: 'MENSAL',
          status: 'PROCESSING',
          sourceFiles: [{ path: staging2, name: '2paginas.pdf', sizeBytes: pdf2.byteLength }],
          createdBy: 'test-holerites-ingest',
        },
      });
      // limpa DRAFT do lote anterior do mesmo func/competência? competência diferente — ok
      // mas índice parcial bloqueia 2 ativos mesma comp/tipo — comps diferentes OK
      await processarLoteHolerites({ batchId: batch2Id, userId: tenant.id });
      const d2 = await prisma.payslip.findMany({
        where: { batchId: batch2Id, status: 'DRAFT' },
        select: { pageCount: true },
      });
      assertEq(d2.length, 1, '2p: 1 DRAFT');
      assertEq(d2[0]!.pageCount, 2, '2p: CPF só na 1ª → 2 páginas');
      console.log('[ingest-test] PDF 2 páginas (CPF só na 1ª) ok');
      const { limparDraftsDoLote: limpar2 } = await import('../src/lib/holerites/process-batch');
      await limpar2(batch2Id, tenant.id);
      await supabase.storage.from(BUCKET).remove([staging2]);
      await prisma.payslipBatch.update({
        where: { id: batch2Id },
        data: { status: 'CANCELLED', unmatchedPages: [] },
      });
    }

    // 404 outro tenant
    const other = await prisma.user.findFirst({
      where: { NOT: { id: tenant.id } },
      select: { id: true },
    });
    if (other) {
      let status = 200;
      try {
        await processarLoteHolerites({ batchId, userId: other.id });
      } catch (e) {
        status = (e as { status?: number })?.status ?? 500;
      }
      assertEq(status, 404, 'lote de outro tenant → 404');
      console.log('[ingest-test] isolamento tenant → 404 ok');
    }

    // Vincular pág.3 a um segundo funcionário ativo (ou ao mesmo após desvincular)
    // Fluxo: desvincular DRAFT → unmatched desvinculado_manual → vincular de novo
    const draftId = drafts2[0]!.id;
    await desvincularDraft({ batchId, userId: tenant.id, payslipId: draftId });
    const afterDes = await prisma.payslip.count({ where: { batchId, status: 'DRAFT' } });
    assertEq(afterDes, 0, 'desvincular remove DRAFT');
    const batchDes = await prisma.payslipBatch.findUniqueOrThrow({
      where: { id: batchId },
      select: { unmatchedPages: true },
    });
    const um = batchDes.unmatchedPages as Array<{ motivo: string; pageIndexes: number[] }>;
    assertEq(
      um.some((u) => u.motivo === 'desvinculado_manual' && u.pageIndexes.includes(0)),
      true,
      'desvinculado_manual nas páginas 0-1',
    );

    const linked = await vincularPaginas({
      batchId,
      userId: tenant.id,
      sourcePath: stagingPath,
      pageIndexes: [0, 1],
      funcionarioId: funcionario.id,
    });
    console.log(`[ingest-test] vincular ok payslipId=${linked.id}`);

    // Trocar para outro funcionário ativo do tenant (se houver)
    const outroFunc = await prisma.rhFuncionario.findFirst({
      where: {
        userId: tenant.id,
        ativo: true,
        lojaId: { not: null },
        NOT: { id: funcionario.id },
      },
      select: { id: true, nome: true },
    });
    if (outroFunc) {
      await trocarFuncionarioDraft({
        batchId,
        userId: tenant.id,
        payslipId: linked.id,
        funcionarioId: outroFunc.id,
      });
      const swapped = await prisma.payslip.findUniqueOrThrow({
        where: { id: linked.id },
        select: { funcionarioId: true, storagePath: true, lojaId: true },
      });
      assertEq(swapped.funcionarioId, outroFunc.id, 'trocar funcionarioId');
      assertEq(
        swapped.storagePath.includes(`/${outroFunc.id}/`),
        true,
        'trocar move storage path',
      );
      // volta
      await trocarFuncionarioDraft({
        batchId,
        userId: tenant.id,
        payslipId: linked.id,
        funcionarioId: funcionario.id,
      });
      console.log('[ingest-test] trocar ok');
    } else {
      console.log('[ingest-test] trocar pulado (só 1 funcionário ativo)');
    }

    await assertNoOrphans(supabase, prisma, tenant.id, BUCKET);

    // Cleanup: cancelar lote (simula DELETE)
    const { limparDraftsDoLote } = await import('../src/lib/holerites/process-batch');
    await limparDraftsDoLote(batchId, tenant.id);
    await supabase.storage.from(BUCKET).remove([stagingPath]);
    await prisma.payslipBatch.update({
      where: { id: batchId },
      data: { status: 'CANCELLED', unmatchedPages: [], errorMessage: null },
    });

    console.log('[ingest-test] OK — cleanup CANCELLED');
    console.log(
      `[ingest-test] resumo sintético: cpf_teste=${mask(TEST_EMPLOYEE_CPF)} inexistente=${mask(CPF_INEXISTENTE_VALIDO)} sha256=${createHash('sha256').update(pdfBytes).digest('hex').slice(0, 12)}…`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

function assertEq(actual: unknown, expected: unknown, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${JSON.stringify(expected)}, veio ${JSON.stringify(actual)}`);
  }
}

async function assertNoOrphans(
  supabase: ReturnType<typeof createClient>,
  prisma: PrismaClient,
  userId: string,
  bucket: string,
) {
  const payslips = await prisma.payslip.findMany({
    where: { userId },
    select: { storagePath: true },
  });
  const batches = await prisma.payslipBatch.findMany({
    where: { userId, status: { in: ['PROCESSING', 'REVIEW'] } },
    select: { sourceFiles: true },
  });
  const allowed = new Set<string>();
  for (const p of payslips) allowed.add(p.storagePath);
  for (const b of batches) {
    const files = (b.sourceFiles as Array<{ path: string }> | null) ?? [];
    for (const f of files) allowed.add(f.path);
  }

  async function walk(prefix: string) {
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
    if (error) throw error;
    const paths: string[] = [];
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id) paths.push(full);
      else paths.push(...(await walk(full)));
    }
    return paths;
  }

  const listed = await walk(userId);
  const orphans = listed.filter((p) => !allowed.has(p));
  if (orphans.length > 0) {
    throw new Error(`Arquivos órfãos no bucket: ${orphans.slice(0, 5).join(', ')}`);
  }
  console.log(`[ingest-test] bucket limpo p/ tenant (${listed.length} arquivos, 0 órfãos)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
