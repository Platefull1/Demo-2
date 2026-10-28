/**
 * Agrupa o scan de seção (reexecuta a lógica) para relatório.
 */
import { PrismaClient } from '@prisma/client';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();
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
      nota: { select: { numero: true, storeSlug: true } },
    },
  });
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  const cfgBy = new Map(cfgs.map((c) => [c.estoqueInsumoId, c]));

  const groups = new Map<
    string,
    {
      desc: string;
      produto: string;
      secao: string;
      chaveTipo: string;
      jaccard: number;
      n: number;
      valor: number;
      nfs: string[];
    }
  >();

  for (const it of itens) {
    const cfg = it.estoqueInsumoId ? cfgBy.get(it.estoqueInsumoId) : null;
    if (!cfg) continue;
    const pa = palavras(it.descricao);
    const pb = palavras(cfg.estoqueInsumo.nome);
    const jac = overlapPct(pa, pb);
    if (jac >= 0.5) continue;
    const chave = it.mapeamento?.chave || '';
    const chaveTipo = chave.startsWith('desc:')
      ? 'nome'
      : chave.startsWith('ean:')
        ? 'ean'
        : 'sem-chave';
    const key = `${it.descricao}||${cfg.estoqueInsumo.nome}||${chaveTipo}`;
    const prev = groups.get(key);
    const valor = it.valorLiquido != null ? Number(it.valorLiquido) : Number(it.valorBruto);
    const nf = `${it.nota.storeSlug}#${it.nota.numero}`;
    if (prev) {
      prev.n += 1;
      prev.valor += valor;
      if (prev.nfs.length < 4) prev.nfs.push(nf);
    } else {
      groups.set(key, {
        desc: it.descricao,
        produto: cfg.estoqueInsumo.nome,
        secao: cfg.secao,
        chaveTipo,
        jaccard: Number(jac.toFixed(2)),
        n: 1,
        valor,
        nfs: [nf],
      });
    }
  }

  const rows = [...groups.values()].sort((a, b) => a.jaccard - b.jaccard || b.valor - a.valor);
  const porTipo = { nome: 0, ean: 0, 'sem-chave': 0 };
  for (const r of rows) porTipo[r.chaveTipo as keyof typeof porTipo] += r.n;
  console.log('pares unicos', rows.length, 'itens', rows.reduce((s, r) => s + r.n, 0), porTipo);
  console.log('=== só nome/fuzzy (desc:) ===');
  console.log(JSON.stringify(rows.filter((r) => r.chaveTipo === 'nome'), null, 2));
  console.log('=== ean jaccard 0 (mais suspeitos) ===');
  console.log(
    JSON.stringify(
      rows.filter((r) => r.chaveTipo === 'ean' && r.jaccard === 0).slice(0, 40),
      null,
      2,
    ),
  );
}

main().finally(() => prisma.$disconnect());
