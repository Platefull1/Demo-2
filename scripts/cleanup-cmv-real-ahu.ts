/**
 * Limpa dados de teste do CMV Real na conta ahu
 * (cmjhty6hu0001jy04sstknpdo) para reingerir no tenant dono.
 *
 * Uso: npx tsx scripts/cleanup-cmv-real-ahu.ts [--execute]
 * Sem --execute: só mostra contagens / SQL previsto.
 */

import { PrismaClient } from '@prisma/client';

const AHU_USER_ID = 'cmjhty6hu0001jy04sstknpdo';
const OWNER_USER_ID = 'cmk5ykusf0001jz04iwmf8xa8'; // platefull.app

const prisma = new PrismaClient();

async function counts(userId: string) {
  const [
    notas,
    itens,
    fornecedores,
    mapeamentos,
    configs,
    lancamentos,
    saldos,
    fechamentos,
    nfeConfig,
  ] = await Promise.all([
    prisma.nfeNota.count({ where: { userId } }),
    prisma.nfeItem.count({
      where: { nota: { userId } },
    }),
    prisma.nfeFornecedor.count({ where: { userId } }),
    prisma.nfeMapeamento.count({ where: { userId } }),
    prisma.cmvRealInsumoConfig.count({ where: { userId } }),
    prisma.cmvLancamento.count({ where: { userId } }),
    prisma.cmvSaldoEstoque.count({ where: { userId } }),
    prisma.cmvFechamento.count({ where: { userId } }),
    prisma.nfeConfig.count({ where: { userId } }),
  ]);
  const aprovadas = await prisma.nfeNota.count({
    where: { userId, status: 'APROVADA' },
  });
  return {
    notas,
    aprovadas,
    itens,
    fornecedores,
    mapeamentos,
    configs,
    lancamentos,
    saldos,
    fechamentos,
    nfeConfig,
  };
}

const SQL_PREVIEW = `
-- userId ahu = ${AHU_USER_ID}
-- Ordem respeitando FKs (NfeNota.fornecedor Restrict; NfeItem cascade da nota)

DELETE FROM cmv_lancamentos WHERE user_id = '${AHU_USER_ID}';
DELETE FROM nfe_mapeamentos WHERE user_id = '${AHU_USER_ID}';
DELETE FROM nfe_notas WHERE user_id = '${AHU_USER_ID}';  -- cascade nfe_itens
DELETE FROM nfe_fornecedores WHERE user_id = '${AHU_USER_ID}';
DELETE FROM cmv_saldos_estoque WHERE user_id = '${AHU_USER_ID}';
DELETE FROM cmv_fechamentos WHERE user_id = '${AHU_USER_ID}';
DELETE FROM cmv_real_insumo_configs WHERE user_id = '${AHU_USER_ID}';
-- NfeConfig: se dono ainda não tem, MOVE (não apaga sessionSlot/destino WhatsApp);
-- senão DELETE na ahu.
`.trim();

async function main() {
  const execute = process.argv.includes('--execute');

  console.log('=== Contagens ANTES (ahu) ===');
  const before = await counts(AHU_USER_ID);
  console.log(JSON.stringify(before, null, 2));

  console.log('\n=== Contagens dono (platefull) ===');
  console.log(JSON.stringify(await counts(OWNER_USER_ID), null, 2));

  console.log('\n=== SQL / plano ===\n');
  console.log(SQL_PREVIEW);

  const ahuConfig = await prisma.nfeConfig.findUnique({
    where: { userId: AHU_USER_ID },
  });
  const ownerConfig = await prisma.nfeConfig.findUnique({
    where: { userId: OWNER_USER_ID },
  });
  console.log('\nNfeConfig ahu:', ahuConfig
    ? { sessionSlot: ahuConfig.sessionSlot, destino: ahuConfig.destinoPadrao }
    : null);
  console.log('NfeConfig dono:', ownerConfig
    ? { sessionSlot: ownerConfig.sessionSlot, destino: ownerConfig.destinoPadrao }
    : null);

  if (!execute) {
    console.log('\nDry-run. Passe --execute para apagar.');
    return;
  }

  if (before.aprovadas > 0) {
    console.error(`ABORT: ${before.aprovadas} nota(s) APROVADA — não apagar sem confirmação manual.`);
    process.exit(1);
  }

  await prisma.$transaction(async (tx) => {
    await tx.cmvLancamento.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.nfeMapeamento.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.nfeNota.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.nfeFornecedor.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.cmvSaldoEstoque.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.cmvFechamento.deleteMany({ where: { userId: AHU_USER_ID } });
    await tx.cmvRealInsumoConfig.deleteMany({ where: { userId: AHU_USER_ID } });

    if (ahuConfig && !ownerConfig) {
      await tx.nfeConfig.update({
        where: { userId: AHU_USER_ID },
        data: { userId: OWNER_USER_ID },
      });
      console.log('NfeConfig movido ahu → dono (WhatsApp sessionSlot/destino preservados).');
    } else if (ahuConfig && ownerConfig) {
      await tx.nfeConfig.delete({ where: { userId: AHU_USER_ID } });
      console.log('NfeConfig ahu apagado (dono já tinha config).');
    }
  });

  console.log('\n=== Contagens DEPOIS (ahu) ===');
  console.log(JSON.stringify(await counts(AHU_USER_ID), null, 2));
  console.log('\n=== Contagens DEPOIS (dono) ===');
  console.log(JSON.stringify(await counts(OWNER_USER_ID), null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
