/**
 * Verificação somente-leitura contra o banco de produção.
 * Roda com a DATABASE_URL do .env (produção).
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OWNER_USER_ID = 'cmk5ykusf0001jz04iwmf8xa8';
const NOTAS_SAIPOS = [9636376, 9636377, 740826, 740827, 740828];
const COMPETENCIA = '2026-10';
const LOJA_AHU = 'ahu';

function n(v: unknown): number { return Number(v ?? 0); }
function fmtMoney(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function main() {
  console.log('\n====== VERIFICAÇÃO PRODUÇÃO (somente leitura) ======\n');

  // 1. Notas IGNORADA
  console.log('── Notas devolvidas ──────────────────────────────');
  const notas = await prisma.nfeNota.findMany({
    where: {
      userId: OWNER_USER_ID,
      saiposNotaId: { in: NOTAS_SAIPOS },
    },
    select: {
      saiposNotaId: true,
      status: true,
      aprovacaoRegra: true,
      valorTotal: true,
    },
    orderBy: { saiposNotaId: 'asc' },
  });

  for (const nota of notas) {
    const ok = nota.status === 'IGNORADA' && nota.aprovacaoRegra === 'DEVOLVIDA';
    console.log(
      `  ${ok ? '✅' : '❌'} saiposNotaId=${nota.saiposNotaId}` +
      `  status=${nota.status}  motivo=${nota.aprovacaoRegra ?? '—'}` +
      `  valor=${fmtMoney(n(nota.valorTotal))}`,
    );
  }

  const naoBatidos = NOTAS_SAIPOS.filter(
    (id) => !notas.find((nota) => nota.saiposNotaId === id),
  );
  for (const id of naoBatidos) {
    console.log(`  ❌ saiposNotaId=${id}  — NÃO ENCONTRADA`);
  }

  // 2. CMV Bebidas Ahú outubro (fórmula real, igual à da página)
  console.log('\n── CMV Bebidas Ahú outubro ───────────────────────');
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER_USER_ID, secao: 'BEBIDA', ativo: true },
  });
  const ids = configs.map((c) => c.estoqueInsumoId);

  const [lancamentos, saldoFim, saldoIni] = await Promise.all([
    prisma.cmvLancamento.findMany({
      where: {
        userId: OWNER_USER_ID,
        storeSlug: LOJA_AHU,
        competencia: COMPETENCIA,
        estoqueInsumoId: { in: ids },
      },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: OWNER_USER_ID,
        storeSlug: LOJA_AHU,
        competencia: COMPETENCIA,
        estoqueInsumoId: { in: ids },
      },
    }),
    prisma.cmvSaldoEstoque.findMany({
      where: {
        userId: OWNER_USER_ID,
        storeSlug: LOJA_AHU,
        competencia: '2026-09',
        estoqueInsumoId: { in: ids },
      },
    }),
  ]);

  const iniMap = new Map(saldoIni.map((s) => [s.estoqueInsumoId, s]));
  const fimMap = new Map(saldoFim.map((s) => [s.estoqueInsumoId, s]));

  let cmvTotal = 0;
  const linhas: Array<{ nome: string; consumoQtd: number; custoMedio: number; cmv: number }> = [];

  for (const cfg of configs) {
    const id = cfg.estoqueInsumoId;
    const ini = iniMap.get(id);
    const fim = fimMap.get(id);
    const itemLancs = lancamentos.filter((l) => l.estoqueInsumoId === id);

    let comprasQtd = 0, comprasValor = 0;
    let transfEnvQtd = 0, transfEnvValor = 0;
    let transfRecQtd = 0, transfRecValor = 0;
    let despQtd = 0;

    for (const l of itemLancs) {
      const q = n(l.quantidade), v = n(l.valorTotal);
      if (l.tipo === 'COMPRA_NFE' || l.tipo === 'COMPRA_MANUAL') {
        comprasQtd += q; comprasValor += v;
      } else if (l.tipo === 'TRANSFERENCIA_SAIDA') {
        transfEnvQtd += q; transfEnvValor += v;
      } else if (l.tipo === 'TRANSFERENCIA_ENTRADA') {
        transfRecQtd += q; transfRecValor += v;
      } else if (l.tipo === 'DESPERDICIO') {
        despQtd += q;
      }
    }

    const estoqueInicial = n(ini?.qtdFinal);
    const estoqueFinal = n(fim?.qtdFinal);
    const custoIni = ini?.custoMedio ? n(ini.custoMedio) : 0;
    const custoFim = fim?.custoMedio ? n(fim.custoMedio) : null;

    const consumoQtd = estoqueInicial + comprasQtd + transfRecQtd - transfEnvQtd - despQtd - estoqueFinal;
    const entradasQtd = estoqueInicial + comprasQtd + transfRecQtd;
    const entradasValor = estoqueInicial * custoIni + comprasValor + transfRecValor;
    const custoMedio = entradasQtd > 0 ? entradasValor / entradasQtd : (custoFim ?? custoIni ?? 0);
    const cmv = Math.round(consumoQtd * custoMedio * 100) / 100;
    cmvTotal += cmv;

    if (Math.abs(cmv) > 0.01) {
      linhas.push({ nome: cfg.estoqueInsumoId, consumoQtd, custoMedio, cmv });
    }
  }

  // Enriquece com nomes
  const nomesMap = new Map(configs.map((c) => [c.estoqueInsumoId, c.estoqueInsumoId]));
  const insumos = await prisma.estoqueInsumo.findMany({
    where: { id: { in: ids } },
    select: { id: true, nome: true },
  });
  for (const ins of insumos) nomesMap.set(ins.id, ins.nome);

  for (const l of linhas) {
    console.log(
      `  ${nomesMap.get(l.nome) ?? l.nome}: consumo=${l.consumoQtd.toFixed(3)}  custoMédio=${fmtMoney(l.custoMedio)}  CMV=${fmtMoney(l.cmv)}`,
    );
  }
  console.log(`\n  TOTAL CMV Bebidas Ahú: ${fmtMoney(cmvTotal)}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
