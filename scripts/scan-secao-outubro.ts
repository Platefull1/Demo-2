/**
 * Varredura de seção outubro — só lista.
 * npx tsx --env-file=.env scripts/scan-secao-outubro.ts
 */
import { PrismaClient } from '@prisma/client';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

const FORN_BEBIDA =
  /SPAL|AMBEV|CRBS|COCA|HEINEKEN|FEMSA|SCHIN|PEPSI|AMBEV|CERVEJ|REFRIGERANT|DISTRIBUIDORA.*BEB|BEBIDAS/i;

const UCOM_BEBIDA = new Set(['LAT', 'LATA', 'G', 'PET', 'ML', 'L', 'LT']);

const STOP = new Set([
  'DE', 'DA', 'DO', 'DAS', 'DOS', 'EM', 'COM', 'PARA', 'QTD', 'CX', 'UN', 'KG',
  'LT', 'PET', 'CP', 'FL', 'U', 'X', 'SABOR',
]);

function palavras(s: string) {
  return new Set(
    normalizarDescricao(s)
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d/.test(w)),
  );
}

function overlapPct(a: Set<string>, b: Set<string>) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter += 1;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

async function main() {
  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, competencia: '2026-10' },
      status: { in: ['MAPEADO', 'SUGERIDO'] },
      estoqueInsumoId: { not: null },
    },
    include: {
      mapeamento: { select: { chave: true } },
      nota: {
        select: {
          numero: true,
          storeSlug: true,
          fornecedor: { select: { razaoSocial: true, nomeFantasia: true } },
        },
      },
    },
  });
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const cfgBy = new Map(cfgs.map((c) => [c.estoqueInsumoId, c]));

  const fornNaoBebida: unknown[] = [];
  const ucomMp: unknown[] = [];
  const fuzzy: unknown[] = [];

  for (const it of itens) {
    const cfg = it.estoqueInsumoId ? cfgBy.get(it.estoqueInsumoId) : null;
    if (!cfg) continue;
    const forn = `${it.nota.fornecedor.nomeFantasia || ''} ${it.nota.fornecedor.razaoSocial}`;
    const base = {
      loja: it.nota.storeSlug,
      nf: it.nota.numero,
      desc: it.descricao,
      uCom: it.unidadeComercial,
      produto: cfg.estoqueInsumo.nome,
      secao: cfg.secao,
      valor: it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto),
      forn,
    };

    if (FORN_BEBIDA.test(forn) && cfg.secao !== 'BEBIDA') {
      fornNaoBebida.push(base);
    }

    const u = it.unidadeComercial.toUpperCase().replace(/[^A-Z]/g, '');
    if (UCOM_BEBIDA.has(u) && cfg.secao === 'MATERIA_PRIMA') {
      ucomMp.push(base);
    }

    const pa = palavras(it.descricao);
    const pb = palavras(cfg.estoqueInsumo.nome);
    const jac = overlapPct(pa, pb);
    if (jac < 0.5) {
      const chave = it.mapeamento?.chave || '';
      fuzzy.push({
        ...base,
        jaccard: Number(jac.toFixed(2)),
        chaveTipo: chave.startsWith('desc:') ? 'nome' : chave.startsWith('ean:') ? 'ean' : 'sem-chave',
        nfPalavras: [...pa],
        prodPalavras: [...pb],
      });
    }
  }

  console.log('=== fornecedor bebida → produto ≠ BEBIDA ===', fornNaoBebida.length);
  console.log(JSON.stringify(fornNaoBebida, null, 2));
  console.log('=== uCom LAT/G/PET/ML/L → MP ===', ucomMp.length);
  console.log(JSON.stringify(ucomMp, null, 2));
  console.log('=== nome/fuzzy < 50% palavras (jaccard) ===', fuzzy.length);
  console.log(JSON.stringify(fuzzy, null, 2));
}

main().finally(() => prisma.$disconnect());
