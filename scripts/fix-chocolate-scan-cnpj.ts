/**
 * Chocolate ao leite 10,1 nas NFs 6417/6521/6522 + migra ean: legado
 * + varredura outubro + NFs Calenzano CFOP transferência.
 * npx tsx --env-file=.env scripts/fix-chocolate-scan-cnpj.ts
 */
import { Prisma, PrismaClient } from '@prisma/client';
import { chaveMapeamentoEan, normalizarUnidade } from '../src/lib/nfe/normalize';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const COMP = '2026-10';
const NUMEROS = ['6417', '6521', '6522'];
const FATOR_CX = 10.1;

const prisma = new PrismaClient();

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function num(v: unknown): number {
  return Number(v ?? 0);
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function isAoLeite(desc: string) {
  const d = desc.toUpperCase();
  return d.includes('AO LEITE') || d.includes('AO LEITE');
}

async function snapshotChocolate() {
  const notas = await prisma.nfeNota.findMany({
    where: { userId: OWNER, numero: { in: NUMEROS } },
    include: {
      itens: true,
      fornecedor: { select: { cnpj: true, razaoSocial: true } },
    },
    orderBy: [{ numero: 'asc' }, { storeSlug: 'asc' }],
  });
  const rows = [];
  for (const n of notas) {
    const itens = n.itens.filter((it) => {
      const d = it.descricao.toUpperCase();
      return d.includes('CHOCOLATE') || d.includes('CHOC') || d.includes('BISNAGA');
    });
    for (const it of itens) {
      if (!isAoLeite(it.descricao) && !it.descricao.toUpperCase().includes('AO LEITE')) {
        // include all choc on these NFs for visibility, flag leite
      }
      const qtd = num(it.quantidade);
      const fat = it.fatorConversao != null ? num(it.fatorConversao) : null;
      const kg = it.quantidadeConvertida != null ? num(it.quantidadeConvertida) : null;
      const liq = it.valorLiquido != null ? num(it.valorLiquido) : null;
      const custo = it.custoUnitario != null ? num(it.custoUnitario) : kg && kg > 0 && liq != null ? liq / kg : null;
      rows.push({
        notaId: n.id,
        numero: n.numero,
        storeSlug: n.storeSlug,
        status: n.status,
        competencia: n.competencia,
        itemId: it.id,
        descricao: it.descricao,
        ean: it.ean,
        uCom: it.unidadeComercial,
        qtd,
        fat,
        kg,
        liq,
        custo,
        estoqueInsumoId: it.estoqueInsumoId,
        mapeamentoId: it.mapeamentoId,
        itemStatus: it.status,
        aoLeite: /AO\s*LEITE/i.test(it.descricao),
      });
    }
  }
  return { notas, rows };
}

async function migrarChavesEan() {
  const maps = await prisma.nfeMapeamento.findMany({
    where: { userId: OWNER, chave: { startsWith: 'ean:' } },
  });
  const report: Array<{ de: string; para: string; id: string; ok: string }> = [];
  for (const m of maps) {
    if (m.chave.includes('|')) {
      report.push({ de: m.chave, para: m.chave, id: m.id, ok: 'já nova' });
      continue;
    }
    const und = normalizarUnidade(m.unidadeComercial);
    const nova = chaveMapeamentoEan(m.ean || m.chave.replace(/^ean:/, ''), und);
    if (nova === m.chave) {
      report.push({ de: m.chave, para: nova, id: m.id, ok: 'sem uCom' });
      continue;
    }
    const clash = await prisma.nfeMapeamento.findUnique({
      where: {
        userId_fornecedorId_chave: {
          userId: m.userId,
          fornecedorId: m.fornecedorId,
          chave: nova,
        },
      },
    });
    if (clash && clash.id !== m.id) {
      report.push({
        de: m.chave,
        para: nova,
        id: m.id,
        ok: `conflito com ${clash.id} fat=${clash.fatorConversao}`,
      });
      continue;
    }
    await prisma.nfeMapeamento.update({
      where: { id: m.id },
      data: { chave: nova, unidadeComercial: und },
    });
    report.push({ de: m.chave, para: nova, id: m.id, ok: 'migrado' });
  }
  return report;
}

async function reabrirEConfirmar(
  snap: Awaited<ReturnType<typeof snapshotChocolate>>,
) {
  const results = [];
  for (const n of snap.notas) {
    const leite = n.itens.filter((it) => /AO\s*LEITE/i.test(it.descricao));
    if (leite.length === 0) {
      results.push({ numero: n.numero, storeSlug: n.storeSlug, ok: false, motivo: 'sem item ao leite' });
      continue;
    }

    if (n.status === 'APROVADA') {
      const fech = await prisma.cmvFechamento.findUnique({
        where: {
          userId_storeSlug_competencia: {
            userId: OWNER,
            storeSlug: n.storeSlug,
            competencia: n.competencia,
          },
        },
        select: { status: true },
      });
      if (fech?.status === 'FECHADO') {
        results.push({
          numero: n.numero,
          storeSlug: n.storeSlug,
          ok: false,
          motivo: 'Competência fechada',
        });
        continue;
      }

      const itemIds = n.itens.map((it) => it.id);
      await prisma.$transaction([
        prisma.cmvLancamento.deleteMany({
          where: { userId: OWNER, nfeItemId: { in: itemIds } },
        }),
        prisma.$executeRaw`
          UPDATE nfe_notas
          SET status = 'EM_REVISAO',
              aprovada_em = NULL,
              aprovada_por_id = NULL,
              updated_at = NOW()
          WHERE id = ${n.id} AND user_id = ${OWNER}
        `,
        prisma.nfeItem.updateMany({
          where: { notaId: n.id, status: 'MAPEADO' },
          data: { status: 'SUGERIDO' },
        }),
      ]);
    }

    // Remapeia todos os itens que já tinham produto (reabrir os deixou SUGERIDO)
    const itens = await prisma.nfeItem.findMany({ where: { notaId: n.id } });
    for (const it of itens) {
      const aoLeite = /AO\s*LEITE/i.test(it.descricao);
      const fator = aoLeite ? FATOR_CX : it.fatorConversao != null ? num(it.fatorConversao) : null;
      if (!it.estoqueInsumoId || fator == null) continue;
      const qtdConv = num(it.quantidade) * fator;
      const liq = it.valorLiquido != null ? num(it.valorLiquido) : null;

      let mapeamentoId = it.mapeamentoId;
      if (aoLeite && it.ean) {
        const und = normalizarUnidade(it.unidadeComercial);
        const chave = chaveMapeamentoEan(it.ean, und);
        const map = await prisma.nfeMapeamento.upsert({
          where: {
            userId_fornecedorId_chave: {
              userId: OWNER,
              fornecedorId: n.fornecedorId,
              chave,
            },
          },
          create: {
            userId: OWNER,
            fornecedorId: n.fornecedorId,
            chave,
            ean: it.ean,
            descricaoNormalizada: it.descricaoNormalizada,
            unidadeComercial: und,
            estoqueInsumoId: it.estoqueInsumoId,
            fatorConversao: decimal(fator),
            usos: 1,
            ultimoUsoEm: new Date(),
            criadoPorId: OWNER,
          },
          update: {
            estoqueInsumoId: it.estoqueInsumoId,
            fatorConversao: decimal(fator),
            unidadeComercial: und,
            usos: { increment: 1 },
            ultimoUsoEm: new Date(),
          },
        });
        mapeamentoId = map.id;
      }

      await prisma.nfeItem.update({
        where: { id: it.id },
        data: {
          status: 'MAPEADO',
          fatorConversao: decimal(fator),
          quantidadeConvertida: decimal(qtdConv),
          mapeamentoId,
          custoUnitario:
            liq != null && qtdConv > 0 ? decimal(liq / qtdConv) : null,
          alertas: [],
        },
      });
    }

    const after = await prisma.nfeItem.findMany({ where: { notaId: n.id } });
    const pend = after.filter(
      (i) => i.status === 'SUGERIDO' || i.status === 'SEM_MAPEAMENTO',
    );
    if (pend.length > 0) {
      results.push({
        numero: n.numero,
        storeSlug: n.storeSlug,
        ok: false,
        motivo: `${pend.length} item(ns) ainda pendente(s)`,
      });
      continue;
    }

    await prisma.$executeRaw`
      UPDATE nfe_notas
      SET status = 'APROVADA',
          aprovada_em = NOW(),
          aprovada_por_id = ${OWNER},
          updated_at = NOW()
      WHERE id = ${n.id} AND user_id = ${OWNER}
    `;

    const mapeados = await prisma.nfeItem.findMany({
      where: { notaId: n.id, status: 'MAPEADO' },
    });
    let lancs = 0;
    for (const item of mapeados) {
      if (
        !item.estoqueInsumoId ||
        item.quantidadeConvertida == null ||
        item.valorLiquido == null ||
        !item.unidadeConvertida
      ) {
        continue;
      }
      try {
        await prisma.cmvLancamento.create({
          data: {
            userId: OWNER,
            storeSlug: n.storeSlug,
            competencia: n.competencia,
            data: n.dataEntrada,
            tipo: 'COMPRA_NFE',
            estoqueInsumoId: item.estoqueInsumoId,
            quantidade: item.quantidadeConvertida,
            unidade: item.unidadeConvertida,
            valorTotal: item.valorLiquido,
            nfeItemId: item.id,
          },
        });
        lancs++;
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          continue;
        }
        throw err;
      }
    }
    results.push({
      numero: n.numero,
      storeSlug: n.storeSlug,
      ok: true,
      lancamentos: lancs,
    });
  }
  return results;
}

