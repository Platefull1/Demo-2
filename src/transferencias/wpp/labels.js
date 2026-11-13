export const CMV_STORE_LABELS = {
  ahu: 'Ahú',
  pilarzinho: 'Pilarzinho',
  portao: 'Portão',
  uberaba: 'Uberaba',
};

export const CMV_STORE_SLUGS = ['ahu', 'pilarzinho', 'portao', 'uberaba'];

export function storeLabel(slug) {
  return CMV_STORE_LABELS[slug] || slug || '—';
}

const LOJA_NOME_ALIASES = {
  ahu: 'ahu',
  ahuu: 'ahu',
  ahú: 'ahu',
  'calenzano ahu': 'ahu',
  'calenzano ahú': 'ahu',
  pilarzinho: 'pilarzinho',
  'calenzano pilarzinho': 'pilarzinho',
  portao: 'portao',
  portão: 'portao',
  'calenzano portao': 'portao',
  'calenzano portão': 'portao',
  uberaba: 'uberaba',
  'calenzano uberaba': 'uberaba',
};

function normalizarLojaNome(nome) {
  return String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function storeSlugFromLojaNome(lojaNome) {
  if (!lojaNome) return null;
  const n = normalizarLojaNome(lojaNome);
  if (!n) return null;
  if (LOJA_NOME_ALIASES[n]) return LOJA_NOME_ALIASES[n];
  for (const slug of CMV_STORE_SLUGS) {
    if (n === slug || n.includes(slug)) return slug;
  }
  if (n.includes('ahu')) return 'ahu';
  if (n.includes('pilar')) return 'pilarzinho';
  if (n.includes('porta')) return 'portao';
  if (n.includes('uber')) return 'uberaba';
  return null;
}

export function cargoFamilia(nome) {
  return String(nome || '')
    .replace(/\s+[IVX]+$/i, '')
    .trim();
}

export function formatQtd(n) {
  return Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}
