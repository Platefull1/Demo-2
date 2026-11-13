/**
 * CRUD de SessaoTransferencia via Prisma (worker Baileys).
 */

import prisma from '../../db/index.js';
import { canonicalizarTelefone } from './telefone.js';

const ESTADOS_ABERTOS = [
  'AGUARDANDO_CONFIRMACAO_ORIGEM',
  'AGUARDANDO_ESCLARECIMENTO',
  'AGUARDANDO_RECEBIMENTO',
];

const includeSessao = {
  gerenteOrigem: { select: { id: true, nome: true, telefone: true } },
  gerenteDestino: { select: { id: true, nome: true, telefone: true } },
};

function parseItens(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((it) => ({
    estoqueInsumoId: String(it.estoqueInsumoId || ''),
    textoOriginal: String(it.textoOriginal || ''),
    quantidade: Number(it.quantidade) || 0,
    unidade: it.unidade === 'UN' ? 'UN' : 'KG',
    quantidadeRecebida:
      it.quantidadeRecebida == null ? null : Number(it.quantidadeRecebida),
    custoUnitario: it.custoUnitario == null ? null : Number(it.custoUnitario),
    custoOrigem: it.custoOrigem == null ? null : String(it.custoOrigem),
    valorTotal: it.valorTotal == null ? null : Number(it.valorTotal),
    kgPorUnidade:
      it.kgPorUnidade == null ? null : Number(it.kgPorUnidade),
    qtdInformada:
      it.qtdInformada == null ? null : Number(it.qtdInformada),
    unidadeInformada: it.unidadeInformada || null,
  }));
}

function serializar(row) {
  return {
    ...row,
    itens: parseItens(row.itens),
    gerenteOrigemNome: row.gerenteOrigem?.nome ?? null,
    gerenteDestinoNome: row.gerenteDestino?.nome ?? null,
    gerenteOrigemTelefone: row.gerenteOrigem?.telefone ?? null,
    gerenteDestinoTelefone: row.gerenteDestino?.telefone ?? null,
  };
}

async function proximoCodigo(tenantUserId) {
  const rows = await prisma.sessaoTransferencia.findMany({
    where: { tenantUserId },
    select: { codigo: true },
  });
  let max = 0;
  for (const r of rows) {
    const m = /^T(\d+)$/i.exec(String(r.codigo || '').trim());
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `T${max + 1}`;
}

/**
 * Sessões abertas do remetente (telefone canônico ou LID).
 */
export async function getSessoesAtivas(tenantUserId, telefone, lidDigits) {
  const canon = telefone ? canonicalizarTelefone(telefone) : '';
  const lid = lidDigits ? String(lidDigits).replace(/\D/g, '') : '';
  if (!canon && !lid) return [];

  const or = [];
  if (canon) {
    or.push({ telefoneOrigem: canon });
    // Também sessões onde o gerente de destino está respondendo — match por relação
  }
  if (lid) or.push({ lidOrigem: lid });

  const rows = await prisma.sessaoTransferencia.findMany({
    where: {
      tenantUserId,
      estado: { in: ESTADOS_ABERTOS },
      OR: or.length ? or : undefined,
    },
    include: includeSessao,
    orderBy: { criadaEm: 'desc' },
  });

  // Destino: sessões AGUARDANDO_RECEBIMENTO onde o telefone/lid é de um gerente destino
  // (já filtramos telefoneOrigem; complementar via scan curto se necessário)
  let destRows = [];
  if (canon || lid) {
    destRows = await prisma.sessaoTransferencia.findMany({
      where: {
        tenantUserId,
        estado: 'AGUARDANDO_RECEBIMENTO',
        id: { notIn: rows.map((r) => r.id) },
      },
      include: includeSessao,
      orderBy: { criadaEm: 'desc' },
      take: 30,
    });
  }

  const out = [...rows];
  for (const r of destRows) {
    // Mantém; filtro fino no handler com gerentesDaLoja
    out.push(r);
  }

  return out.map(serializar);
}

export async function getSessaoPorCodigo(tenantUserId, codigo) {
  const row = await prisma.sessaoTransferencia.findFirst({
    where: {
      tenantUserId,
      codigo: String(codigo || '').trim().toUpperCase(),
    },
    include: includeSessao,
  });
  return row ? serializar(row) : null;
}

export async function criarSessaoDb(input) {
  const codigo = await proximoCodigo(input.tenantUserId);
  const row = await prisma.sessaoTransferencia.create({
    data: {
      codigo,
      tenantUserId: input.tenantUserId,
      lojaOrigem: input.lojaOrigem,
      lojaDestino: input.lojaDestino || 'ahu', // placeholder até esclarecer
      gerenteOrigemId: input.gerenteOrigemId,
      telefoneOrigem: canonicalizarTelefone(input.telefoneOrigem) || input.telefoneOrigem,
      lidOrigem: input.lidOrigem
        ? String(input.lidOrigem).replace(/\D/g, '')
        : null,
      estado: input.estado || 'AGUARDANDO_CONFIRMACAO_ORIGEM',
      itens: input.itens || [],
      mensagemOriginal: input.mensagemOriginal || null,
      esclarecimentoEm:
        input.estado === 'AGUARDANDO_ESCLARECIMENTO' ? new Date() : null,
    },
    include: includeSessao,
  });
  return serializar(row);
}

export async function atualizarSessao(id, data) {
  const row = await prisma.sessaoTransferencia.update({
    where: { id },
    data,
    include: includeSessao,
  });
  return serializar(row);
}

export { ESTADOS_ABERTOS, parseItens, serializar };
