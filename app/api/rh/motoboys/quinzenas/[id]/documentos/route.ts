import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rhGetUser } from '@/lib/rh-auth';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'rider-documents';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rh = await rhGetUser();
  if (!rh) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id: periodId } = await params;
  const period = await prisma.riderPaymentPeriod.findFirst({
    where: { id: periodId, userId: rh.userId },
    include: { documents: true },
  });

  if (!period) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 });

  // Gerar signed URLs para visualização (1 hora)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const docsComUrl = await Promise.all(
    period.documents.map(async (doc) => {
      const { data } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(doc.storagePath, 3600);
      return { ...doc, signedUrl: data?.signedUrl ?? null };
    })
  );

  return NextResponse.json(docsComUrl);
}

// DELETE /api/rh/motoboys/quinzenas/[id]/documentos?docId=<id>
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const rh = await rhGetUser();
  if (!rh) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const { id: periodId } = await params;
  const docId = req.nextUrl.searchParams.get('docId');
  if (!docId) return NextResponse.json({ error: 'docId obrigatório' }, { status: 400 });

  // Garante que o período pertence ao tenant do RH
  const period = await prisma.riderPaymentPeriod.findFirst({
    where: { id: periodId, userId: rh.userId },
  });
  if (!period) return NextResponse.json({ error: 'Período não encontrado' }, { status: 404 });
  if (period.status === 'paid') {
    return NextResponse.json({ error: 'Quinzena já paga — não é possível excluir documentos' }, { status: 400 });
  }

  const doc = await prisma.riderDocument.findFirst({
    where: { id: docId, periodId },
  });
  if (!doc) return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });

  // Remove do storage
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([doc.storagePath]);
  if (storageError) {
    console.error('[DELETE doc] storage remove', storageError);
    // Continua mesmo se o arquivo não existir no storage — remove o registro de qualquer forma
  }

  // Remove do banco
  await prisma.riderDocument.delete({ where: { id: docId } });

  // Se a quinzena estava em documents_received, volta para pending_documents
  // pois agora falta pelo menos um documento
  if (period.status === 'documents_received' || period.status === 'approved') {
    await prisma.riderPaymentPeriod.update({
      where: { id: periodId },
      data: { status: 'pending_documents' },
    });
  }

  return NextResponse.json({ ok: true });
}
