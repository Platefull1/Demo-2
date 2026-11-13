import prisma from '../../db/index.js';
import { cacheGet, cacheSet } from './cache.js';
import { canonicalizarTelefone } from './telefone.js';
import { cargoFamilia, storeSlugFromLojaNome } from './labels.js';

const includeGerente = {
  loja: { select: { id: true, nome: true } },
  cargo: { select: { nome: true } },
};

function mapGerente(f) {
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

/**
 * @param {string} tenantUserId
 * @param {string|null} telefone
 * @param {string|null} lid
 * @returns {Promise<object|null>}
 */
export async function identificarGerente(tenantUserId, telefone, lid) {
  const canon = telefone ? canonicalizarTelefone(telefone) : '';
  const lidDigits = lid ? String(lid).replace(/\D/g, '') : '';
  if (!canon && !lidDigits) return null;

  const cacheKey = `ger:${tenantUserId}:${canon || ''}:${lidDigits || ''}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

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

  if (matched.length !== 1) {
    return cacheSet(cacheKey, null);
  }

  try {
    return cacheSet(cacheKey, mapGerente(matched[0]));
  } catch {
    return cacheSet(cacheKey, null);
  }
}

/**
 * @param {string} tenantUserId
 * @param {string} storeSlug
 */
export async function gerentesDaLoja(tenantUserId, storeSlug) {
  const cacheKey = `gersloja:${tenantUserId}:${storeSlug}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  const lojas = await prisma.rhLoja.findMany({
    where: { userId: tenantUserId, ativo: true },
    select: { id: true, nome: true },
  });
  const lojaIds = lojas
    .filter((l) => storeSlugFromLojaNome(l.nome) === storeSlug)
    .map((l) => l.id);
  if (!lojaIds.length) return cacheSet(cacheKey, []);

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

  const out = [];
  for (const f of funcionarios) {
    if (!f.cargo || cargoFamilia(f.cargo.nome) !== 'Gerente') continue;
    try {
      out.push(mapGerente(f));
    } catch {
      /* loja sem slug */
    }
  }
  return cacheSet(cacheKey, out);
}
