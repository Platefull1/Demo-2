import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { cpfSchema } from '@/lib/shared/holerites/schemas';
import { resolverFuncionarioPorCpfLogin } from '@/lib/holerites/funcionario';
import {
  clientIp,
  hashOtpCode,
  safeEqualHex,
} from '@/lib/holerites/otp';
import {
  setEmployeeCookie,
  signEmployeeToken,
} from '@/lib/employee-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const INVALID = { error: 'Código inválido ou expirado' };

const bodySchema = z.object({
  cpf: z.string().min(1),
  code: z.string().regex(/^\d{6}$/),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(INVALID, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(INVALID, { status: 400 });
  }

  const cpfParsed = cpfSchema.safeParse(parsed.data.cpf);
  if (!cpfParsed.success) {
    return NextResponse.json(INVALID, { status: 400 });
  }
  const cpf = cpfParsed.data;
  const code = parsed.data.code;
  const ip = clientIp(req);

  const rl = await checkRateLimit({
    key: `verify:ip:${ip}`,
    limit: 20,
    windowSeconds: 15 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.', retryAfterSeconds: rl.retryAfterSeconds },
      { status: 429 },
    );
  }

  const func = await resolverFuncionarioPorCpfLogin(cpf);
  if (!func) {
    return NextResponse.json(INVALID, { status: 400 });
  }

  const record = await prisma.employeeLoginCode.findFirst({
    where: {
      funcionarioId: func.id,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    return NextResponse.json(INVALID, { status: 400 });
  }

  let match = false;
  try {
    match = safeEqualHex(hashOtpCode(code), record.codeHash);
  } catch {
    match = false;
  }

  if (!match) {
    const attempts = record.attempts + 1;
    await prisma.employeeLoginCode.update({
      where: { id: record.id },
      data: {
        attempts,
        ...(attempts >= 5 ? { consumedAt: new Date() } : {}),
      },
    });
    return NextResponse.json(INVALID, { status: 400 });
  }

  await prisma.$transaction([
    prisma.employeeLoginCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    }),
    prisma.rhFuncionario.update({
      where: { id: func.id },
      data: { portalLastLoginAt: new Date() },
    }),
  ]);

  const token = await signEmployeeToken({
    funcionarioId: func.id,
    userId: func.userId,
    lojaId: func.lojaId,
    name: func.nome,
    tv: func.portalTokenVersion,
  });

  const body: {
    ok: true;
    name: string;
    lojaId: string | null;
    token?: string;
  } = {
    ok: true,
    name: func.nome,
    lojaId: func.lojaId,
  };

  if (req.headers.get('x-client')?.toLowerCase() === 'mobile') {
    body.token = token;
  }

  const res = NextResponse.json(body);
  setEmployeeCookie(res, token);
  return res;
}
