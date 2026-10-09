/**
 * Tipos e helpers da revisão de reclamações (Central de Relatórios).
 * Sem lógica de API — só shape e organização client-side.
 */

export type ReviewCanalFilter = 'todas' | 'conversas' | 'grupos' | 'semLoja';
export type AtaFilter = 'todas' | 'na_ata' | 'fora';

export interface ComplaintEvidence {
  id: string;
  messageType: string;
  snippet: string;
  hasMedia?: boolean;
  timestamp: string;
}

export interface ComplaintReviewItem {
  id: string;
  contactId: string;
  contactName: string | null;
  contactPhone: string;
  clientLabel: string;
  numeroPedido: string | null;
  resumo: string;
  dataOcorrencia: string;
  confirmadoPorHumano: boolean;
  sessionSlot?: number;
  origem?: string;
  lojaGrupo?: string | null;
  sessionLabel?: string;
  origemLabel?: string;
  evidencias: ComplaintEvidence[];
  categoria?: string | null;
  lojaId?: string | null;
  lojaIdentificada?: boolean;
  entregadorId?: string | null;
  ridersDisponiveis?: { id: string; name: string }[];
}

export interface ComplaintConversationMessage {
  id: string;
  direction: string;
  speaker: 'CLIENTE' | 'ATENDENTE' | 'IA';
  messageType: string;
  snippet: string;
  hasMedia?: boolean;
  timestamp: string;
}

export interface ComplaintConversation {
  contactId: string;
  contactPhone: string;
  contactName: string | null;
  clientLabel: string;
  truncated: boolean;
  messages: ComplaintConversationMessage[];
}

export interface LojaOption {
  id: string;
  nome: string;
}

export interface ComplaintReviewData {
  id: string;
  periodStart: string;
  status: string;
  totalReclamacoes: number | null;
  confirmadasCount: number;
  hasAta: boolean;
  complaints: ComplaintReviewItem[];
  lojas: LojaOption[];
  ridersPorLoja: Record<string, { id: string; name: string }[]>;
}

export interface LojaGroup {
  lojaKey: string;
  items: ComplaintReviewItem[];
}

export interface OrganizedReview {
  conversasPorLoja: LojaGroup[];
  semLoja: ComplaintReviewItem[];
  gruposPorLoja: LojaGroup[];
  counts: {
    conversas: number;
    semLoja: number;
    grupos: number;
    total: number;
  };
  lojaNames: string[];
}

export const CATEGORIA_LABELS: Record<string, string> = {
  QUALIDADE: 'Qualidade',
  PIZZA_VIRADA: 'Pizza Virada',
  ESQUECEU_BEBIDA: 'Esqueceu Bebida',
  PEDIDO_ERRADO: 'Pedido Errado',
  PEDIDO_ATRASADO: 'Pedido Atrasado',
  OUTROS: 'Outros',
};

/** Bolinha de cor por etiqueta — tokens do design system (nunca badge cheia). */
export const CATEGORIA_DOT: Record<string, string> = {
  QUALIDADE: 'bg-destructive',
  PIZZA_VIRADA: 'bg-warning',
  ESQUECEU_BEBIDA: 'bg-warning',
  PEDIDO_ERRADO: 'bg-primary',
  PEDIDO_ATRASADO: 'bg-muted-foreground',
  OUTROS: 'bg-muted-foreground',
};

export const CATEGORIAS_COM_ENTREGADOR = [
  'PIZZA_VIRADA',
  'ESQUECEU_BEBIDA',
  'PEDIDO_ERRADO',
];

export function resolveLojaNome(
  c: ComplaintReviewItem,
  lojaById: Map<string, string>,
): string | null {
  return (c.lojaId ? lojaById.get(c.lojaId) : null) ?? c.lojaGrupo ?? null;
}

export function isGrupoComplaint(c: ComplaintReviewItem): boolean {
  if (String(c.origem || '').toUpperCase() === 'GRUPO_IFOOD') return true;
  if (c.lojaGrupo && String(c.lojaGrupo).trim()) return true;
  const contactId = String(c.contactId || '');
  if (contactId.includes('@g.us')) return true;
  const label = String(c.origemLabel || '').toLowerCase();
  if (label.includes('ifood')) return true;
  return false;
}

function toSortedLojaGroups(
  map: Record<string, ComplaintReviewItem[]>,
): LojaGroup[] {
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([lojaKey, items]) => ({ lojaKey, items }));
}

