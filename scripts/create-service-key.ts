/**
 * Gera ServiceApiKey para platefull.app (n8n — CMV sync).
 *
 * Uso:
 *   npx tsx scripts/create-service-key.ts
 *
 * Hash SHA-256 no banco; key em texto puro impressa UMA vez.
 * Não altera nem desativa keys existentes.
 */

import { randomBytes, createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = 'cmk5ykusf0001jz04iwmf8xa8';
const NOME = 'n8n - CMV sync';

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: USER_ID },
    select: { id: true, email: true },
  });
  if (!user) {
    console.error(`Usuário ${USER_ID} não encontrado.`);
    process.exit(1);
  }

  console.log(`Usuário: ${user.email ?? user.id}`);

  const rawKey = randomBytes(32).toString('hex');
  const keyHash = createHash('sha256').update(rawKey).digest('hex');

  const record = await prisma.serviceApiKey.create({
    data: { key: keyHash, nome: NOME, userId: USER_ID, ativo: true },
    select: { id: true, nome: true, createdAt: true },
  });

  console.log('\n' + '='.repeat(60));
  console.log('API key criada (somente hash salvo no banco).');
  console.log('='.repeat(60));
  console.log(`ID    : ${record.id}`);
  console.log(`Nome  : ${record.nome}`);
  console.log(`Criada: ${record.createdAt.toLocaleString('pt-BR')}`);
  console.log('');
  console.log('Key em texto puro (copie AGORA — não será exibida novamente):');
  console.log('');
  console.log(`    ${rawKey}`);
  console.log('');
  console.log('Header:  x-api-key: ' + rawKey);
  console.log('='.repeat(60) + '\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