async function varreduraOutubro() {
  const itens = await prisma.nfeItem.findMany({
    where: {
      nota: { userId: OWNER, competencia: COMP },
      status: { in: ['MAPEADO', 'SUGERIDO'] },
    },
    include: {
      nota: { select: { numero: true, storeSlug: true } },
      mapeamento: { select: { fatorConversao: true } },
    },
  });

  const packUnd = new Set(['CX', 'CAIXA', 'FD', 'FARDO', 'PCT', 'PACOTE']);
  const packItens = itens.filter((it) => {
    const u = normalizarUnidade(it.unidadeComercial);
    return packUnd.has(u) || packUnd.has(it.unidadeComercial.toUpperCase());
  });

  const insumos = await prisma.estoqueInsumo.findMany({
    where: { userId: OWNER },
    select: { id: true, nome: true, insumoId: true },
  });
  const slugById = new Map(insumos.map((i) => [i.id, i.insumoId]));
  const nomeById = new Map(insumos.map((i) => [i.id, i.nome]));

  const cfgs = await prisma.estoqueProdutoConfig.findMany({
    where: { userId: OWNER, kgPorUnidade: { not: null } },
    select: { produtoId: true, kgPorUnidade: true },
  });
  const kgBySlug = new Map(
    cfgs.filter((c) => c.kgPorUnidade != null).map((c) => [c.produtoId, c.kgPorUnidade!]),
  );

  const fatorIgualP: Array<Record<string, unknown>> = [];
  for (const it of packItens) {
    const fat = it.fatorConversao != null ? num(it.fatorConversao) : null;
    if (fat == null || !it.estoqueInsumoId) continue;
    const slug = slugById.get(it.estoqueInsumoId);
    const p = slug ? kgBySlug.get(slug) : null;
    if (p == null || p <= 0) continue;
    if (Math.abs(fat - p) < 0.0001) {
      fatorIgualP.push({
        loja: it.nota.storeSlug,
        nf: it.nota.numero,
        descricao: it.descricao,
        uCom: it.unidadeComercial,
        fator: fat,
        kgPorUnidade: p,
        produto: nomeById.get(it.estoqueInsumoId) ?? it.estoqueInsumoId,
        kg: it.quantidadeConvertida != null ? num(it.quantidadeConvertida) : null,
        custoKg: it.custoUnitario != null ? num(it.custoUnitario) : null,
      });
    }
  }

  // custo/kg > 5× mediana, por produto, só itens CX/FD/PCT em KG
  const byProd = new Map<string, number[]>();
  for (const it of packItens) {
    if (!it.estoqueInsumoId || it.custoUnitario == null) continue;
    if (it.unidadeConvertida !== 'KG') continue;
    const c = num(it.custoUnitario);
    if (!(c > 0)) continue;
    const arr = byProd.get(it.estoqueInsumoId) ?? [];
    arr.push(c);
    byProd.set(it.estoqueInsumoId, arr);
  }
  function mediana(arr: number[]) {
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }
  const custoAlto: Array<Record<string, unknown>> = [];
  for (const it of packItens) {
    if (!it.estoqueInsumoId || it.custoUnitario == null) continue;
    if (it.unidadeConvertida !== 'KG') continue;
    const arr = byProd.get(it.estoqueInsumoId);
    if (!arr || arr.length < 2) continue;
    const med = mediana(arr);
    const c = num(it.custoUnitario);
    if (med > 0 && c > 5 * med) {
      custoAlto.push({
        loja: it.nota.storeSlug,
        nf: it.nota.numero,
        descricao: it.descricao,
        uCom: it.unidadeComercial,
        fator: it.fatorConversao != null ? num(it.fatorConversao) : null,
        custoKg: c,
        mediana: med,
        razao: c / med,
        produto: nomeById.get(it.estoqueInsumoId) ?? it.estoqueInsumoId,
      });
    }
  }

  return { totalPack: packItens.length, fatorIgualP, custoAlto };
}