export function organizeReviewComplaints(
  complaints: ComplaintReviewItem[],
  lojas: LojaOption[],
): OrganizedReview {
  const lojaById = new Map(lojas.map((l) => [l.id, l.nome]));
  const conversasMap: Record<string, ComplaintReviewItem[]> = {};
  const gruposMap: Record<string, ComplaintReviewItem[]> = {};
  const semLoja: ComplaintReviewItem[] = [];

  for (const c of complaints) {
    if (isGrupoComplaint(c)) {
      const nome = resolveLojaNome(c, lojaById) ?? c.lojaGrupo ?? 'Grupo sem loja';
      (gruposMap[nome] ??= []).push(c);
      continue;
    }

    const nome = resolveLojaNome(c, lojaById);
    if (!nome || c.lojaIdentificada === false) {
      semLoja.push(c);
      continue;
    }
    (conversasMap[nome] ??= []).push(c);
  }

  const conversasPorLoja = toSortedLojaGroups(conversasMap);
  const gruposPorLoja = toSortedLojaGroups(gruposMap);
  const lojaNames = Array.from(
    new Set([
      ...conversasPorLoja.map((g) => g.lojaKey),
      ...gruposPorLoja.map((g) => g.lojaKey),
    ]),
  ).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  return {
    conversasPorLoja,
    semLoja,
    gruposPorLoja,
    counts: {
      conversas: conversasPorLoja.reduce((n, g) => n + g.items.length, 0),
      semLoja: semLoja.length,
      grupos: gruposPorLoja.reduce((n, g) => n + g.items.length, 0),
      total: complaints.length,
    },
    lojaNames,
  };
}

export function periodLabel(isoStart: string): string {
  const d = new Date(isoStart);
  const month = d.toLocaleString('pt-BR', {
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  });
  const year = d.toLocaleString('pt-BR', {
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)}/${year}`;
}

export function ptDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

export function ptDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
}

export function itemDisplayName(c: ComplaintReviewItem): string {
  if (c.clientLabel) return c.clientLabel;
  const isGrupo = isGrupoComplaint(c);
  return `${c.contactName || (isGrupo ? 'Grupo' : 'Cliente')} — ${c.contactPhone || c.contactId}`;
}

export function matchesSearch(c: ComplaintReviewItem, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    itemDisplayName(c).toLowerCase().includes(s) ||
    (c.contactPhone || '').toLowerCase().includes(s) ||
    (c.contactName || '').toLowerCase().includes(s) ||
    (c.numeroPedido || '').toLowerCase().includes(s) ||
    (c.resumo || '').toLowerCase().includes(s)
  );
}

/** Lista plana agrupada por loja para a coluna esquerda, respeitando canal. */
export function buildGroupedList(
  organized: OrganizedReview,
  canal: ReviewCanalFilter,
  lojaFilter: string | null,
  categoriaFilter: string | null,
  ataFilter: AtaFilter,
  search: string,
): LojaGroup[] {
  const matchCat = (c: ComplaintReviewItem) =>
    !categoriaFilter || c.categoria === categoriaFilter;
  const matchAta = (c: ComplaintReviewItem) => {
    if (ataFilter === 'na_ata') return c.confirmadoPorHumano;
    if (ataFilter === 'fora') return !c.confirmadoPorHumano;
    return true;
  };
  const match = (c: ComplaintReviewItem) =>
    matchCat(c) && matchAta(c) && matchesSearch(c, search);

  const groups: LojaGroup[] = [];

  const pushGroups = (source: LojaGroup[]) => {
    for (const g of source) {
      if (lojaFilter && g.lojaKey !== lojaFilter) continue;
      const items = g.items.filter(match);
      if (items.length) groups.push({ lojaKey: g.lojaKey, items });
    }
  };

  if (canal === 'todas' || canal === 'conversas') {
    pushGroups(organized.conversasPorLoja);
  }
  if ((canal === 'todas' || canal === 'semLoja') && !lojaFilter) {
    const items = organized.semLoja.filter(match);
    if (items.length) groups.push({ lojaKey: 'Sem loja', items });
  }
  if (canal === 'todas' || canal === 'grupos') {
    pushGroups(organized.gruposPorLoja);
  }

  return groups;
}

export function flattenGroups(groups: LojaGroup[]): ComplaintReviewItem[] {
  return groups.flatMap((g) => g.items);
}
