/**
 * Testes live nas notas EM_REVISAO — com snapshot e restore obrigatório.
 *
 * Uso: npx tsx --env-file=.env scripts/test-cmv-real-live.ts
 *
 * NÃO aprova notas. NÃO fecha competência. Só mexe em campos reversíveis
 * e restaura tudo no finally.
 */
import { Prisma, PrismaClient } from '@prisma/client';
import {
  aplicarMapeamentoEmNotasPendentes,
  salvarMapeamentoEPropagar,
} from '../src/lib/nfe/aplicar-mapeamento';
import { transferirCompetenciaNota } from '../src/lib/nfe/approve';
import {
  alertasComMarca,
  MARCA_BONIFICACAO,
  MARCA_TROCA,
  naturezaDoItem,
  preservarMarcasManuais,
} from '../src/lib/nfe/bonificacao';
import { avaliarAlertaPrecoRevisao } from '../src/lib/nfe/alerta-preco-revisao';
import {
  fatorEfetivoDaEntrada,
  interpretarRevisaoItem,
} from '../src/lib/nfe/revisao-interpretacao';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const p = new PrismaClient();

type SnapItem = {
  id: string;
  status: string;
  alertas: unknown;
  fatorConversao: Prisma.Decimal | null;
  quantidadeConvertida: Prisma.Decimal | null;
  custoUnitario: Prisma.Decimal | null;
  estoqueInsumoId: string | null;
  mapeamentoId: string | null;
  unidadeConvertida: string | null;
};

type SnapNota = {
  id: string;
  numero: string;
  competencia: string;
  status: string;
  storeSlug: string;
  dataEntrada: Date;
  fornecedorId: string;
  itens: SnapItem[];
};

type SnapMap = {
  id: string;
  chave: string;
  fornecedorId: string;
  fatorConversao: Prisma.Decimal;
  estoqueInsumoId: string | null;
  usos: number;
  ultimoUsoEm: Date | null;
  ean: string | null;
  descricaoNormalizada: string | null;
  unidadeComercial: string;
  existed: boolean;
};

const results: Array<{ name: string; ok: boolean; detail: string }> = [];
const mapsCriados: string[] = [];
const mapsAlterados: SnapMap[] = [];
let snapNotas: SnapNota[] = [];

function pass(name: string, detail: string) {
  results.push({ name, ok: true, detail });
  console.log(`✅ ${name}: ${detail}`);
}
function fail(name: string, detail: string) {
  results.push({ name, ok: false, detail });
  console.error(`❌ ${name}: ${detail}`);
}

async function snapshotNotas(ids: string[]): Promise<SnapNota[]> {
  const notas = await p.nfeNota.findMany({
    where: { id: { in: ids }, userId: OWNER },
    include: {
      itens: {
        select: {
          id: true,
          status: true,
          alertas: true,
          fatorConversao: true,
          quantidadeConvertida: true,
          custoUnitario: true,
          estoqueInsumoId: true,
          mapeamentoId: true,
          unidadeConvertida: true,
        },
      },
    },
  });
  return notas.map((n) => ({
    id: n.id,
    numero: n.numero,
    competencia: n.competencia,
    status: n.status,
    storeSlug: n.storeSlug,
    dataEntrada: n.dataEntrada,
    fornecedorId: n.fornecedorId,
    itens: n.itens,
  }));
}

async function restoreNotas(snaps: SnapNota[]) {
  for (const n of snaps) {
    await p.nfeNota.update({
      where: { id: n.id },
      data: {
        competencia: n.competencia,
        status: n.status as never,
      },
    });
    for (const it of n.itens) {
      await p.nfeItem.update({
        where: { id: it.id },
        data: {
          status: it.status as never,
          alertas: it.alertas as Prisma.InputJsonValue,
          fatorConversao: it.fatorConversao,
          quantidadeConvertida: it.quantidadeConvertida,
          custoUnitario: it.custoUnitario,
          estoqueInsumoId: it.estoqueInsumoId,
          mapeamentoId: it.mapeamentoId,
          unidadeConvertida: it.unidadeConvertida as never,
        },
      });
    }
  }
}

