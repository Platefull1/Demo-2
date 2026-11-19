import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';
import { cpfSchema, normalizeTelefoneBr } from '@/lib/shared/holerites/schemas';
import { resolverFuncionarioPorCpfLogin } from '@/lib/holerites/funcionario';
import { sendEmployeeOtp } from '@/lib/holerites/n8n';
import {
  clientIp,
  dummyOtpWork,
  generateOtpCode,
  hashOtpCode,
  jitterMs,
} from '@/lib/holerites/otp';
import { maskCpf, phoneHintFromNormalized } from '@/lib/holerites/mask';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GENERIC = {
  ok: true as const,
  message:
    'Se o CPF estiver cadastrado, enviamos um código para o seu WhatsApp.',
};

const bodySchema = z.object({
  cpf: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
  }

  const parsedBody = bodySchema.safeParse(raw);
  if (!parsedBody.success) {
    return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
  }

  const cpfParsed = cpfSchema.safeParse(parsedBody.data.cpf);
  if (!cpfParsed.success) {
    return NextResponse.json({ error: 'CPF inválido' }, { status: 400 });
  }
  const cpf = cpfParsed.data;
  const ip = clientIp(req);

  const rlCpf = await checkRateLimit({
    key: `otp:cpf:${cpf}`,
    limit: 3,
    windowSeconds: 15 * 60,
  });
  if (!rlCpf.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.', retryAfterSeconds: rlCpf.retryAfterSeconds },
      { status: 429 },
    );
  }

  const rlIp = await checkRateLimit({
    key: `otp:ip:${ip}`,
    limit: 10,
    windowSeconds: 15 * 60,
  });
  if (!rlIp.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.', retryAfterSeconds: rlIp.retryAfterSeconds },
      { status: 429 },
    );
  }

  const notSent = async () => {
    dummyOtpWork();
    await jitterMs();
    return NextResponse.json({ ...GENERIC, phoneHint: null });
  };

  let func;
  try {
    func = await resolverFuncionarioPorCpfLogin(cpf);
  } catch (err) {
    console.warn('[colaborador/request-code] resolver falhou', err);
    return notSent();
  }

  if (!func) {
    return notSent();
  }

  const phone = normalizeTelefoneBr(func.telefone);
  if (!phone) {
    console.warn(
      `[colaborador/request-code] telefone inválido funcionarioId=${func.id} cpf=${maskCpf(cpf)}`,
    );
    return notSent();
  }

  let code: string;
  try {
    code = generateOtpCode();
    const codeHash = hashOtpCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction([
      prisma.employeeLoginCode.updateMany({
        where: { funcionarioId: func.id, consumedAt: null },
        data: { consumedAt: new Date() },
      }),
      prisma.employeeLoginCode.create({
        data: {
          funcionarioId: func.id,
          codeHash,
          expiresAt,
          requestIp: ip,
        },
      }),
    ]);
  } catch (err) {
    console.warn('[colaborador/request-code] persistência OTP falhou', err);
    return notSent();
  }

  const firstName = func.nome.trim().split(/\s+/)[0] || 'Olá';
  const sent = await sendEmployeeOtp({
    phone,
    whatsappLid: func.whatsappLid,
    firstName,
    code,
  });

  if (!sent) {
    return notSent();
  }

  return NextResponse.json({
    ...GENERIC,
    phoneHint: phoneHintFromNormalized(phone),
  });
}