async function nfsCalenzanoTransfer() {
  const forns = await prisma.nfeFornecedor.findMany({
    where: { userId: OWNER },
    select: { id: true, cnpj: true, razaoSocial: true, nomeFantasia: true },
  });
  const cal = forns.filter((f) => {
    const n = `${f.razaoSocial} ${f.nomeFantasia || ''}`.toUpperCase();
    return n.includes('CALENZANO');
  });

  const cfopsTransf = ['5152', '5409', '5151', '5153', '5408', '5409', '6152', '6409', '5557', '6557'];
  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER,
      competencia: { in: ['2026-08', '2026-09', '2026-10'] },
      OR: [
        { fornecedorId: { in: cal.map((f) => f.id) } },
        { itens: { some: { cfop: { in: cfopsTransf } } } },
      ],
    },
    include: {
      fornecedor: { select: { cnpj: true, razaoSocial: true, nomeFantasia: true } },
      itens: { select: { cfop: true, descricao: true } },
    },
  });

  const byCfop = new Map<string, number>();
  const hits = [];
  for (const n of notas) {
    const cfops = [...new Set(n.itens.map((i) => i.cfop).filter(Boolean))] as string[];
    for (const c of cfops) byCfop.set(c, (byCfop.get(c) ?? 0) + 1);
    const isCal = cal.some((f) => f.id === n.fornecedorId);
    const hasCfop = cfops.some((c) => cfopsTransf.includes(c));
    if (isCal || hasCfop) {
      hits.push({
        numero: n.numero,
        lojaDestino: n.storeSlug,
        competencia: n.competencia,
        emitente: n.fornecedor.nomeFantasia || n.fornecedor.razaoSocial,
        cnpj: n.fornecedor.cnpj,
        cfops,
        saiposTransferenciaId: n.saiposTransferenciaId,
        isCalenzano: isCal,
        hasCfopTransf: hasCfop,
      });
    }
  }

  return {
    fornecedoresCalenzano: cal,
    hits,
    byCfop: Object.fromEntries(byCfop),
  };
}

