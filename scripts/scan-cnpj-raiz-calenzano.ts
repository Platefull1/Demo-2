import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const RAIZ = '08821071';
const prisma = new PrismaClient();

async function main() {
  const forns = await prisma.nfeFornecedor.findMany({
    where: { userId: OWNER },
    select: { cnpj: true, razaoSocial: true, nomeFantasia: true },
  });
  const match = forns.filter((f) => f.cnpj.replace(/\D/g, '').startsWith(RAIZ));
  console.log('fornecedores raiz 08821071', match);

  const notas = await prisma.nfeNota.findMany({
    where: { userId: OWNER, competencia: { in: ['2026-08', '2026-09', '2026-10'] } },
    select: {
      numero: true,
      storeSlug: true,
      competencia: true,
      chaveAcesso: true,
      fornecedor: { select: { cnpj: true, razaoSocial: true } },
      itens: { select: { cfop: true } },
    },
  });
  const hits = [];
  for (const n of notas) {
    const cnpj = n.fornecedor.cnpj.replace(/\D/g, '');
    const chave = String(n.chaveAcesso || '').replace(/\D/g, '');
    const emitChave = chave.length >= 20 ? chave.slice(6, 20) : '';
    if (cnpj.startsWith(RAIZ) || emitChave.startsWith(RAIZ)) {
      hits.push({
        numero: n.numero,
        dest: n.storeSlug,
        competencia: n.competencia,
        cnpj,
        emitChave,
        razao: n.fornecedor.razaoSocial,
        cfops: [...new Set(n.itens.map((i) => i.cfop))],
      });
    }
  }
  console.log('NFs emitente raiz Calenzano', hits.length, JSON.stringify(hits, null, 2));

  const users = await prisma.user.findMany({
    where: { cnpj: { not: null } },
    select: { email: true, cnpj: true, fullName: true, name: true },
  });
  console.log(
    'users com cnpj',
    users.filter((u) => (u.cnpj || '').replace(/\D/g, '').startsWith(RAIZ) || /calen/i.test(`${u.email} ${u.name} ${u.fullName}`)),
  );
}

main().finally(() => prisma.$disconnect());
