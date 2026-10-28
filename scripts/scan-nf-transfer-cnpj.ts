/**
 * Varredura ago–out: CNPJs das lojas + NFs de transferência (emitente loja / CFOP).
 * npx tsx --env-file=.env scripts/scan-nf-transfer-cnpj.ts
 */
import { PrismaClient } from '@prisma/client';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMPS = ['2026-08', '2026-09', '2026-10'];
const CFOPS = [
  '5151',
  '5152',
  '5153',
  '5408',
  '5409',
  '5557',
  '6152',
  '6409',
  '6557',
  '5202',
  '6202',
];

const prisma = new PrismaClient();

function digits(s: string | null | undefined) {
  return String(s || '').replace(/\D/g, '');
}

function cnpjFromChave(chave: string | null | undefined) {
  const d = digits(chave);
  if (d.length < 20) return null;
  return d.slice(6, 20);
}

async function main() {
  const stores = await prisma.store.findMany({
    where: { userId: OWNER },
    select: { name: true, cnpj: true, abbreviation: true },
  });
  console.log('=== Store CNPJs tenant ===');
  console.log(JSON.stringify(stores, null, 2));

  const allStores = await prisma.store.findMany({
    where: { OR: [{ name: { contains: 'CALENZANO', mode: 'insensitive' } }, { name: { contains: 'calenzano' } }] },
    select: { name: true, cnpj: true, userId: true, abbreviation: true },
  });
  console.log('=== Stores nome CALENZANO (qualquer user) ===');
  console.log(JSON.stringify(allStores, null, 2));

  const rh = await prisma.rhLoja.findMany({
    where: { userId: OWNER },
    select: { nome: true, id: true, cnpj: true },
  });
  console.log('=== RhLoja tenant ===');
  console.log(JSON.stringify(rh, null, 2));

  const rhAll = await prisma.rhLoja.findMany({
    where: { nome: { contains: 'CALENZANO', mode: 'insensitive' } },
    select: { nome: true, cnpj: true, userId: true },
  });
  console.log('=== RhLoja CALENZANO qualquer user ===');
  console.log(JSON.stringify(rhAll, null, 2));

  const forns = await prisma.nfeFornecedor.findMany({
    where: { userId: OWNER },
    select: { cnpj: true, razaoSocial: true, nomeFantasia: true },
    orderBy: { razaoSocial: 'asc' },
  });
  console.log('=== Fornecedores (nome) ===');
  for (const f of forns) {
    const n = `${f.razaoSocial} ${f.nomeFantasia || ''}`.toUpperCase();
    if (
      n.includes('CALEN') ||
      n.includes('PIZZA') ||
      n.includes('AHU') ||
      n.includes('AHÚ') ||
      n.includes('PILAR') ||
      n.includes('PORTAO') ||
      n.includes('PORTÃO') ||
      n.includes('UBERABA')
    ) {
      console.log(JSON.stringify(f));
    }
  }
  console.log('total fornecedores', forns.length);

  const cfopRows = await prisma.$queryRaw<
    Array<{ cfop: string | null; n: bigint }>
  >`
    SELECT i.cfop, COUNT(*)::bigint AS n
    FROM nfe_itens i
    JOIN nfe_notas n ON n.id = i.nota_id
    WHERE n.user_id = ${OWNER}
      AND n.competencia IN ('2026-08', '2026-09', '2026-10')
    GROUP BY i.cfop
    ORDER BY n DESC
  `;
  console.log('=== CFOPs ago–out ===');
  console.log(JSON.stringify(cfopRows.map((r) => ({ cfop: r.cfop, n: Number(r.n) }))));

  const storeCnpjs = new Set(
    [...stores, ...allStores, ...rh, ...rhAll]
      .map((s) => digits(s.cnpj))
      .filter((d) => d.length >= 11),
  );

  const notas = await prisma.nfeNota.findMany({
    where: { userId: OWNER, competencia: { in: COMPS } },
    select: {
      numero: true,
      storeSlug: true,
      competencia: true,
      chaveAcesso: true,
      saiposTransferenciaId: true,
      fornecedor: { select: { cnpj: true, razaoSocial: true, nomeFantasia: true } },
      itens: { select: { cfop: true } },
    },
  });

  const hits = [];
  const emitentes = new Map<string, { nome: string; n: number; lojas: Set<string> }>();
  for (const n of notas) {
    const cnpjForn = digits(n.fornecedor.cnpj);
    const cnpjChave = cnpjFromChave(n.chaveAcesso);
    const nome = n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial;
    const key = cnpjForn || cnpjChave || nome;
    const e = emitentes.get(key) ?? { nome, n: 0, lojas: new Set() };
    e.n += 1;
    e.lojas.add(n.storeSlug);
    emitentes.set(key, e);

    const cfops = [...new Set(n.itens.map((i) => i.cfop).filter(Boolean))] as string[];
    const hasCfop = cfops.some((c) => CFOPS.includes(c));
    const emitenteLoja =
      storeCnpjs.has(cnpjForn) || (cnpjChave ? storeCnpjs.has(cnpjChave) : false);
    if (hasCfop || emitenteLoja || n.saiposTransferenciaId) {
      hits.push({
        numero: n.numero,
        dest: n.storeSlug,
        competencia: n.competencia,
        emitente: nome,
        cnpj: cnpjForn,
        cnpjChave,
        cfops,
        saiposTransferenciaId: n.saiposTransferenciaId,
        emitenteLoja,
        hasCfop,
      });
    }
  }

  console.log('=== Hits transferência ===');
  console.log('count', hits.length);
  console.log(JSON.stringify(hits, null, 2));
  console.log('storeCnpjs conhecidos', [...storeCnpjs]);
  console.log('=== Top emitentes ===');
  const top = [...emitentes.entries()]
    .map(([cnpj, v]) => ({ cnpj, nome: v.nome, n: v.n, lojas: [...v.lojas] }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 15);
  console.log(JSON.stringify(top, null, 2));

  const saipos = notas.filter((n) => n.saiposTransferenciaId != null);
  console.log('saiposTransferenciaId preenchido', saipos.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
