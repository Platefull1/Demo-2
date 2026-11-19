import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmployeeSession, setEmployeeCookie } from '@/lib/employee-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const loja = session.lojaId
    ? await prisma.rhLoja.findFirst({
        where: { id: session.lojaId },
        select: { nome: true },
      })
    : null;

  const res = NextResponse.json({
    funcionarioId: session.funcionarioId,
    name: session.name,
    lojaNome: loja?.nome ?? null,
  });

  if (session.renewedToken) {
    setEmployeeCookie(res, session.renewedToken);
  }

  return res;
}
