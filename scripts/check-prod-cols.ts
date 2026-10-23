/** Verifica quais colunas das migrations pendentes já existem em produção */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  type ColRow = { column_name: string };

  const [waMsgs, tiposAval, cmvTrans] = await Promise.all([
    prisma.$queryRaw<ColRow[]>`
      SELECT column_name::text FROM information_schema.columns
      WHERE table_name = 'whatsapp_messages' AND column_name = 'complaintProcessedAt'`,
    prisma.$queryRaw<ColRow[]>`
      SELECT column_name::text FROM information_schema.columns
      WHERE table_name = 'tipos_avaliacao' AND column_name IN ('lojaId','lojaNome')`,
    prisma.$queryRaw<ColRow[]>`
      SELECT column_name::text FROM information_schema.columns
      WHERE table_name = 'cmv_transferencias' AND column_name IN ('editado_por_id','editado_em')`,
  ]);

  console.log('\n── Migration 20260821190000_whatsapp_complaint_processed_at ──');
  console.log(waMsgs.length > 0
    ? `  ✅ coluna "complaintProcessedAt" JÁ EXISTE → usar resolve --applied`
    : `  ❌ coluna ausente → SQL precisa rodar`);

  console.log('\n── Migration 20260823180000_tipos_avaliacao ──');
  const tiposCols = tiposAval.map((r) => r.column_name);
  if (tiposCols.includes('lojaId') && tiposCols.includes('lojaNome')) {
    console.log(`  ✅ colunas lojaId e lojaNome JÁ EXISTEM → usar resolve --applied`);
  } else {
    console.log(`  Colunas encontradas: ${tiposCols.join(', ') || 'nenhuma'}`);
    console.log(`  ⚠️  Verificar índices e constraints antes de deploy`);
  }

  console.log('\n── Migration 20261022120000_cmv_transferencia_edit_fields ──');
  const editCols = cmvTrans.map((r) => r.column_name);
  if (editCols.length === 2) {
    console.log(`  ✅ editado_por_id e editado_em JÁ EXISTEM → usar resolve --applied`);
  } else if (editCols.length === 0) {
    console.log(`  ⚠️  Colunas AUSENTES → migration precisa rodar (é o diff real do schema)`);
  } else {
    console.log(`  Parcial: ${editCols.join(', ')}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
