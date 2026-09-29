/** Normalização de texto/unidade para chave de mapeamento NF-e. */

export function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Maiúsculas, sem acento, sem pontuação, espaços colapsados. */
export function normalizarDescricao(raw: string): string {
  return stripAccents(String(raw || ''))
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const UNIDADE_SINONIMOS: Record<string, string> = {
  UN: 'UN',
  UNI: 'UN',
  UNID: 'UN',
  UND: 'UN',
  U: 'UN',
  PC: 'UN',
  PCS: 'UN',
  PÇ: 'UN',
  KG: 'KG',
  KGS: 'KG',
  KILO: 'KG',
  KILOS: 'KG',
  G: 'G',
  GR: 'G',
  GRAMAS: 'G',
  CX: 'CX',
  CXA: 'CX',
  FD: 'FD',
  FARDO: 'FD',
  DP: 'DP',
  LAT: 'LAT',
  LATA: 'LAT',
  TON: 'TON',
  BIS: 'BIS',
  CJ: 'CJ',
  PCT: 'PCT',
  PACOTE: 'PCT',
};

/** Maiúsculas + sinônimos (UNID/UNI/UN → UN). */
export function normalizarUnidade(raw: string): string {
  const u = stripAccents(String(raw || ''))
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
  if (!u) return 'UN';
  return UNIDADE_SINONIMOS[u] ?? u;
}

export function chaveMapeamentoEan(ean: string): string {
  return `ean:${ean.replace(/\D/g, '')}`;
}

export function chaveMapeamentoDesc(descricaoNormalizada: string, unidade: string): string {
  return `desc:${descricaoNormalizada}|${normalizarUnidade(unidade)}`;
}

/** Digitos do CNPJ (14). */
export function normalizarCnpj(raw: string): string {
  return String(raw || '').replace(/\D/g, '').padStart(14, '0').slice(-14);
}