async function main() {
  console.log('=== ANTES chocolate ao leite ===');
  const before = await snapshotChocolate();
  for (const r of before.rows.filter((x) => x.aoLeite)) {
    console.log(
      JSON.stringify({
        nf: r.numero,
        loja: r.storeSlug,
        status: r.status,
        qtd: r.qtd,
        uCom: r.uCom,
        fator: r.fat,
        kg: r.kg,
        custoKg: r.custo,
        valor: r.liq,
        ean: r.ean,
        desc: r.descricao,
      }),
    );
  }
  console.log('notas encontradas:', before.notas.map((n) => `${n.numero}/${n.storeSlug}/${n.status}`).join(', '));

  console.log('\n=== Migrar chaves EAN ===');
  const mig = await migrarChavesEan();
  const counts = mig.reduce<Record<string, number>>((acc, x) => {
    acc[x.ok.startsWith('conflito') ? 'conflito' : x.ok] = (acc[x.ok.startsWith('conflito') ? 'conflito' : x.ok] ?? 0) + 1;
    return acc;
  }, {});
  console.log(JSON.stringify(counts));
  for (const x of mig.filter((m) => m.ok !== 'já nova' && m.ok !== 'migrado')) {
    console.log(JSON.stringify(x));
  }
  const chocMig = mig.filter((m) => m.de.includes('0742832') || m.para.includes('0742832'));
  console.log('chocolate maps:', JSON.stringify(chocMig, null, 2));

  console.log('\n=== Reabrir/reconfirmar ===');
  const conf = await reabrirEConfirmar(before);
  console.log(JSON.stringify(conf, null, 2));

  console.log('\n=== DEPOIS chocolate ao leite ===');
  const after = await snapshotChocolate();
  for (const r of after.rows.filter((x) => x.aoLeite)) {
    console.log(
      JSON.stringify({
        nf: r.numero,
        loja: r.storeSlug,
        status: r.status,
        qtd: r.qtd,
        uCom: r.uCom,
        fator: r.fat,
        kg: r.kg,
        custoKg: r.custo,
        valor: r.liq,
      }),
    );
  }

  console.log('\n=== Varredura outubro CX/FD/PCT ===');
  const scan = await varreduraOutubro();
  console.log('itens pack:', scan.totalPack);
  console.log('fator == kgPorUnidade:', scan.fatorIgualP.length);
  console.log(JSON.stringify(scan.fatorIgualP, null, 2));
  console.log('custo/kg > 5x mediana:', scan.custoAlto.length);
  console.log(JSON.stringify(scan.custoAlto, null, 2));

  console.log('\n=== NFs Calenzano / CFOP transf ago–out ===');
  const nfs = await nfsCalenzanoTransfer();
  console.log('fornecedores Calenzano:', JSON.stringify(nfs.fornecedoresCalenzano, null, 2));
  console.log('hits:', nfs.hits.length);
  console.log(JSON.stringify(nfs.hits, null, 2));
  console.log('cfops nas notas filtradas:', JSON.stringify(nfs.byCfop));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
