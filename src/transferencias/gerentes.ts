import { prisma } from '@/lib/prisma';
import { cargoFamilia } from '@/lib/rh-cargo-familia';
import { storeSlugFromLojaNome, type CmvStoreSlug } from '@/lib/nfe/lojas';
import { canonicalizarTelefone } from './telefone';
import type { GerenteIdentificado } from './types';

function mapGerente(f: {
  id: string;
  nome: string;
  telefone: string | null;
  whatsappLid: string | null;
  lojaId: string | null;
  loja: { id: string; nome: string } | null;
  cargo: { nome: string } | null;
}): GerenteIdentificado {
  if (!f.loja || !f.lojaId) {
    throw new Error(`Gerente ${f.nome} sem loja vinculada no RH`);
  }
  const storeSlug = storeSlugFromLojaNome(f.loja.nome);
  if (!storeSlug) {
    throw new Error(
      `Loja RH "${f.loja.nome}" não mapeia para slug CMV (ahu/pilarzinho/portao/uberaba)`,
    );
  }
  return {
    funcionarioId: f.id,
    nome: f.nome,
    telefone: f.telefone,
    whatsappLid: f.whatsappLid,
    lojaId: f.lojaId,
    lojaNome: f.loja.nome,
    storeSlug,
    cargoNome: f.cargo?.nome ?? '',
  };
}

const includeGerente = {
  loja: { select: { id: true, nome: true } },
  cargo: { select: { nome: true } },
} as const;

/**
 * Identifica gerente ativo do tenant pelo telefone canônico OU whatsappLid.
 */
export async function identificarGerente(
  tenantUserId: string,
  telefone: string | null | undefined,
  lid?: string | null,
): Promise<GerenteIdentificado> {
  const canon = telefone ? canonicalizarTelefone(telefone) : '';
  const lidDigits = lid ? String(lid).replace(/\D/g, '') : '';

  if (!canon && !lidDigits) {
    throw new Error('Informe telefone ou LID do remetente');
  }

  // Busca ampla + filtro em memória: telefone no RH costuma ter máscara
  // ("(41) 9…"), então `contains` só com dígitos não casa.
  const candidatos = await prisma.rhFuncionario.findMany({
    where: {
      userId: tenantUserId,
      ativo: true,
      cargo: { isNot: null },
      lojaId: { not: null },
      OR: [
        ...(lidDigits ? [{ whatsappLid: lidDigits }] : []),
        { telefone: { not: null } },
      ],
    },
    include: includeGerente,
  });

  const gerentes = candidatos.filter(
    (f) => f.cargo && cargoFamilia(f.cargo.nome) === 'Gerente',
  );

  const matched = gerentes.filter((f) => {
    if (lidDigits && f.whatsappLid && f.whatsappLid === lidDigits) return true;
    if (canon && f.telefone && canonicalizarTelefone(f.telefone) === canon) return true;
    return false;
  });

  if (matched.length === 0) {
    throw new Error('Nenhum gerente ativo encontrado para este remetente');
  }
  if (matched.length > 1) {
    throw new Error('Mais de um gerente ativo bate com este telefone/LID — revise o cadastro RH');
  }

  return mapGerente(matched[0]);
}

/**
 * Todos os gerentes ativos da loja (slug CMV). Destino pode ter vários;
 * o primeiro que confirmar recebimento vale.
 */
export async function gerentesDaLoja(
  tenantUserId: string,
  storeSlug: CmvStoreSlug | string,
): Promise<GerenteIdentificado[]> {
  const lojas = await prisma.rhLoja.findMany({
    where: { userId: tenantUserId, ativo: true },
    select: { id: true, nome: true },
  });
  const lojaIds = lojas
    .filter((l) => storeSlugFromLojaNome(l.nome) === storeSlug)
    .map((l) => l.id);

  if (lojaIds.length === 0) {
    throw new Error(`Nenhuma loja RH mapeia para o slug "${storeSlug}"`);
  }

  const funcionarios = await prisma.rhFuncionario.findMany({
    where: {
      userId: tenantUserId,
      ativo: true,
      lojaId: { in: lojaIds },
      cargo: { isNot: null },
    },
    include: includeGerente,
    orderBy: { nome: 'asc' },
  });

  return funcionarios
    .filter((f) => f.cargo && cargoFamilia(f.cargo.nome) === 'Gerente')
    .map(mapGerente);
}

/** Resolve o tenant CMV dono a partir do WhatsAppBot.id configurado. */
export async function tenantPorWhatsappBotId(botId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { transferenciasWhatsappBotId: botId },
    select: { id: true },
  });
  return user?.id ?? null;
}
