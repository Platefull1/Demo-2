import { NextResponse } from 'next/server';
import { runHoleritesCleanup } from '@/lib/holerites/cleanup';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return authHeader === `Bearer ${secret}`;
}

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const result = await runHoleritesCleanup();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[cron/holerites-cleanup]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro no cleanup',
      },
      { status: 500 },
    );
  }
}

/** Vercel Cron usa GET. Spec etapa 7 também pede POST. */
export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}
