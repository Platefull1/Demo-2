/**
 * Busca as 5 NF-e pelo número do documento (campo `numero`) e pelo
 * trecho do número dentro da chaveAcesso (posições 26-34, 1-indexed).
 * Somente leitura — não altera nada.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const NUMEROS = ['9636376', '9636377', '740826', '740827', '740828'];
const OWNER_USER_ID = 'cmk5ykusf0001jz04iwmf8xa8';

function n(v: unknown) { return Number(v ?? 0); }
function fmtMoney(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function main() {
  console.log('\n=== Busca notas por numero (NF-e) em produção ===\n');

  // Busca direta pelo campo `numero`
  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER_USER_ID,
      numero: { in: NUMEROS },
    },
    select: {
      id: true,
      saiposNotaId: true,
      numero: true,
      chaveAcesso: true,
      status: true,
      aprovacaoRegra: true,
      valorTotal: true,
      storeSlug: true,
      dataEntrada: true,
      fornecedor: { select: { razaoSocial: true, nomeFantasia: true } },
    },
    orderBy: { numero: 'asc' },
  });

  if (notas.length === 0) {
    console.log('Nenhuma nota encontrada pelo campo `numero`.');
    console.log('Tentando por trecho da chaveAcesso (nNF = posições 26–34)…\n');

    // Fallback: busca com LIKE na chaveAcesso (nNF zerado p/ 9 dígitos)
    const padded = NUMEROS.map((n) => n.padStart(9, '0'));
    const notasFallback = await prisma.nfeNota.findMany({
      where: {
        userId: OWNER_USER_ID,
      OR: padded.map((p) => ({ chaveAcesso: { contains: p } })),
    },
    select: {
      id: true,
      saiposNotaId: true,
      numero: true,
      chaveAcesso: true,
      status: true,
      aprovacaoRegra: true,
      valorTotal: true,
      storeSlug: true,
      dataEntrada: true,
      fornecedor: { select: { razaoSocial: true, nomeFantasia: true } },
    },
      orderBy: { numero: 'asc' },
    });
    if (notasFallback.length === 0) {
      console.log('Também não encontradas pela chaveAcesso. Verifique se os números estão corretos.');
      return;
    }
    printNotas(notasFallback);
    return;
  }

  printNotas(notas);

  // Lançamentos gerados pelas notas encontradas
  if (notas.length > 0) {
    const notaIds = notas.map((n) => n.id);
    const lancamentos = await prisma.cmvLancamento.findMany({
      where: {
        userId: OWNER_USER_ID,
        nfeItem: { notaId: { in: notaIds } },
      },
      select: { tipo: true, valorTotal: true, estoqueInsumoId: true },
    });
    const totalLanc = lancamentos.reduce((s, l) => s + n(l.valorTotal), 0);
    console.log(`\n  Lançamentos CMV dessas notas: ${lancamentos.length} registros, total = ${fmtMoney(totalLanc)}`);
    console.log(`  (Se IGNORADAS com sucesso → totalLanc = R$ 0,00)\n`);
  }
}

function printNotas(notas: Array<{
  id: string;
  saiposNotaId: number;
  numero: string;
  chaveAcesso: string;
  status: string;
  aprovacaoRegra: string | null;
  valorTotal: unknown;
  storeSlug: string;
  dataEntrada: Date;
  fornecedor: { razaoSocial: string | null; nomeFantasia: string | null };
}>) {
  let totalValor = 0;
  for (const nota of notas) {
    const v = Number(nota.valorTotal);
    totalValor += v;
    const ok = nota.status === 'IGNORADA' && nota.aprovacaoRegra === 'DEVOLVIDA';
    const fornNome = nota.fornecedor.nomeFantasia || nota.fornecedor.razaoSocial || '—';
    console.log(
      `  ${ok ? '✅' : '❌'} numero=${nota.numero}  saiposId=${nota.saiposNotaId}` +
      `  status=${nota.status}  motivo=${nota.aprovacaoRegra ?? '—'}` +
      `  valor=${Number(nota.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` +
      `  loja=${nota.storeSlug}  data=${nota.dataEntrada.toISOString().slice(0, 10)}` +
      `\n    chave: ${nota.chaveAcesso}` +
      `\n    forn:  ${fornNome}`,
    );
  }
  const naoEncontrados = ['9636376', '9636377', '740826', '740827', '740828'].filter(
    (n) => !notas.find((nota) => nota.numero === n),
  );
  for (const n of naoEncontrados) console.log(`  ❌ numero=${n}  — NÃO ENCONTRADA`);
  console.log(`\n  TOTAL das ${notas.length} nota(s): ${totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
