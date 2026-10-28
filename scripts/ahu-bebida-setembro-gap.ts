/**
 * Explica o gap Ahú set vs planilha 24.954,72 (só leitura).
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();
const BEBIDA_RX =
  /COCA|SPRITE|FANTA|GUARAN|SUCO|AGUA|ÁGUA|SCHIN|HEINEKEN|SPATEN|ICE TEA|ICE PES|DV |SCHWEPPES|TONICA|TONICA|H2OH|CRYSTAL|KUAT|DEL VALLE|CHÁ |CHA /i;

async function main() {
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const secao = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.secao]));
  const nome = new Map(cfgs.map((c) => [c.estoqueInsumoId, c.estoqueInsumo.nome]));

  const itens = await prisma.nfeItem.findMany({
    where: { nota: { userId: OWNER, competencia: '2026-09', storeSlug: 'ahu' } },
    include: {
      nota: { select: { numero: true, status: true, fornecedor: { select: { nomeFantasia: true, razaoSocial: true } } } },
    },
  });

  let bebida = 0;
  let pareceBebidaOutraSecao = 0;
  let pareceBebidaSemMap = 0;
  const outros: Array<Record<string, unknown>> = [];
  const porProduto: Record<string, number> = {};

  for (const it of itens) {
    const valor = it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto);
    const sec = it.estoqueInsumoId ? secao.get(it.estoqueInsumoId) : null;
    const prod = it.estoqueInsumoId ? nome.get(it.estoqueInsumoId) : null;
    if (sec === 'BEBIDA') {
      bebida += valor;
      const k = prod || '?';
      porProduto[k] = (porProduto[k] ?? 0) + valor;
      continue;
    }
    if (BEBIDA_RX.test(it.descricao) || (prod && BEBIDA_RX.test(prod))) {
      const row = {
        nf: it.nota.numero,
        statusNota: it.nota.status,
        desc: it.descricao,
        produto: prod,
        secao: sec || 'SEM_MAP',
        valor,
        forn: it.nota.fornecedor.nomeFantasia || it.nota.fornecedor.razaoSocial,
      };
      outros.push(row);
      if (sec) pareceBebidaOutraSecao += valor;
      else pareceBebidaSemMap += valor;
    }
  }

  console.log({
    itens: itens.length,
    bebida: Number(bebida.toFixed(2)),
    planilha: 24954.72,
    delta: Number((bebida - 24954.72).toFixed(2)),
    pareceBebidaOutraSecao: Number(pareceBebidaOutraSecao.toFixed(2)),
    pareceBebidaSemMap: Number(pareceBebidaSemMap.toFixed(2)),
    comGapFechado: Number((bebida + pareceBebidaOutraSecao + pareceBebidaSemMap - 24954.72).toFixed(2)),
  });
  console.log('outros', JSON.stringify(outros, null, 2));
  console.log(
    'top produtos',
    Object.entries(porProduto)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([k, v]) => ({ k, v: Number(v.toFixed(2)) })),
  );
}

main().finally(() => prisma.$disconnect());
