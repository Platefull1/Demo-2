import { NextRequest, NextResponse } from 'next/server';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import { executarGeracaoFechamento } from '@/lib/pontos/executar-fechamento';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const { ctx, error } = await requireRhPermission(P.EMPLOYEES_VIEW, SystemTool.PONTOS);
  if (error) return error;

  let body: { mes?: number; ano?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload JSON inválido' }, { status: 400 });
  }

  const mes = Number(body.mes);
  const ano = Number(body.ano);
  if (!mes || mes < 1 || mes > 12 || !ano || ano < 2000) {
    return NextResponse.json(
      { error: 'mes (1-12) e ano são obrigatórios e devem ser válidos' },
      { status: 400 },
    );
  }

  try {
    const result = await executarGeracaoFechamento({ userId: ctx.userId, mes, ano });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'erro';
    if (msg.includes('SECULLUM') || msg.includes('autenticar no Secullum') || msg.includes('Token')) {
      return NextResponse.json({ error: `Falha na autenticação Secullum: ${msg}` }, { status: 502 });
    }
    throw err;
  }
}
