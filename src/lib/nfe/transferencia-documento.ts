/**
 * Persistência de CmvTransferencia (formulário manual).
 * Import Saipos/NF fica para a etapa (f).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { competenciaFromDataEntrada } from './dates';
import { CMV_STORE_SLUGS, competenciaAnterior, type CmvStoreSlug } from './lojas';
import {
  resolverCustoUnitario,
  statusDocumento,
  type CmvTransferenciaCustoOrigem,
  type ItemLado,
} from './transferencia-concilicao';

function decimal(n: number): Prisma.Decimal {
  return new Prisma.Decimal(n);
}

function n(v: unknown): number {
  return Number(v ?? 0);
}

export type TransferenciaItemInput = {
  estoqueInsumoId: string;
  quantidade: number;
  custoUnitario?: number | null;
};

export type TransferenciaResumo = {
  id: string;
  numeroDocumento: string;
  data: string;
  competencia: string;
  lojaOrigem: string;
  lojaDestino: string;
  status: string;
  origem: string;
  observacao: string | null;
  criadoPorId: string | null;
  criadoPorNome: string | null;
  criadoEm: string;
  editadoPorId: string | null;
  editadoEm: string | null;
  lados: Array<{
    tipo: string;
    storeSlug: string;
    rascunho: boolean;
    registradoEm: string | null;
    itens: Array<{
      id: string;
      estoqueInsumoId: string;
      nome: string;
      quantidade: number;
      unidade: string;
      custoUnitario: number | null;
      valorTotal: number | null;
      custoOrigem: string | null;
    }>;
  }>;
};

export async function competenciaEstaFechada(
  userId: string,
  storeSlug: string,
  competencia: string,
) {
  const f = await prisma.cmvFechamento.findUnique({
    where: {
      userId_storeSlug_competencia: { userId, storeSlug, competencia },
    },
    select: { status: true },
  });
  return f?.status === 'FECHADO';
}

export async function buscarCustoTransferencia(params: {
  userId: string;
  lojaOrigem: string;
  estoqueInsumoId: string;
  competencia: string;
  custoInformado?: number | null;
}) {
  // Cascata de custo (ordem de preferência):
  // 1. Custo médio ponderado da competência atual na origem (garante simetria centavo a centavo)
  // 2. Custo do saldo inicial (competência anterior)
  // 3. Último custo de compra em qualquer loja
  // 4. Custo informado manualmente

  const [lancamentosOrigem, saldoIni, ultimoQualquer] = await Promise.all([
    // Todas as entradas da competência atual na loja de origem
    prisma.cmvLancamento.findMany({
      where: {
        userId: params.userId,
        storeSlug: params.lojaOrigem,
        estoqueInsumoId: params.estoqueInsumoId,
        competencia: params.competencia,
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL', 'TRANSFERENCIA_ENTRADA'] },
      },
      select: { quantidade: true, valorTotal: true },
    }),
    prisma.cmvSaldoEstoque.findUnique({
      where: {
        userId_storeSlug_competencia_estoqueInsumoId: {
          userId: params.userId,
          storeSlug: params.lojaOrigem,
          competencia: competenciaAnterior(params.competencia),
          estoqueInsumoId: params.estoqueInsumoId,
        },
      },
      select: { custoMedio: true, qtdFinal: true },
    }),
    prisma.cmvLancamento.findFirst({
      where: {
        userId: params.userId,
        estoqueInsumoId: params.estoqueInsumoId,
        tipo: { in: ['COMPRA_NFE', 'COMPRA_MANUAL'] },
        quantidade: { gt: 0 },
        valorTotal: { gt: 0 },
      },
      orderBy: { data: 'desc' },
      select: { quantidade: true, valorTotal: true },
    }),
  ]);

  // Custo médio ponderado atual: (saldoIni + entradas do período) / total qtd
  const saldoIniQtd = saldoIni ? n(saldoIni.qtdFinal) : 0;
  const saldoIniVal = saldoIni ? saldoIniQtd * n(saldoIni.custoMedio ?? 0) : 0;
  const entradasQtd = lancamentosOrigem.reduce((s, l) => s + n(l.quantidade), 0);
  const entradasVal = lancamentosOrigem.reduce((s, l) => s + n(l.valorTotal), 0);
  const totalQtd = saldoIniQtd + entradasQtd;
  const totalVal = saldoIniVal + entradasVal;
  const custoMedioAtual = totalQtd > 0 ? totalVal / totalQtd : null;

  return resolverCustoUnitario({
    // fonte primária: custo médio ponderado da competência atual na origem
    ultimoCustoOrigem: custoMedioAtual,
    custoEstoqueInicialOrigem:
      saldoIni?.custoMedio != null ? n(saldoIni.custoMedio) : null,
    ultimoCustoQualquerLoja:
      ultimoQualquer && n(ultimoQualquer.quantidade) > 0
        ? n(ultimoQualquer.valorTotal) / n(ultimoQualquer.quantidade)
        : null,
    custoInformado: params.custoInformado,
  });
}

function serializar(
  doc: {
  id: string;
  numeroDocumento: string;
  data: Date;
  competencia: string;
  lojaOrigem: string;
  lojaDestino: string;
  status: string;
  origem: string;
  observacao: string | null;
  criadoPorId: string | null;
  editadoPorId: string | null;
  editadoEm: Date | null;
  createdAt: Date;
  lados: Array<{
    tipo: string;
    storeSlug: string;
    rascunho: boolean;
    registradoEm: Date | null;
    itens: Array<{
      id: string;
      estoqueInsumoId: string;
      quantidade: Prisma.Decimal;
      unidade: string;
      custoUnitario: Prisma.Decimal | null;
      valorTotal: Prisma.Decimal | null;
      custoOrigem: string | null;
    }>;
  }>;
},
  userNomeById?: Map<string, string>,
): TransferenciaResumo {
  return {
    id: doc.id,
    numeroDocumento: doc.numeroDocumento,
    data: doc.data.toISOString(),
    competencia: doc.competencia,
    lojaOrigem: doc.lojaOrigem,
    lojaDestino: doc.lojaDestino,
    status: doc.status,
    origem: doc.origem,
    observacao: doc.observacao,
    criadoPorId: doc.criadoPorId,
    criadoPorNome: doc.criadoPorId ? (userNomeById?.get(doc.criadoPorId) ?? null) : null,
    criadoEm: doc.createdAt.toISOString(),
    editadoPorId: doc.editadoPorId,
    editadoEm: doc.editadoEm ? doc.editadoEm.toISOString() : null,
    lados: doc.lados.map((l) => ({
      tipo: l.tipo,
      storeSlug: l.storeSlug,
      rascunho: l.rascunho,
      registradoEm: l.registradoEm ? l.registradoEm.toISOString() : null,
      itens: l.itens.map((it) => ({
        id: it.id,
        estoqueInsumoId: it.estoqueInsumoId,
        nome: '',
        quantidade: n(it.quantidade),
        unidade: it.unidade,
        custoUnitario: it.custoUnitario != null ? n(it.custoUnitario) : null,
        valorTotal: it.valorTotal != null ? n(it.valorTotal) : null,
        custoOrigem: it.custoOrigem,
      })),
    })),
  };
}

const includeDoc = {
  lados: { include: { itens: true }, orderBy: { tipo: 'asc' as const } },
};

async function reconciliarELancar(params: {
  userId: string;
  transferenciaId: string;
}) {
  const doc = await prisma.cmvTransferencia.findFirst({
    where: { id: params.transferenciaId, userId: params.userId, excluidoEm: null },
    include: includeDoc,
  });
  if (!doc) return null;

  const saida = doc.lados.find((l) => l.tipo === 'SAIDA');
  const entrada = doc.lados.find((l) => l.tipo === 'ENTRADA');
  const st = statusDocumento({
    entradaRegistrada: Boolean(entrada && !entrada.rascunho),
    saidaConfirmada: Boolean(saida && !saida.rascunho),
    itensSaida: (saida?.itens ?? []).map((i) => ({
      estoqueInsumoId: i.estoqueInsumoId,
      quantidade: n(i.quantidade),
    })),
    itensEntrada: (entrada?.itens ?? []).map((i) => ({
      estoqueInsumoId: i.estoqueInsumoId,
      quantidade: n(i.quantidade),
    })),
  });

  await prisma.cmvTransferencia.update({
    where: { id: doc.id },
    data: { status: st.status },
  });

  for (const lado of doc.lados) {
    for (const item of lado.itens) {
      if (lado.rascunho) {
        await prisma.cmvLancamento.deleteMany({
          where: { transferenciaItemId: item.id },
        });
        continue;
      }
      if (item.custoUnitario == null || item.valorTotal == null) continue;
      const tipo = lado.tipo === 'SAIDA' ? 'TRANSFERENCIA_SAIDA' : 'TRANSFERENCIA_ENTRADA';
      await prisma.cmvLancamento.upsert({
        where: { transferenciaItemId: item.id },
        create: {
          userId: params.userId,
          storeSlug: lado.storeSlug,
          competencia: doc.competencia,
          data: doc.data,
          tipo,
          estoqueInsumoId: item.estoqueInsumoId,
          quantidade: item.quantidade,
          unidade: item.unidade,
          valorTotal: item.valorTotal,
          transferenciaItemId: item.id,
          lojaOrigem: doc.lojaOrigem,
          lojaDestino: doc.lojaDestino,
          observacao: `Transf. ${doc.numeroDocumento}`,
        },
        update: {
          quantidade: item.quantidade,
          valorTotal: item.valorTotal,
          data: doc.data,
          competencia: doc.competencia,
        },
      });
    }
  }

  return prisma.cmvTransferencia.findFirst({
    where: { id: doc.id },
    include: includeDoc,
  });
}

export async function listarTransferencias(params: {
  userId: string;
  storeSlugs?: string[] | null;
  competencia?: string | null;
  status?: string | null;
}): Promise<TransferenciaResumo[]> {
  const where: Prisma.CmvTransferenciaWhereInput = {
    userId: params.userId,
    excluidoEm: null,
  };
  if (params.competencia) where.competencia = params.competencia;
  if (params.status) {
    where.status = params.status as never;
  }
  if (params.storeSlugs && params.storeSlugs.length > 0) {
    where.OR = [
      { lojaOrigem: { in: params.storeSlugs } },
      { lojaDestino: { in: params.storeSlugs } },
    ];
  }

  const docs = await prisma.cmvTransferencia.findMany({
    where,
    include: includeDoc,
    orderBy: { data: 'desc' },
    take: 200,
  });
<<<<<<< Updated upstream

  // Busca nomes em batch para evitar N+1
  const userIds = [...new Set(docs.map((d) => d.criadoPorId).filter((id): id is string => id != null))];
  const users = userIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, fullName: true, name: true },
      })
    : [];
  const userNomeById = new Map(users.map((u) => [u.id, u.fullName || u.name || u.id]));

  return docs.map((doc) => serializar(doc, userNomeById));
=======
  return preencherNomesLista(docs.map(serializar));
}

function aplicarNomes(
  resumo: TransferenciaResumo,
  nomes: Map<string, string>,
): TransferenciaResumo {
  return {
    ...resumo,
    lados: resumo.lados.map((l) => ({
      ...l,
      itens: l.itens.map((it) => ({
        ...it,
        nome: nomes.get(it.estoqueInsumoId) || it.nome || it.estoqueInsumoId,
      })),
    })),
  };
}

async function nomesDeItens(docs: TransferenciaResumo[]) {
  const ids = [
    ...new Set(
      docs.flatMap((d) =>
        d.lados.flatMap((l) => l.itens.map((i) => i.estoqueInsumoId)),
      ),
    ),
  ];
  if (ids.length === 0) return new Map<string, string>();
  const insumos = await prisma.estoqueInsumo.findMany({
    where: { id: { in: ids } },
    select: { id: true, nome: true },
  });
  return new Map(insumos.map((i) => [i.id, i.nome]));
}

async function preencherNomesLista(docs: TransferenciaResumo[]) {
  const nomes = await nomesDeItens(docs);
  return docs.map((d) => aplicarNomes(d, nomes));
}

async function preencherNomes(resumo: TransferenciaResumo): Promise<TransferenciaResumo> {
  const nomes = await nomesDeItens([resumo]);
  return aplicarNomes(resumo, nomes);
>>>>>>> Stashed changes
}

export async function obterTransferencia(params: {
  userId: string;
  id: string;
}): Promise<TransferenciaResumo | null> {
  const doc = await prisma.cmvTransferencia.findFirst({
    where: { id: params.id, userId: params.userId, excluidoEm: null },
    include: includeDoc,
  });
  return doc ? preencherNomes(serializar(doc)) : null;
}

export async function registrarLadoManual(params: {
  userId: string;
  actorUserId: string;
  tipoLado: 'SAIDA' | 'ENTRADA';
  lojaOrigem: string;
  lojaDestino: string;
  data: Date;
  numeroDocumento: string;
  observacao?: string | null;
  itens: TransferenciaItemInput[];
}): Promise<TransferenciaResumo> {
  if (!CMV_STORE_SLUGS.includes(params.lojaOrigem as CmvStoreSlug)) {
    throw new Error('lojaOrigem inválida');
  }
  if (!CMV_STORE_SLUGS.includes(params.lojaDestino as CmvStoreSlug)) {
    throw new Error('lojaDestino inválida');
  }
  if (params.lojaOrigem === params.lojaDestino) {
    throw new Error('Origem e destino precisam ser lojas diferentes');
  }
  const numero = params.numeroDocumento.trim();
  if (!numero) throw new Error('Número do documento é obrigatório');
  if (!params.itens.length) throw new Error('Inclua ao menos um item');

  const competencia = competenciaFromDataEntrada(params.data);
  const storeDoLado = params.tipoLado === 'SAIDA' ? params.lojaOrigem : params.lojaDestino;
  if (await competenciaEstaFechada(params.userId, storeDoLado, competencia)) {
    throw new Error('Competência fechada — reabra para lançar');
  }

  const ids = [...new Set(params.itens.map((i) => i.estoqueInsumoId))];
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: params.userId, estoqueInsumoId: { in: ids }, ativo: true },
  });
  const cfgBy = new Map(configs.map((c) => [c.estoqueInsumoId, c]));

  const resolvidos: Array<{
    estoqueInsumoId: string;
    quantidade: number;
    unidade: 'KG' | 'UN';
    custo: number;
    valorTotal: number;
    custoOrigem: CmvTransferenciaCustoOrigem;
  }> = [];

  for (const it of params.itens) {
    const cfg = cfgBy.get(it.estoqueInsumoId);
    if (!cfg) throw new Error('Produto CMV não encontrado');
    if (!(it.quantidade > 0)) throw new Error('Quantidade inválida');
    const custo = await buscarCustoTransferencia({
      userId: params.userId,
      lojaOrigem: params.lojaOrigem,
      estoqueInsumoId: it.estoqueInsumoId,
      competencia,
      custoInformado: it.custoUnitario,
    });
    if (custo.exigePreenchimento || custo.custo == null) {
      throw new Error(
        'Custo manual obrigatório: sem histórico na origem nem em outra loja',
      );
    }
    resolvidos.push({
      estoqueInsumoId: it.estoqueInsumoId,
      quantidade: it.quantidade,
      unidade: cfg.unidade,
      custo: custo.custo,
      valorTotal: Math.round(it.quantidade * custo.custo * 100) / 100,
      custoOrigem: custo.origem,
    });
  }

  const existente = await prisma.cmvTransferencia.findUnique({
    where: {
      userId_numeroDocumento_lojaOrigem_lojaDestino: {
        userId: params.userId,
        numeroDocumento: numero,
        lojaOrigem: params.lojaOrigem,
        lojaDestino: params.lojaDestino,
      },
    },
    include: includeDoc,
  });

  if (existente?.excluidoEm) {
    throw new Error('Já existe um documento excluído com este número');
  }

  let transferenciaId: string;
  if (!existente) {
    const created = await prisma.cmvTransferencia.create({
      data: {
        userId: params.userId,
        numeroDocumento: numero,
        data: params.data,
        competencia,
        lojaOrigem: params.lojaOrigem,
        lojaDestino: params.lojaDestino,
        status: params.tipoLado === 'SAIDA' ? 'AGUARDANDO_ENTRADA' : 'AGUARDANDO_SAIDA',
        origem: 'MANUAL',
        observacao: params.observacao || null,
        criadoPorId: params.actorUserId,
        lados: {
          create: {
            tipo: params.tipoLado,
            storeSlug: storeDoLado,
            registradoPorId: params.actorUserId,
            registradoEm: new Date(),
            rascunho: false,
            itens: {
              create: resolvidos.map((it) => ({
                estoqueInsumoId: it.estoqueInsumoId,
                quantidade: decimal(it.quantidade),
                unidade: it.unidade,
                custoUnitario: decimal(it.custo),
                valorTotal: decimal(it.valorTotal),
                custoOrigem: it.custoOrigem,
              })),
            },
          },
        },
      },
    });
    transferenciaId = created.id;
  } else {
    const ja = existente.lados.find((l) => l.tipo === params.tipoLado);
    if (ja && !ja.rascunho) {
      throw new Error('Este lado já foi registrado neste documento');
    }
    if (ja) {
      await prisma.cmvTransferenciaItem.deleteMany({ where: { ladoId: ja.id } });
      await prisma.cmvTransferenciaLado.update({
        where: { id: ja.id },
        data: {
          rascunho: false,
          registradoPorId: params.actorUserId,
          registradoEm: new Date(),
        },
      });
      await prisma.cmvTransferenciaItem.createMany({
        data: resolvidos.map((it) => ({
          ladoId: ja.id,
          estoqueInsumoId: it.estoqueInsumoId,
          quantidade: decimal(it.quantidade),
          unidade: it.unidade,
          custoUnitario: decimal(it.custo),
          valorTotal: decimal(it.valorTotal),
          custoOrigem: it.custoOrigem,
        })),
      });
    } else {
      await prisma.cmvTransferenciaLado.create({
        data: {
          transferenciaId: existente.id,
          tipo: params.tipoLado,
          storeSlug: storeDoLado,
          registradoPorId: params.actorUserId,
          registradoEm: new Date(),
          rascunho: false,
          itens: {
            create: resolvidos.map((it) => ({
              estoqueInsumoId: it.estoqueInsumoId,
              quantidade: decimal(it.quantidade),
              unidade: it.unidade,
              custoUnitario: decimal(it.custo),
              valorTotal: decimal(it.valorTotal),
              custoOrigem: it.custoOrigem,
            })),
          },
        },
      });
    }
    transferenciaId = existente.id;
  }

  const fresh = await reconciliarELancar({
    userId: params.userId,
    transferenciaId,
  });
  if (!fresh) throw new Error('Falha ao gravar transferência');
  return serializar(fresh);
}

export async function excluirTransferencia(params: {
  userId: string;
  actorUserId: string;
  id: string;
}): Promise<void> {
  const doc = await prisma.cmvTransferencia.findFirst({
    where: { id: params.id, userId: params.userId, excluidoEm: null },
    include: includeDoc,
  });
  if (!doc) throw new Error('Transferência não encontrada');
  // CONCILIADA bloqueada apenas para origens não-manuais (Saipos/NF-e).
  // Transferências manuais CONCILIADAS podem ser excluídas enquanto o mês estiver aberto.
  if (doc.status === 'CONCILIADA' && doc.origem !== 'MANUAL') {
    throw new Error('Documento conciliado — não é possível excluir');
  }
  for (const lado of doc.lados) {
    if (await competenciaEstaFechada(params.userId, lado.storeSlug, doc.competencia)) {
      throw new Error('Competência fechada — não é possível excluir');
    }
  }
  const itemIds = doc.lados.flatMap((l) => l.itens.map((i) => i.id));
  if (itemIds.length) {
    await prisma.cmvLancamento.deleteMany({
      where: { transferenciaItemId: { in: itemIds } },
    });
  }
  await prisma.cmvTransferencia.update({
    where: { id: doc.id },
    data: { excluidoEm: new Date(), excluidoPorId: params.actorUserId },
  });
}

// ─── Helpers internos ────────────────────────────────────────────────────────

/** Gera um número de documento automático legível: TRF-YYYYMMDD-XXXX */
function gerarNumeroDocumento(data: Date): string {
  const y = data.getUTCFullYear();
  const m = String(data.getUTCMonth() + 1).padStart(2, '0');
  const d = String(data.getUTCDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRF-${y}${m}${d}-${rand}`;
}

/** Resolve custo + valida item para transferência. Reutilizado por completa e atualizar. */
async function resolverItensParaTransferencia(params: {
  userId: string;
  lojaOrigem: string;
  competencia: string;
  itens: TransferenciaItemInput[];
}): Promise<
  Array<{
    estoqueInsumoId: string;
    quantidade: number;
    unidade: 'KG' | 'UN';
    custo: number;
    valorTotal: number;
    custoOrigem: CmvTransferenciaCustoOrigem;
  }>
> {
  if (!params.itens.length) throw new Error('Inclua ao menos um item');
  const ids = [...new Set(params.itens.map((i) => i.estoqueInsumoId))];
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: params.userId, estoqueInsumoId: { in: ids }, ativo: true },
  });
  const cfgBy = new Map(configs.map((c) => [c.estoqueInsumoId, c]));

  const resultado: Awaited<ReturnType<typeof resolverItensParaTransferencia>> = [];
  for (const it of params.itens) {
    const cfg = cfgBy.get(it.estoqueInsumoId);
    if (!cfg) throw new Error('Produto CMV não encontrado no catálogo');
    if (!(it.quantidade > 0)) throw new Error('Quantidade deve ser maior que zero');
    const custo = await buscarCustoTransferencia({
      userId: params.userId,
      lojaOrigem: params.lojaOrigem,
      estoqueInsumoId: it.estoqueInsumoId,
      competencia: params.competencia,
      custoInformado: it.custoUnitario,
    });
    if (custo.exigePreenchimento || custo.custo == null) {
      throw new Error('Custo manual obrigatório: sem histórico na origem nem em outra loja');
    }
    resultado.push({
      estoqueInsumoId: it.estoqueInsumoId,
      quantidade: it.quantidade,
      unidade: cfg.unidade,
      custo: custo.custo,
      valorTotal: Math.round(it.quantidade * custo.custo * 100) / 100,
      custoOrigem: custo.origem,
    });
  }
  return resultado;
}

// ─── Registro bilateral ───────────────────────────────────────────────────────

/**
 * Registra uma transferência bilateral de uma vez:
 * cria o documento, os dois lados (SAIDA + ENTRADA) e os lançamentos CMV
 * em transação atômica. Status final = CONCILIADA.
 *
 * Não requer `numeroDocumento` nem `tipoLado` — ambos são gerenciados internamente.
 */
export async function registrarTransferenciaCompleta(params: {
  userId: string;
  actorUserId: string;
  lojaOrigem: string;
  lojaDestino: string;
  data: Date;
  observacao?: string | null;
  itens: TransferenciaItemInput[];
}): Promise<TransferenciaResumo> {
  if (!CMV_STORE_SLUGS.includes(params.lojaOrigem as CmvStoreSlug)) {
    throw new Error('Loja de origem inválida');
  }
  if (!CMV_STORE_SLUGS.includes(params.lojaDestino as CmvStoreSlug)) {
    throw new Error('Loja de destino inválida');
  }
  if (params.lojaOrigem === params.lojaDestino) {
    throw new Error('Origem e destino precisam ser lojas diferentes');
  }

  // Data não pode ser futura (UTC noon como referência)
  const hoje = new Date();
  hoje.setUTCHours(23, 59, 59, 999);
  if (params.data > hoje) {
    throw new Error('A data da transferência não pode ser futura');
  }

  const competencia = competenciaFromDataEntrada(params.data);

  if (await mesFechado(params.userId, params.lojaOrigem, competencia)) {
    throw new Error(`Competência ${competencia} fechada na loja de origem`);
  }
  if (await mesFechado(params.userId, params.lojaDestino, competencia)) {
    throw new Error(`Competência ${competencia} fechada na loja de destino`);
  }

  const resolvidos = await resolverItensParaTransferencia({
    userId: params.userId,
    lojaOrigem: params.lojaOrigem,
    competencia,
    itens: params.itens,
  });

  // Gera número único; garante unicidade re-tentando em colisão (improvável)
  let numeroDocumento = gerarNumeroDocumento(params.data);
  let tentativas = 0;
  while (tentativas < 5) {
    const existe = await prisma.cmvTransferencia.findUnique({
      where: {
        userId_numeroDocumento_lojaOrigem_lojaDestino: {
          userId: params.userId,
          numeroDocumento,
          lojaOrigem: params.lojaOrigem,
          lojaDestino: params.lojaDestino,
        },
      },
      select: { id: true },
    });
    if (!existe) break;
    numeroDocumento = gerarNumeroDocumento(params.data);
    tentativas++;
  }

  const agora = new Date();
  const itensCreate = resolvidos.map((it) => ({
    estoqueInsumoId: it.estoqueInsumoId,
    quantidade: decimal(it.quantidade),
    unidade: it.unidade,
    custoUnitario: decimal(it.custo),
    valorTotal: decimal(it.valorTotal),
    custoOrigem: it.custoOrigem,
  }));

  const created = await prisma.cmvTransferencia.create({
    data: {
      userId: params.userId,
      numeroDocumento,
      data: params.data,
      competencia,
      lojaOrigem: params.lojaOrigem,
      lojaDestino: params.lojaDestino,
      status: 'CONCILIADA',
      origem: 'MANUAL',
      observacao: params.observacao || null,
      criadoPorId: params.actorUserId,
      lados: {
        create: [
          {
            tipo: 'SAIDA' as const,
            storeSlug: params.lojaOrigem,
            registradoPorId: params.actorUserId,
            registradoEm: agora,
            rascunho: false,
            itens: { create: itensCreate },
          },
          {
            tipo: 'ENTRADA' as const,
            storeSlug: params.lojaDestino,
            registradoPorId: params.actorUserId,
            registradoEm: agora,
            rascunho: false,
            itens: { create: itensCreate },
          },
        ],
      },
    },
    include: includeDoc,
  });

  // Gera CmvLancamentos para ambos os lados
  await reconciliarELancar({ userId: params.userId, transferenciaId: created.id });

  const fresh = await prisma.cmvTransferencia.findFirstOrThrow({
    where: { id: created.id },
    include: includeDoc,
  });
  return serializar(fresh);
}

// ─── Edição ───────────────────────────────────────────────────────────────────

/**
 * Edita data, observação e itens de uma transferência MANUAL existente.
 * Bloqueia se qualquer mês envolvido estiver fechado.
 * Grava editadoPorId + editadoEm.
 */
export async function atualizarTransferencia(params: {
  userId: string;
  actorUserId: string;
  id: string;
  data?: Date;
  observacao?: string | null;
  itens: TransferenciaItemInput[];
}): Promise<TransferenciaResumo> {
  const doc = await prisma.cmvTransferencia.findFirst({
    where: { id: params.id, userId: params.userId, excluidoEm: null },
    include: includeDoc,
  });
  if (!doc) throw new Error('Transferência não encontrada');
  if (doc.origem !== 'MANUAL') {
    throw new Error('Somente transferências manuais podem ser editadas aqui');
  }

  const novaData = params.data ?? doc.data;

  // Data não pode ser futura
  const hoje = new Date();
  hoje.setUTCHours(23, 59, 59, 999);
  if (novaData > hoje) {
    throw new Error('A data da transferência não pode ser futura');
  }

  const novaCompetencia = competenciaFromDataEntrada(novaData);

  // Verificar mês fechado para ambas as lojas (competência nova e antiga, se mudou)
  const competenciasAVerificar = new Set([doc.competencia, novaCompetencia]);
  for (const comp of competenciasAVerificar) {
    if (await mesFechado(params.userId, doc.lojaOrigem, comp)) {
      throw new Error(`Competência ${comp} fechada na loja de origem`);
    }
    if (await mesFechado(params.userId, doc.lojaDestino, comp)) {
      throw new Error(`Competência ${comp} fechada na loja de destino`);
    }
  }

  const resolvidos = await resolverItensParaTransferencia({
    userId: params.userId,
    lojaOrigem: doc.lojaOrigem,
    competencia: novaCompetencia,
    itens: params.itens,
  });

  const itensCreate = resolvidos.map((it) => ({
    estoqueInsumoId: it.estoqueInsumoId,
    quantidade: decimal(it.quantidade),
    unidade: it.unidade,
    custoUnitario: decimal(it.custo),
    valorTotal: decimal(it.valorTotal),
    custoOrigem: it.custoOrigem,
  }));

  // Remover lançamentos antigos e recriar itens dos dois lados
  const todosItemIds = doc.lados.flatMap((l) => l.itens.map((i) => i.id));
  await prisma.$transaction(async (tx) => {
    if (todosItemIds.length) {
      await tx.cmvLancamento.deleteMany({
        where: { transferenciaItemId: { in: todosItemIds } },
      });
      await tx.cmvTransferenciaItem.deleteMany({
        where: { id: { in: todosItemIds } },
      });
    }

    for (const lado of doc.lados) {
      await tx.cmvTransferenciaItem.createMany({
        data: itensCreate.map((it) => ({ ladoId: lado.id, ...it })),
      });
    }

    await tx.cmvTransferencia.update({
      where: { id: doc.id },
      data: {
        data: novaData,
        competencia: novaCompetencia,
        observacao: params.observacao !== undefined ? params.observacao : doc.observacao,
        editadoPorId: params.actorUserId,
        editadoEm: new Date(),
      },
    });
  });

  await reconciliarELancar({ userId: params.userId, transferenciaId: doc.id });

  const fresh = await prisma.cmvTransferencia.findFirstOrThrow({
    where: { id: doc.id },
    include: includeDoc,
  });
  return serializar(fresh);
}

export function itensDoLado(doc: TransferenciaResumo, tipo: 'SAIDA' | 'ENTRADA'): ItemLado[] {
  const lado = doc.lados.find((l) => l.tipo === tipo);
  return (lado?.itens ?? []).map((i) => ({
    estoqueInsumoId: i.estoqueInsumoId,
    quantidade: i.quantidade,
  }));
}