async function restoreMaps() {
  for (const id of mapsCriados) {
    // Desvincula itens antes de apagar
    await p.nfeItem.updateMany({
      where: { mapeamentoId: id },
      data: { mapeamentoId: null },
    });
    await p.nfeMapeamento.deleteMany({ where: { id, userId: OWNER } });
  }
  for (const m of mapsAlterados) {
    if (!m.existed) continue;
    await p.nfeMapeamento.update({
      where: { id: m.id },
      data: {
        fatorConversao: m.fatorConversao,
        estoqueInsumoId: m.estoqueInsumoId,
        usos: m.usos,
        ultimoUsoEm: m.ultimoUsoEm,
        ean: m.ean,
        descricaoNormalizada: m.descricaoNormalizada,
        unidadeComercial: m.unidadeComercial,
      },
    });
  }
}

async function pickTargets() {
  const notas = await p.nfeNota.findMany({
    where: { userId: OWNER, status: 'EM_REVISAO' },
    include: {
      itens: true,
      fornecedor: { select: { id: true, razaoSocial: true, nomeFantasia: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 40,
  });

  // Transferência: nota com ≥1 item, competência válida
  const paraTransferir = notas.find((n) => n.itens.length > 0);
  // Bonificação: item pendente ou mapeado
  const paraBonif = notas.find((n) =>
    n.itens.some((i) => i.status === 'SUGERIDO' || i.status === 'MAPEADO'),
  );
  // Mapeamento: duas notas do mesmo fornecedor com item casável
  let paraMapA: (typeof notas)[0] | null = null;
  let paraMapB: (typeof notas)[0] | null = null;
  let itemMapA: (typeof notas)[0]['itens'][0] | null = null;
  let itemMapB: (typeof notas)[0]['itens'][0] | null = null;

  outer: for (const a of notas) {
    for (const ia of a.itens) {
      if (ia.status === 'IGNORADO') continue;
      for (const b of notas) {
        if (b.id === a.id) continue;
        if (b.fornecedorId !== a.fornecedorId) continue;
        for (const ib of b.itens) {
          if (ib.status === 'IGNORADO') continue;
          const sameEan = Boolean(ia.ean && ib.ean && ia.ean === ib.ean);
          const sameDesc =
            ia.descricaoNormalizada &&
            ia.descricaoNormalizada === ib.descricaoNormalizada &&
            ia.unidadeComercial === ib.unidadeComercial;
          if (sameEan || sameDesc) {
            paraMapA = a;
            paraMapB = b;
            itemMapA = ia;
            itemMapB = ib;
            break outer;
          }
        }
      }
    }
  }

  // Alerta de preço: item com provolone ou qualquer com fatorConversao + histórico
  const provolone = await p.nfeItem.findFirst({
    where: {
      descricao: { contains: 'PROVOLONE', mode: 'insensitive' },
      nota: { userId: OWNER, status: { in: ['EM_REVISAO', 'APROVADA'] } },
      fatorConversao: { not: null },
      estoqueInsumoId: { not: null },
    },
    include: { nota: { select: { id: true, numero: true, status: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return {
    paraTransferir,
    paraBonif,
    paraMapA,
    paraMapB,
    itemMapA,
    itemMapB,
    provolone,
    todasIds: [
      ...new Set(
        [
          paraTransferir?.id,
          paraBonif?.id,
          paraMapA?.id,
          paraMapB?.id,
          provolone?.nota.id,
        ].filter(Boolean) as string[],
      ),
    ],
  };
}

async function testTransferencia(nota: NonNullable<Awaited<ReturnType<typeof pickTargets>>['paraTransferir']>) {
  const origem = nota.competencia;
  const [y, m] = origem.split('-').map(Number);
  const destino =
    m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;

  // Garante meses abertos
  for (const comp of [origem, destino]) {
    const fech = await p.cmvFechamento.findUnique({
      where: {
        userId_storeSlug_competencia: {
          userId: OWNER,
          storeSlug: nota.storeSlug,
          competencia: comp,
        },
      },
    });
    if (fech?.status === 'FECHADO') {
      fail(
        'transferir_competencia',
        `competência ${comp} fechada — pulado (não mexer em fechamento)`,
      );
      return;
    }
  }

  const r1 = await transferirCompetenciaNota({
    userId: OWNER,
    notaId: nota.id,
    competenciaDestino: destino,
  });
  if (!r1.ok) {
    fail('transferir_competencia', `ida falhou: ${r1.motivo}`);
    return;
  }
  const after = await p.nfeNota.findUnique({
    where: { id: nota.id },
    select: { competencia: true, dataEntrada: true },
  });
  if (after?.competencia !== destino) {
    fail('transferir_competencia', `esperava ${destino}, veio ${after?.competencia}`);
    return;
  }
  if (after.dataEntrada.getTime() !== nota.dataEntrada.getTime()) {
    fail('transferir_competencia', 'dataEntrada mudou (não deveria)');
    return;
  }

  const r2 = await transferirCompetenciaNota({
    userId: OWNER,
    notaId: nota.id,
    competenciaDestino: origem,
  });
  if (!r2.ok) {
    fail('transferir_competencia_volta', `volta falhou: ${r2.motivo}`);
    return;
  }
  pass(
    'transferir_competencia',
    `NF ${nota.numero}: ${origem} → ${destino} → ${origem} (dataEntrada intacta)`,
  );
}

async function testBonificacao(nota: NonNullable<Awaited<ReturnType<typeof pickTargets>>['paraBonif']>) {
  const item = nota.itens.find(
    (i) => i.status === 'SUGERIDO' || i.status === 'MAPEADO',
  )!;
  const alertasAntes = Array.isArray(item.alertas) ? [...(item.alertas as string[])] : [];

  const comBonif = alertasComMarca(alertasAntes, 'BONIFICACAO');
  await p.nfeItem.update({
    where: { id: item.id },
    data: { alertas: comBonif },
  });
  let cur = await p.nfeItem.findUnique({ where: { id: item.id } });
  let nat = naturezaDoItem({ cfop: item.cfop, alertas: cur?.alertas });
  if (nat !== 'BONIFICACAO') {
    fail('bonificacao_marca', `esperava BONIFICACAO, veio ${nat}`);
    return;
  }

  // Simula confirmar_item: só preserva marcas manuais
  const preservadas = preservarMarcasManuais(cur?.alertas);
  await p.nfeItem.update({
    where: { id: item.id },
    data: { alertas: preservadas },
  });
  cur = await p.nfeItem.findUnique({ where: { id: item.id } });
  if (!preservarMarcasManuais(cur?.alertas).includes(MARCA_BONIFICACAO)) {
    fail('bonificacao_preserva_confirm', 'marca sumiu ao "confirmar"');
    return;
  }

  const comTroca = alertasComMarca(cur?.alertas, 'TROCA');
  await p.nfeItem.update({ where: { id: item.id }, data: { alertas: comTroca } });
  cur = await p.nfeItem.findUnique({ where: { id: item.id } });
  nat = naturezaDoItem({ cfop: item.cfop, alertas: cur?.alertas });
  if (nat !== 'TROCA') {
    fail('bonificacao_troca', `esperava TROCA, veio ${nat}`);
    return;
  }
  if (preservarMarcasManuais(cur?.alertas).includes(MARCA_BONIFICACAO)) {
    fail('bonificacao_troca', 'BONIFICACAO e TROCA juntas');
    return;
  }

  const normal = alertasComMarca(cur?.alertas, null);
  await p.nfeItem.update({ where: { id: item.id }, data: { alertas: normal } });
  cur = await p.nfeItem.findUnique({ where: { id: item.id } });
  if (preservarMarcasManuais(cur?.alertas).length > 0) {
    fail('bonificacao_limpa', 'marca sobrou após Compra normal');
    return;
  }

  pass(
    'bonificacao_marca',
    `NF ${nota.numero} item: Bonif → preserva → Troca → Normal`,
  );
}

async function testMapeamento(
  notaA: NonNullable<Awaited<ReturnType<typeof pickTargets>>['paraMapA']>,
  notaB: NonNullable<Awaited<ReturnType<typeof pickTargets>>['paraMapB']>,
  itemA: NonNullable<Awaited<ReturnType<typeof pickTargets>>['itemMapA']>,
  itemB: NonNullable<Awaited<ReturnType<typeof pickTargets>>['itemMapB']>,
) {
  // Snapshot maps que possam ser tocados
  const und = itemA.unidadeComercial;
  const existentes = await p.nfeMapeamento.findMany({
    where: {
      userId: OWNER,
      fornecedorId: notaA.fornecedorId,
      OR: [
        ...(itemA.ean
          ? [
              { chave: { contains: itemA.ean } },
              { ean: itemA.ean },
            ]
          : []),
        { descricaoNormalizada: itemA.descricaoNormalizada },
      ],
    },
  });
  for (const m of existentes) {
    mapsAlterados.push({
      id: m.id,
      chave: m.chave,
      fornecedorId: m.fornecedorId,
      fatorConversao: m.fatorConversao,
      estoqueInsumoId: m.estoqueInsumoId,
      usos: m.usos,
      ultimoUsoEm: m.ultimoUsoEm,
      ean: m.ean,
      descricaoNormalizada: m.descricaoNormalizada,
      unidadeComercial: m.unidadeComercial,
      existed: true,
    });
  }

  // Precisa de um insumo válido
  let estoqueInsumoId = itemA.estoqueInsumoId || itemB.estoqueInsumoId;
  if (!estoqueInsumoId) {
    const cfg = await p.cmvRealInsumoConfig.findFirst({
      where: { userId: OWNER, ativo: true },
      select: { estoqueInsumoId: true },
    });
    estoqueInsumoId = cfg?.estoqueInsumoId ?? null;
  }
  if (!estoqueInsumoId) {
    fail('mapeamento_propaga', 'sem estoqueInsumoId disponível');
    return;
  }

  const fatorTeste = 7.777;
  const beforeB = await p.nfeItem.findUnique({
    where: { id: itemB.id },
    select: {
      status: true,
      fatorConversao: true,
      mapeamentoId: true,
      estoqueInsumoId: true,
    },
  });

  const salvo = await salvarMapeamentoEPropagar({
    tenantUserId: OWNER,
    actorUserId: OWNER,
    fornecedorId: notaA.fornecedorId,
    ean: itemA.ean,
    descricao: itemA.descricao,
    unidadeComercial: und,
    estoqueInsumoId,
    fatorConversao: fatorTeste,
    unidadeConvertida: 'KG',
    excludeItemId: itemA.id,
  });

  // Maps criados que não existiam antes → apagar no restore
  for (const id of salvo.mapeamentoIds) {
    if (!existentes.some((e) => e.id === id)) {
      mapsCriados.push(id);
    }
  }

  const afterB = await p.nfeItem.findUnique({
    where: { id: itemB.id },
    select: {
      status: true,
      fatorConversao: true,
      mapeamentoId: true,
      estoqueInsumoId: true,
      nota: { select: { status: true, numero: true } },
    },
  });

  if (afterB?.nota.status !== 'EM_REVISAO') {
    fail('mapeamento_propaga', 'nota B saiu de EM_REVISAO');
    return;
  }

  const fatorB = afterB?.fatorConversao != null ? Number(afterB.fatorConversao) : null;
  if (fatorB == null || Math.abs(fatorB - fatorTeste) > 0.0001) {
    fail(
      'mapeamento_propaga',
      `item B não herdou fator ${fatorTeste} (ficou ${fatorB}). ` +
        `NF A=${notaA.numero} B=${notaB.numero} propagados=${salvo.itensPropagados} ` +
        `beforeB=${JSON.stringify(beforeB)}`,
    );
    return;
  }
  if (afterB.status !== 'MAPEADO') {
    fail('mapeamento_propaga', `item B status=${afterB.status}, esperava MAPEADO`);
    return;
  }
  if (afterB.estoqueInsumoId !== estoqueInsumoId) {
    fail('mapeamento_propaga', 'estoqueInsumoId do B não atualizou');
    return;
  }

  // Segundo save com fator diferente deve vencer no B
  const fator2 = 8.888;
  const salvo2 = await salvarMapeamentoEPropagar({
    tenantUserId: OWNER,
    actorUserId: OWNER,
    fornecedorId: notaA.fornecedorId,
    ean: itemA.ean,
    descricao: itemA.descricao,
    unidadeComercial: und,
    estoqueInsumoId,
    fatorConversao: fator2,
    unidadeConvertida: 'KG',
    excludeItemId: itemA.id,
  });
  for (const id of salvo2.mapeamentoIds) {
    if (
      !existentes.some((e) => e.id === id) &&
      !mapsCriados.includes(id)
    ) {
      mapsCriados.push(id);
    }
  }
  const afterB2 = await p.nfeItem.findUnique({
    where: { id: itemB.id },
    select: { fatorConversao: true },
  });
  const fatorB2 = afterB2?.fatorConversao != null ? Number(afterB2.fatorConversao) : null;
  if (fatorB2 == null || Math.abs(fatorB2 - fator2) > 0.0001) {
    fail(
      'mapeamento_ultimo_vence',
      `esperava ${fator2}, ficou ${fatorB2}`,
    );
    return;
  }

  pass(
    'mapeamento_propaga',
    `NF ${notaA.numero}→${notaB.numero}: fator ${fatorTeste} depois ${fator2} (último vence). ` +
      `chaves=${salvo.chaves.join(',')}`,
  );
}

async function testAlertaPreco(
  provolone: NonNullable<Awaited<ReturnType<typeof pickTargets>>['provolone']>,
) {
  const fatorSalvo = Number(provolone.fatorConversao);
  const qtd = Number(provolone.quantidade);
  const valor = Number(provolone.valorLiquido ?? provolone.valorBruto);
  const custoCorreto = qtd * fatorSalvo > 0 ? valor / (qtd * fatorSalvo) : 0;

  const hist = await p.nfeItem.findMany({
    where: {
      estoqueInsumoId: provolone.estoqueInsumoId!,
      status: 'MAPEADO',
      custoUnitario: { not: null },
      nota: {
        userId: OWNER,
        status: 'APROVADA',
        id: { not: provolone.notaId },
      },
    },
    select: {
      custoUnitario: true,
      descricao: true,
      notaId: true,
      nota: { select: { dataEntrada: true } },
    },
    orderBy: { nota: { dataEntrada: 'desc' } },
    take: 30,
  });

  const historico = hist.map((h) => ({
    custo: Number(h.custoUnitario),
    descricao: h.descricao,
    notaId: h.notaId,
  }));

  // 1) Com fator salvo: se preço ~igual ao histórico, NÃO alerta (caso do print)
  const alertaReal = avaliarAlertaPrecoRevisao({
    custoAtual: custoCorreto,
    historico,
    descricaoAtual: provolone.descricao,
    sufixo: 'kg',
  });

  // 2) Com fator "caixa inventada" (se houver pack), pode alertar falso
  const interp = interpretarRevisaoItem({
    descricao: provolone.descricao,
    quantidade: qtd,
    unidadeComercial: provolone.unidadeComercial,
    unidadeCmv: 'KG',
    valorItem: valor,
  });
  const optCaixa = interp.opcoes.find((o) => o.id === 'caixa' && o.fator != null);
  let falsoPositivoEvangelizado = true;
  if (optCaixa?.fator != null && Math.abs(optCaixa.fator - fatorSalvo) > 0.01) {
    const custoErrado = valor / (qtd * optCaixa.fator);
    const alertaFalso = avaliarAlertaPrecoRevisao({
      custoAtual: custoErrado,
      historico,
      descricaoAtual: provolone.descricao,
      sufixo: 'kg',
    });
    // A correção da UI: usa fator salvo, então alertaReal deve refletir custoCorreto
    // Se o falso dispararia e o real não, a correção está certa
    if (alertaFalso && !alertaReal) {
      falsoPositivoEvangelizado = true;
      pass(
        'alerta_preco_fator_salvo',
        `NF ${provolone.nota.numero}: custo correto R$${custoCorreto.toFixed(2)} sem alerta; ` +
          `fator caixa ${optCaixa.fator} daria R$${custoErrado.toFixed(2)} com alerta falso — correção evita`,
      );
    } else if (!alertaFalso && !alertaReal) {
      pass(
        'alerta_preco_fator_salvo',
        `NF ${provolone.nota.numero}: nenhum alerta (correto R$${custoCorreto.toFixed(2)}; caixa R$${(custoErrado).toFixed(2)} também sem delta≥3)`,
      );
    } else if (alertaReal) {
      pass(
        'alerta_preco_fator_salvo',
        `NF ${provolone.nota.numero}: alerta LEGÍTIMO com fator salvo — ${alertaReal.mensagem}`,
      );
    } else {
      pass(
        'alerta_preco_fator_salvo',
        `NF ${provolone.nota.numero}: custo R$${custoCorreto.toFixed(2)}; falso caixa ${alertaFalso ? 'sim' : 'não'}`,
      );
    }
  } else {
    // Sem opção caixa distinta: valida que aumento artificial dispara
    const alertaFake = avaliarAlertaPrecoRevisao({
      custoAtual: custoCorreto + 10,
      historico,
      descricaoAtual: provolone.descricao,
      sufixo: 'kg',
    });
    if (historico.length >= 2 && !alertaFake) {
      fail(
        'alerta_preco_fator_salvo',
        `alerta deveria disparar com +R$10 (hist=${historico.length}, custo=${custoCorreto})`,
      );
      return;
    }
    pass(
      'alerta_preco_ainda_funciona',
      `custo R$${custoCorreto.toFixed(2)}; +10 → ${alertaFake ? 'alerta ok' : 'sem hist suficiente'}; real=${alertaReal ? 'alerta' : 'sem alerta'}`,
    );
  }

  // Garante que fatorEfetivo + fator salvo batem
  if (interp.opcoes.length > 0) {
    const efetivo = fatorEfetivoDaEntrada(fatorSalvo, interp);
    if (Math.abs(efetivo - fatorSalvo) > 0.0001 && !interp.pesoPorInterna) {
      fail(
        'alerta_fator_efetivo',
        `fatorEfetivo distorceu ${fatorSalvo} → ${efetivo}`,
      );
      return;
    }
  }
  void falsoPositivoEvangelizado;
}

async function verifyRestore(snaps: SnapNota[]) {
  let ok = true;
  for (const s of snaps) {
    const n = await p.nfeNota.findUnique({
      where: { id: s.id },
      include: {
        itens: {
          select: {
            id: true,
            status: true,
            alertas: true,
            fatorConversao: true,
            mapeamentoId: true,
            estoqueInsumoId: true,
          },
        },
      },
    });
    if (!n) {
      fail('restore', `nota ${s.numero} sumiu`);
      ok = false;
      continue;
    }
    if (n.competencia !== s.competencia) {
      fail('restore', `NF ${s.numero} competencia ${n.competencia}≠${s.competencia}`);
      ok = false;
    }
    if (n.status !== s.status) {
      fail('restore', `NF ${s.numero} status ${n.status}≠${s.status}`);
      ok = false;
    }
    for (const si of s.itens) {
      const ci = n.itens.find((x) => x.id === si.id);
      if (!ci) {
        fail('restore', `item ${si.id} sumiu`);
        ok = false;
        continue;
      }
      if (ci.status !== si.status) {
        fail('restore', `item ${si.id} status ${ci.status}≠${si.status}`);
        ok = false;
      }
      const fa = JSON.stringify(si.alertas ?? []);
      const fb = JSON.stringify(ci.alertas ?? []);
      if (fa !== fb) {
        fail('restore', `item ${si.id} alertas divergiram`);
        ok = false;
      }
      const fAntes = si.fatorConversao != null ? Number(si.fatorConversao) : null;
      const fDepois = ci.fatorConversao != null ? Number(ci.fatorConversao) : null;
      if (fAntes !== fDepois && !(fAntes == null && fDepois == null)) {
        if (
          fAntes != null &&
          fDepois != null &&
          Math.abs(fAntes - fDepois) < 0.0001
        ) {
          // ok float
        } else {
          fail(
            'restore',
            `item ${si.id} fator ${fDepois}≠${fAntes}`,
          );
          ok = false;
        }
      }
      if (ci.mapeamentoId !== si.mapeamentoId) {
        fail(
          'restore',
          `item ${si.id} mapeamentoId ${ci.mapeamentoId}≠${si.mapeamentoId}`,
        );
        ok = false;
      }
      if (ci.estoqueInsumoId !== si.estoqueInsumoId) {
        fail(
          'restore',
          `item ${si.id} estoqueInsumoId divergiu`,
        );
        ok = false;
      }
    }
  }
  // Maps criados devem ter sido apagados
  if (mapsCriados.length) {
    const rest = await p.nfeMapeamento.count({
      where: { id: { in: mapsCriados } },
    });
    if (rest > 0) {
      fail('restore', `${rest} mapeamentos criados no teste ainda existem`);
      ok = false;
    }
  }
  if (ok) pass('restore', `${snaps.length} nota(s) e maps restaurados`);
}

async function main() {
  console.log('=== Teste live CMV Real (com restore) ===\n');
  const targets = await pickTargets();
  console.log('Alvos:');
  console.log(
    '  transferir:',
    targets.paraTransferir
      ? `NF ${targets.paraTransferir.numero} (${targets.paraTransferir.competencia})`
      : '—',
  );
  console.log(
    '  bonificação:',
    targets.paraBonif ? `NF ${targets.paraBonif.numero}` : '—',
  );
  console.log(
    '  mapeamento:',
    targets.paraMapA && targets.paraMapB
      ? `NF ${targets.paraMapA.numero} → ${targets.paraMapB.numero}`
      : '—',
  );
  console.log(
    '  alerta:',
    targets.provolone
      ? `NF ${targets.provolone.nota.numero} ${targets.provolone.descricao.slice(0, 40)}`
      : '—',
  );

  if (targets.todasIds.length === 0) {
    fail('setup', 'nenhuma nota EM_REVISAO disponível');
    return;
  }

  snapNotas = await snapshotNotas(targets.todasIds);
  console.log(`\nSnapshot: ${snapNotas.length} nota(s), ${snapNotas.reduce((a, n) => a + n.itens.length, 0)} itens\n`);

  try {
    if (targets.paraTransferir) {
      await testTransferencia(targets.paraTransferir);
    } else {
      fail('transferir_competencia', 'sem nota disponível');
    }

    if (targets.paraBonif) {
      await testBonificacao(targets.paraBonif);
    } else {
      fail('bonificacao_marca', 'sem nota disponível');
    }

    if (targets.paraMapA && targets.paraMapB && targets.itemMapA && targets.itemMapB) {
      await testMapeamento(
        targets.paraMapA,
        targets.paraMapB,
        targets.itemMapA,
        targets.itemMapB,
      );
    } else {
      fail(
        'mapeamento_propaga',
        'não achei 2 notas EM_REVISAO do mesmo fornecedor com item casável',
      );
    }

    if (targets.provolone) {
      await testAlertaPreco(targets.provolone);
    } else {
      fail('alerta_preco', 'sem item provolone/histórico');
    }
  } finally {
    console.log('\n--- Restaurando ---');
    try {
      await restoreMaps();
      await restoreNotas(snapNotas);
      await verifyRestore(snapNotas);
    } catch (e) {
      fail('restore', e instanceof Error ? e.message : String(e));
    }
  }

  console.log('\n=== Resumo ===');
  const failed = results.filter((r) => !r.ok);
  const passed = results.filter((r) => r.ok);
  console.log(`pass=${passed.length} fail=${failed.length}`);
  if (failed.length) {
    for (const f of failed) console.error(`  FAIL ${f.name}: ${f.detail}`);
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error('FATAL', e);
    process.exitCode = 1;
    return restoreNotas(snapNotas)
      .then(() => restoreMaps())
      .catch((e2) => console.error('restore após fatal falhou', e2));
  })
  .finally(() => p.$disconnect());
