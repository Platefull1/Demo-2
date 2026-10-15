import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
const TID = 'cmk5ykusf0001jz04iwmf8xa8';

/** Ordem da planilha (após MESINHA=1, SEPARADOR=2). */
const NOVOS = [
  { nome: 'EMBALAGEM 20', id: 'cmqnxgpp9002jjs047goosubn', ordem: 3 },
  { nome: 'EMBALAGEM 25', id: 'cmqnxgpp9002kjs04dx56nrbf', ordem: 4 },
  { nome: 'EMBALAGEM 30', id: 'cmqnxgpp9002ljs04h3pnfc64', ordem: 5 },
  { nome: 'EMBALAGEM 35', id: 'cmqnxgpp9002mjs0461hzoll5', ordem: 6 },
  { nome: 'EMBALAGEM 40', id: 'cmqnxgpp9002njs042ghfz4ac', ordem: 7 },
  { nome: 'EMBALAGEM CALZONE', id: 'cmqnxgpp9002ojs04p8b9a37l', ordem: 8 },
  { nome: 'EMBALAGEM ENTRADAS', id: 'cmqnxgpp9002pjs040gu5c4lu', ordem: 9 },
];

async function main() {
  // Align existing MESINHA / SEPARADOR order
  await p.cmvRealInsumoConfig.updateMany({
    where: {
      userId: TID,
      estoqueInsumoId: 'cmqnxgpp9002qjs049vu7g9d8',
    },
    data: { ordem: 1, secao: 'EMBALAGEM', unidade: 'UN', ativo: true },
  });
  await p.cmvRealInsumoConfig.updateMany({
    where: {
      userId: TID,
      estoqueInsumoId: 'cmqnxgpp9002rjs0422xerdty',
    },
    data: { ordem: 2, secao: 'EMBALAGEM', unidade: 'UN', ativo: true },
  });

  for (const it of NOVOS) {
    const row = await p.cmvRealInsumoConfig.upsert({
      where: {
        userId_estoqueInsumoId: {
          userId: TID,
          estoqueInsumoId: it.id,
        },
      },
      create: {
        userId: TID,
        estoqueInsumoId: it.id,
        secao: 'EMBALAGEM',
        unidade: 'UN',
        ordem: it.ordem,
        ativo: true,
      },
      update: {
        secao: 'EMBALAGEM',
        unidade: 'UN',
        ordem: it.ordem,
        ativo: true,
      },
    });
    console.log('OK', it.nome, row.id);
  }

  const emb = await p.cmvRealInsumoConfig.findMany({
    where: { userId: TID, secao: 'EMBALAGEM', ativo: true },
    include: { estoqueInsumo: { select: { nome: true } } },
    orderBy: { ordem: 'asc' },
  });
  console.log(
    '\nEMBALAGEM ativo:',
    emb.map((c) => `${c.ordem}. ${c.estoqueInsumo.nome}`)
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
