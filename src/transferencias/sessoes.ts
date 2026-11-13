import type { Prisma, SessaoTransferenciaEstado } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CMV_STORE_SLUGS, storeSlugFromLojaNome, type CmvStoreSlug } from '@/lib/nfe/lojas';
import { competenciaFromDataEntrada } from '@/lib/nfe/dates';
import {
  buscarCustoTransferencia,
  registrarTransferenciaCompleta,
  registrarTransferenciaDivergenteWhatsapp,
} from '@/lib/nfe/transferencia-documento';
import { gerentesDaLoja } from './gerentes';
import { converterQuantidadeParaCmv } from './quantidade';
import { canonicalizarTelefone } from './telefone';
import {
  ESTADOS_ABERTOS,
  ESTADOS_VISIVEIS_TELA,
  type CriarSessaoInput,
  type ItemSessaoTransferencia,
  type SessaoTransferenciaResumo,
} from './types';

const includeSessao = {
  gerenteOrigem: { select: { id: true, nome: true } },
  gerenteDestino: { select: { id: true, nome: true } },
} as const;

type SessaoRow = Prisma.SessaoTransferenciaGetPayload<{ include: typeof includeSessao }>;

function parseItens(raw: unknown): ItemSessaoTransferencia[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((it) => {
    const o = it as Record<string, unknown>;
    return {
      estoqueInsumoId: String(o.estoqueInsumoId || ''),
      textoOriginal: String(o.textoOriginal || ''),
      quantidade: Number(o.quantidade) || 0,
      unidade: o.unidade === 'UN' ? 'UN' : 'KG',
      quantidadeRecebida:
        o.quantidadeRecebida == null ? null : Number(o.quantidadeRecebida),
      custoUnitario: o.custoUnitario == null ? null : Number(o.custoUnitario),
      custoOrigem: o.custoOrigem == null ? null : String(o.custoOrigem),
      valorTotal: o.valorTotal == null ? null : Number(o.valorTotal),
    };
  });
}

function serializar(row: SessaoRow): SessaoTransferenciaResumo {
  return {
    id: row.id,
    codigo: row.codigo,
    tenantUserId: row.tenantUserId,
    lojaOrigem: row.lojaOrigem,
    lojaDestino: row.lojaDestino,
    gerenteOrigemId: row.gerenteOrigemId,
    gerenteOrigemNome: row.gerenteOrigem?.nome ?? null,
    gerenteDestinoId: row.gerenteDestinoId,
    gerenteDestinoNome: row.gerenteDestino?.nome ?? null,
    telefoneOrigem: row.telefoneOrigem,
    lidOrigem: row.lidOrigem,
    estado: row.estado,
    itens: parseItens(row.itens),
    mensagemOriginal: row.mensagemOriginal,
    cmvTransferenciaId: row.cmvTransferenciaId,
    lembreteEnviadoEm: row.lembreteEnviadoEm?.toISOString() ?? null,
    criadaEm: row.criadaEm.toISOString(),
    confirmacaoOrigemEm: row.confirmacaoOrigemEm?.toISOString() ?? null,
    esclarecimentoEm: row.esclarecimentoEm?.toISOString() ?? null,
    recebimentoEm: row.recebimentoEm?.toISOString() ?? null,
    concluidaEm: row.concluidaEm?.toISOString() ?? null,
    divergenteEm: row.divergenteEm?.toISOString() ?? null,
    canceladaEm: row.canceladaEm?.toISOString() ?? null,
    expiradaEm: row.expiradaEm?.toISOString() ?? null,
    atualizadaEm: row.atualizadaEm.toISOString(),
  };
}

function assertSlug(slug: string, label: string): asserts slug is CmvStoreSlug {
  if (!CMV_STORE_SLUGS.includes(slug as CmvStoreSlug)) {
    throw new Error(`${label} inválida: ${slug}`);
  }
}

