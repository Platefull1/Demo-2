/** Query string compartilhada entre lista e detalhe de notas CMV Real. */

export type NotasListFilters = {
  status: string;
  storeSlug: string;
  mes: number;
  ano: number;
};

const STATUS_OK = new Set(['EM_REVISAO', 'APROVADA', 'IGNORADA']);

export function parseNotasListFilters(
  params: URLSearchParams,
  defaults?: { mes?: number; ano?: number },
): NotasListFilters {
  const agora = new Date();
  const statusRaw = params.get('status') || 'EM_REVISAO';
  const status = STATUS_OK.has(statusRaw) ? statusRaw : 'EM_REVISAO';
  const mesRaw = Number(params.get('mes'));
  const anoRaw = Number(params.get('ano'));
  const mes =
    Number.isInteger(mesRaw) && mesRaw >= 1 && mesRaw <= 12
      ? mesRaw
      : (defaults?.mes ?? agora.getMonth() + 1);
  const ano =
    Number.isInteger(anoRaw) && anoRaw >= 2000 && anoRaw <= 2100
      ? anoRaw
      : (defaults?.ano ?? agora.getFullYear());
  const storeSlug = params.get('storeSlug') || '';
  return { status, storeSlug, mes, ano };
}

export function buildNotasListQuery(filters: {
  status?: string;
  storeSlug?: string;
  mes?: number;
  ano?: number;
}): string {
  const q = new URLSearchParams();
  if (filters.status) q.set('status', filters.status);
  if (filters.storeSlug) q.set('storeSlug', filters.storeSlug);
  if (filters.mes != null) q.set('mes', String(filters.mes));
  if (filters.ano != null) q.set('ano', String(filters.ano));
  return q.toString();
}

export function notasListHref(filters: {
  status?: string;
  storeSlug?: string;
  mes?: number;
  ano?: number;
}): string {
  const qs = buildNotasListQuery(filters);
  return qs ? `/cmv-real/notas?${qs}` : '/cmv-real/notas';
}
