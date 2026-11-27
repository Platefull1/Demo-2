import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { parseSaldoDaAba } from '../src/lib/nfe/importar-saldo-parse';
import { matchNomeProdutoLista } from '../src/lib/nfe/match-nome-produto';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx') as typeof import('xlsx');
const prisma = new PrismaClient();
const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

function n(v: unknown) {
  return v == null ? 0 : Number(v);
}
function round2(v: number) {
  return Math.round(v * 100) / 100;
}

async function main() {
  const dir = 'D:/mods/mds sa/mods the sims';
  const file = fs
    .readdirSync(dir)
    .find((f) => f.toUpperCase().includes('UBERABA') && f.endsWith('.xlsx'))!;
  const wb = XLSX.readFile(path.join(dir, file));
  const sheet = wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO')!;
  const plan = parseSaldoDaAba(wb.Sheets[sheet]).filter(
    (l) => l.secao === 'EMBALAGEM' && (l.qtdFinal > 0 || l.valorFinal > 0),
  );
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true, secao: 'EMBALAGEM' },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const cat = configs.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
  }));
  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: {
      userId: OWNER,
      storeSlug: 'uberaba',
      competencia: '2026-10',
      estoqueInsumoId: { in: configs.map((c) => c.estoqueInsumoId) },
    },
  });
  const byId = new Map(saldos.map((s) => [s.estoqueInsumoId, s]));
  let sumPlan = 0;
  let sumDb = 0;
  for (const pl of plan) {
    sumPlan += pl.valorFinal || 0;
    const m = matchNomeProdutoLista(pl.nome, cat);
    const s = m.item ? byId.get(m.item.id) : null;
    const vdb = s ? round2(n(s.qtdFinal) * n(s.custoMedio)) : 0;
    sumDb += vdb;
    const d = round2(vdb - (pl.valorFinal || 0));
    if (Math.abs(d) > 0.001) {
      console.log(
        `${pl.nome} | planAH=${pl.valorFinal} AG=${pl.custoPlanilha} | dbCusto=${s?.custoMedio} dbVal=${vdb} d=${d} origem=${s?.custoOrigem}`,
      );
    }
  }
  console.log(
    `sumPlan=${round2(sumPlan)} sumDb=${round2(sumDb)} diff=${round2(sumDb - sumPlan)}`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