async function proximoCodigo(tenantUserId: string): Promise<string> {
  const rows = await prisma.sessaoTransferencia.findMany({
    where: { tenantUserId },
    select: { codigo: true },
  });
  let max = 0;
  for (const r of rows) {
    const m = /^T(\d+)$/i.exec(r.codigo.trim());
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `T${max + 1}`;
}

async function carregarSessao(id: string): Promise<SessaoRow> {
  const row = await prisma.sessaoTransferencia.findUnique({
    where: { id },
    include: includeSessao,
  });
  if (!row) throw new Error('Sessão de transferência não encontrada');
  return row;
}

export async function listarSessoesVisiveis(params: {
  tenantUserId: string;
  storeSlugs?: string[] | null;
}): Promise<SessaoTransferenciaResumo[]> {
  const where: Prisma.SessaoTransferenciaWhereInput = {
    tenantUserId: params.tenantUserId,
    estado: { in: ESTADOS_VISIVEIS_TELA },
  };
  if (params.storeSlugs && params.storeSlugs.length > 0) {
    where.OR = [
      { lojaOrigem: { in: params.storeSlugs } },
      { lojaDestino: { in: params.storeSlugs } },
    ];
  }
  const rows = await prisma.sessaoTransferencia.findMany({
    where,
    include: includeSessao,
    orderBy: { criadaEm: 'desc' },
  });
  return rows.map(serializar);
}

export async function criarSessao(
  input: CriarSessaoInput,
): Promise<SessaoTransferenciaResumo> {
  assertSlug(input.lojaOrigem, 'Loja de origem');
  assertSlug(input.lojaDestino, 'Loja de destino');
  if (input.lojaOrigem === input.lojaDestino) {
    throw new Error('Origem e destino precisam ser lojas diferentes');
  }
  if (!input.itens.length) throw new Error('Inclua ao menos um item');

  const gerente = await prisma.rhFuncionario.findFirst({
    where: { id: input.gerenteOrigemId, userId: input.tenantUserId, ativo: true },
    include: { loja: true, cargo: true },
  });
  if (!gerente) throw new Error('Gerente de origem não encontrado');

  const slugGerente = storeSlugFromLojaNome(gerente.loja?.nome);
  if (slugGerente !== input.lojaOrigem) {
    throw new Error('Só o gerente da loja de origem pode criar a transferência');
  }

  const itens: ItemSessaoTransferencia[] = [];
  for (const it of input.itens) {
    const conv = await converterQuantidadeParaCmv({
      tenantUserId: input.tenantUserId,
      estoqueInsumoId: it.estoqueInsumoId,
      quantidade: it.quantidade,
      unidadeInformada: it.unidade,
    });
    itens.push({
      ...it,
      quantidade: conv.quantidade,
      unidade: conv.unidade,
      quantidadeRecebida: null,
      custoUnitario: null,
      custoOrigem: null,
      valorTotal: null,
    });
  }

  const codigo = await proximoCodigo(input.tenantUserId);
  const row = await prisma.sessaoTransferencia.create({
    data: {
      codigo,
      tenantUserId: input.tenantUserId,
      lojaOrigem: input.lojaOrigem,
      lojaDestino: input.lojaDestino,
      gerenteOrigemId: input.gerenteOrigemId,
      telefoneOrigem: canonicalizarTelefone(input.telefoneOrigem) || input.telefoneOrigem,
      lidOrigem: input.lidOrigem ? String(input.lidOrigem).replace(/\D/g, '') : null,
      estado: 'AGUARDANDO_CONFIRMACAO_ORIGEM',
      itens: itens as unknown as Prisma.InputJsonValue,
      mensagemOriginal: input.mensagemOriginal || null,
    },
    include: includeSessao,
  });
  return serializar(row);
}

/**
 * Congela custo (competência = data da confirmação) e avança para aguardar recebimento.
 */
export async function confirmarOrigem(params: {
  sessaoId: string;
  gerenteId: string;
  dataConfirmacao?: Date;
}): Promise<SessaoTransferenciaResumo> {
  const sessao = await carregarSessao(params.sessaoId);
  if (sessao.estado !== 'AGUARDANDO_CONFIRMACAO_ORIGEM' && sessao.estado !== 'AGUARDANDO_ESCLARECIMENTO') {
    throw new Error(`Sessão ${sessao.codigo} não está aguardando confirmação da origem`);
  }
  if (params.gerenteId !== sessao.gerenteOrigemId) {
    throw new Error('Só o gerente da loja de origem pode confirmar o envio');
  }

  const data = params.dataConfirmacao ?? new Date();
  const competencia = competenciaFromDataEntrada(data);
  const itens = parseItens(sessao.itens);
  const comCusto: ItemSessaoTransferencia[] = [];

  for (const it of itens) {
    const custo = await buscarCustoTransferencia({
      userId: sessao.tenantUserId,
      lojaOrigem: sessao.lojaOrigem,
      estoqueInsumoId: it.estoqueInsumoId,
      competencia,
    });
    if (custo.exigePreenchimento || custo.custo == null) {
      throw new Error(
        `Custo pendente para ${it.textoOriginal || it.estoqueInsumoId} — sem histórico na origem`,
      );
    }
    comCusto.push({
      ...it,
      custoUnitario: custo.custo,
      custoOrigem: custo.origem,
      valorTotal: Math.round(it.quantidade * custo.custo * 100) / 100,
    });
  }

  const row = await prisma.sessaoTransferencia.update({
    where: { id: sessao.id },
    data: {
      estado: 'AGUARDANDO_RECEBIMENTO',
      itens: comCusto as unknown as Prisma.InputJsonValue,
      confirmacaoOrigemEm: data,
    },
    include: includeSessao,
  });
  return serializar(row);
}

export async function pedirEsclarecimento(params: {
  sessaoId: string;
  gerenteId: string;
}): Promise<SessaoTransferenciaResumo> {
  const sessao = await carregarSessao(params.sessaoId);
  if (params.gerenteId !== sessao.gerenteOrigemId) {
    throw new Error('Só o gerente da origem pode pedir esclarecimento');
  }
  if (!ESTADOS_ABERTOS.includes(sessao.estado) || sessao.estado === 'AGUARDANDO_RECEBIMENTO') {
    throw new Error(`Sessão ${sessao.codigo} não aceita esclarecimento neste estado`);
  }
  const row = await prisma.sessaoTransferencia.update({
    where: { id: sessao.id },
    data: {
      estado: 'AGUARDANDO_ESCLARECIMENTO',
      esclarecimentoEm: new Date(),
    },
    include: includeSessao,
  });
  return serializar(row);
}

function qtdsIguais(enviada: number, recebida: number, tol = 0.001): boolean {
  return Math.abs(enviada - recebida) <= Math.max(tol, enviada * 0.001);
}

/**
 * Confirma recebimento. Gerente precisa ser da loja de destino.
 * Qtds iguais → CONCLUIDA + registrarTransferenciaCompleta(WHATSAPP).
 * Qtds diferentes → DIVERGENTE + doc rascunho (sem lançamento).
 */
export async function confirmarRecebimento(params: {
  sessaoId: string;
  gerenteId: string;
  /** quantidadeRecebida por estoqueInsumoId; omisso = igual ao enviado */
  quantidadesRecebidas?: Record<string, number>;
  dataRecebimento?: Date;
  actorUserId?: string;
}): Promise<SessaoTransferenciaResumo> {
  const sessao = await carregarSessao(params.sessaoId);
  if (sessao.estado !== 'AGUARDANDO_RECEBIMENTO') {
    throw new Error(`Sessão ${sessao.codigo} não está aguardando recebimento`);
  }

  const gerentesDest = await gerentesDaLoja(sessao.tenantUserId, sessao.lojaDestino);
  const gerenteOk = gerentesDest.find((g) => g.funcionarioId === params.gerenteId);
  if (!gerenteOk) {
    throw new Error('Só um gerente da loja de destino pode confirmar o recebimento');
  }

  const data = params.dataRecebimento ?? new Date();
  const itens = parseItens(sessao.itens).map((it) => {
    const recv =
      params.quantidadesRecebidas?.[it.estoqueInsumoId] ??
      it.quantidadeRecebida ??
      it.quantidade;
    return { ...it, quantidadeRecebida: recv };
  });

  const divergente = itens.some(
    (it) => !qtdsIguais(it.quantidade, it.quantidadeRecebida ?? it.quantidade),
  );

  const actorUserId = params.actorUserId || sessao.tenantUserId;
  const obs = `WhatsApp ${sessao.codigo}`;

  let cmvId: string | null = null;
  let estado: SessaoTransferenciaEstado;

  if (divergente) {
    const doc = await registrarTransferenciaDivergenteWhatsapp({
      userId: sessao.tenantUserId,
      actorUserId,
      lojaOrigem: sessao.lojaOrigem,
      lojaDestino: sessao.lojaDestino,
      data,
      observacao: obs,
      itensSaida: itens.map((it) => ({
        estoqueInsumoId: it.estoqueInsumoId,
        quantidade: it.quantidade,
        custoUnitario: it.custoUnitario,
      })),
      itensEntrada: itens.map((it) => ({
        estoqueInsumoId: it.estoqueInsumoId,
        quantidade: it.quantidadeRecebida ?? it.quantidade,
        custoUnitario: it.custoUnitario,
      })),
    });
    cmvId = doc.id;
    estado = 'DIVERGENTE';
  } else {
    const doc = await registrarTransferenciaCompleta({
      userId: sessao.tenantUserId,
      actorUserId,
      lojaOrigem: sessao.lojaOrigem,
      lojaDestino: sessao.lojaDestino,
      data: sessao.confirmacaoOrigemEm ?? data,
      observacao: obs,
      origem: 'WHATSAPP',
      itens: itens.map((it) => ({
        estoqueInsumoId: it.estoqueInsumoId,
        quantidade: it.quantidade,
        custoUnitario: it.custoUnitario,
      })),
    });
    cmvId = doc.id;
    estado = 'CONCLUIDA';
  }

  const row = await prisma.sessaoTransferencia.update({
    where: { id: sessao.id },
    data: {
      estado,
      itens: itens as unknown as Prisma.InputJsonValue,
      gerenteDestinoId: params.gerenteId,
      cmvTransferenciaId: cmvId,
      recebimentoEm: data,
      concluidaEm: estado === 'CONCLUIDA' ? data : null,
      divergenteEm: estado === 'DIVERGENTE' ? data : null,
    },
    include: includeSessao,
  });
  return serializar(row);
}

export async function registrarDivergencia(params: {
  sessaoId: string;
  gerenteId: string;
  quantidadesRecebidas: Record<string, number>;
  actorUserId?: string;
}): Promise<SessaoTransferenciaResumo> {
  return confirmarRecebimento({
    ...params,
    quantidadesRecebidas: params.quantidadesRecebidas,
  });
}

export async function cancelar(params: {
  sessaoId: string;
  /** Admin da tela ou gerente de origem */
  actorGerenteId?: string | null;
  forcar?: boolean;
}): Promise<SessaoTransferenciaResumo> {
  const sessao = await carregarSessao(params.sessaoId);
  if (!ESTADOS_ABERTOS.includes(sessao.estado) && sessao.estado !== 'DIVERGENTE') {
    throw new Error(`Sessão ${sessao.codigo} não pode ser cancelada (estado ${sessao.estado})`);
  }
  if (
    !params.forcar &&
    params.actorGerenteId &&
    params.actorGerenteId !== sessao.gerenteOrigemId
  ) {
    throw new Error('Só o gerente de origem (ou admin) pode cancelar');
  }
  if (sessao.cmvTransferenciaId && sessao.estado === 'DIVERGENTE') {
    // Soft-delete do doc CMV divergente (rascunho) para não poluir fechamento
    await prisma.cmvTransferencia.updateMany({
      where: {
        id: sessao.cmvTransferenciaId,
        userId: sessao.tenantUserId,
        origem: 'WHATSAPP',
        excluidoEm: null,
      },
      data: {
        excluidoEm: new Date(),
        excluidoPorId: params.actorGerenteId || sessao.tenantUserId,
      },
    });
  }

  const row = await prisma.sessaoTransferencia.update({
    where: { id: sessao.id },
    data: {
      estado: 'CANCELADA',
      canceladaEm: new Date(),
    },
    include: includeSessao,
  });
  return serializar(row);
}

export async function expirar(sessaoId: string): Promise<SessaoTransferenciaResumo> {
  const sessao = await carregarSessao(sessaoId);
  if (!ESTADOS_ABERTOS.includes(sessao.estado)) {
    throw new Error(`Sessão ${sessao.codigo} não está aberta`);
  }
  const row = await prisma.sessaoTransferencia.update({
    where: { id: sessao.id },
    data: {
      estado: 'EXPIRADA',
      expiradaEm: new Date(),
    },
    include: includeSessao,
  });
  return serializar(row);
}
