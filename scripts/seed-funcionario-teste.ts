/**
 * Cria/atualiza o funcionário de teste do portal de holerites.
 * Protegido pelo guard (aborta em host de produção).
 *
 *   npx tsx scripts/seed-funcionario-teste.ts
 *
 * Requer TEST_EMPLOYEE_PHONE no .env.local (E.164 BR, ex. 5541999999999).
 */
import { config } from 'dotenv';
config({ path: '.env.local', override: true });
config({ path: '.env', override: true });

import './guard-prisma-db';

import { PrismaClient } from '@prisma/client';
import { validarCpfDigits, normalizeTelefoneBr } from '../src/lib/shared/holerites/schemas';
import { TEST_EMPLOYEE_CPF } from '../src/lib/holerites/test-employee';

export { TEST_EMPLOYEE_CPF };

const TENANT_EMAIL = 'platefull.app@gmail.com';
const LOJA_NOME = 'CALENZANO AHÚ';

async function main() {
  if (!validarCpfDigits(TEST_EMPLOYEE_CPF)) {
    throw new Error('TEST_EMPLOYEE_CPF inválido no script');
  }

  const phoneRaw = process.env.TEST_EMPLOYEE_PHONE?.trim();
  if (!phoneRaw) {
    throw new Error('Defina TEST_EMPLOYEE_PHONE no .env.local');
  }
  const phone = normalizeTelefoneBr(phoneRaw);
  if (!phone) {
    throw new Error('TEST_EMPLOYEE_PHONE inválido (use DDD+número BR)');
  }

  const prisma = new PrismaClient();
  try {
    const tenant = await prisma.user.findFirst({
      where: { email: TENANT_EMAIL },
      select: { id: true, email: true },
    });
    if (!tenant) throw new Error(`Tenant ${TENANT_EMAIL} não encontrado`);

    const loja = await prisma.rhLoja.findFirst({
      where: { userId: tenant.id, nome: LOJA_NOME },
      select: { id: true, nome: true },
    });
    if (!loja) throw new Error(`Loja ${LOJA_NOME} não encontrada no tenant`);

    const existing = await prisma.rhFuncionario.findFirst({
      where: { userId: tenant.id, cpf: TEST_EMPLOYEE_CPF },
      select: { id: true },
    });

    if (existing) {
      await prisma.rhFuncionario.update({
        where: { id: existing.id },
        data: {
          nome: 'TESTE HOLERITE',
          telefone: phone,
          lojaId: loja.id,
          ativo: true,
          portalStatus: 'enabled',
          dataDemissao: null,
          escala: '6x1',
          turno: 'comercial',
        },
      });
      console.log(`Atualizado funcionarioId=${existing.id} cpf=***${TEST_EMPLOYEE_CPF.slice(-4)}`);
    } else {
      const created = await prisma.rhFuncionario.create({
        data: {
          userId: tenant.id,
          nome: 'TESTE HOLERITE',
          cpf: TEST_EMPLOYEE_CPF,
          telefone: phone,
          lojaId: loja.id,
          ativo: true,
          portalStatus: 'enabled',
          portalTokenVersion: 0,
          escala: '6x1',
          turno: 'comercial',
          salarioBase: 0,
        },
        select: { id: true },
      });
      console.log(`Criado funcionarioId=${created.id} cpf=***${TEST_EMPLOYEE_CPF.slice(-4)}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
