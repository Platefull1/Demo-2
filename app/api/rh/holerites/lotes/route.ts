import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { checkRateLimit } from '@/lib/rate-limit';
import { createBatchBodySchema } from '@/lib/holerites/api-schemas';
import { createPayslipSignedUploadUrl } from '@/lib/holerites/storage';
import type { PayslipSourceFile } from '@/lib/holerites/types-ingest';
import { SystemTool } from '@/types/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/rh/holerites/lotes
 * Cria lote + signed upload URLs (PDF não passa pelo body).
 */
export async function POST(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(P.PAYSLIPS_UPLOAD, SystemTool.HOLERITES);
  if (error) return error;

  const rl = await checkRateLimit({
    key: `holerites:lotes:${ctx.userId}`,
    limit: 60,
    windowSeconds: 3600,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }

  const parsed = createBatchBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { competencia, type, files } = parsed.data;
  const batchId = randomUUID().replace(/-/g, '').slice(0, 24);

  const sourceFiles: PayslipSourceFile[] = [];
  const uploads: Array<{ name: string; path: string; signedUrl: string; token: string }> = [];

  try {
    for (const file of files) {
      const path = `${ctx.userId}/_staging/${batchId}/${randomUUID()}.pdf`;
      const signed = await createPayslipSignedUploadUrl(path);
      sourceFiles.push({ path: signed.path, name: file.name, sizeBytes: file.sizeBytes });
      uploads.push({
        name: file.name,
        path: signed.path,
        signedUrl: signed.signedUrl,
        token: signed.token,
      });
    }

    await prisma.payslipBatch.create({
      data: {
        id: batchId,
        userId: ctx.userId,
        competencia,
        type,
        status: 'PROCESSING',
        sourceFiles,
        createdBy: ctx.stackUserId,
      },
    });
  } catch (err) {
    console.error('[holerites/lotes] create', err);
    return NextResponse.json({ error: 'Falha ao criar lote' }, { status: 500 });
  }

  return NextResponse.json({ batchId, uploads });
}
