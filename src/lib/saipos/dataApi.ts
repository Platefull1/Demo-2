/**
 * Cliente da API de Dados oficial da Saipos (server-side only).
 * Docs: https://saipos-data-api.readme.io/reference/consultar-vendas
 *
 * Tokens por loja (nunca logar o valor completo):
 *   SAIPOS_DATA_TOKEN_AHU | _PILAR (ou _PILARZINHO) | _PORTAO | _UBERABA
 */

const BASE_URL = 'https://data.saipos.io/v1';
const MAX_WINDOW_DAYS = 15;
const DEFAULT_LIMIT = 1000;
const MAX_RETRIES = 3;

export type SaiposStoreSlug = 'ahu' | 'pilarzinho' | 'portao' | 'uberaba';

/** Nomes preferidos; fallbacks aceitos (ex.: PILAR no .env local). */
const TOKEN_ENV: Record<SaiposStoreSlug, string[]> = {
  ahu: ['SAIPOS_DATA_TOKEN_AHU'],
  pilarzinho: ['SAIPOS_DATA_TOKEN_PILARZINHO', 'SAIPOS_DATA_TOKEN_PILAR'],
  portao: ['SAIPOS_DATA_TOKEN_PORTAO'],
  uberaba: ['SAIPOS_DATA_TOKEN_UBERABA'],
};

export class SaiposDataApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly storeSlug?: string
  ) {
    super(message);
    this.name = 'SaiposDataApiError';
  }
}

export function getSaiposDataToken(storeSlug: SaiposStoreSlug): string {
  const names = TOKEN_ENV[storeSlug];
  let raw: string | undefined;
  let usedName = names[0];
  for (const name of names) {
    const v = process.env[name]?.trim();
    if (v) {
      raw = v;
      usedName = name;
      break;
    }
  }
  if (!raw) {
    throw new SaiposDataApiError(
      `Token da API de Dados ausente (${names.join(' | ')}) para a loja ${storeSlug}.`,
      undefined,
      storeSlug
    );
  }
  // Aceita "Bearer <jwt>" ou só o JWT
  const token = raw.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    throw new SaiposDataApiError(
      `Token vazio em ${usedName} para a loja ${storeSlug}.`,
      undefined,
      storeSlug
    );
  }
  return token;
}

/** Prefixo seguro para logs (máx. 4 caracteres). */
export function tokenPrefix(token: string): string {
  return token.slice(0, 4);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Divide [start, end] inclusive em janelas de no máximo 15 dias (regra da Saipos).
 * Datas no formato YYYY-MM-DD.
 */
export function splitShiftDateWindows(
  startDate: string,
  endDate: string
): Array<{ start: string; end: string }> {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    throw new SaiposDataApiError(`Período inválido: ${startDate} → ${endDate}`);
  }

  const windows: Array<{ start: string; end: string }> = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    const winEnd = new Date(cursor);
    winEnd.setUTCDate(winEnd.getUTCDate() + (MAX_WINDOW_DAYS - 1));
    if (winEnd > end) winEnd.setTime(end.getTime());
    windows.push({ start: toDateOnly(cursor), end: toDateOnly(winEnd) });
    cursor = new Date(winEnd);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return windows;
}

/** Janelas de um mês YYYY-MM (1º ao último dia). */
export function monthShiftDateWindows(competencia: string): Array<{ start: string; end: string }> {
  const m = /^(\d{4})-(\d{2})$/.exec(competencia);
  if (!m) throw new SaiposDataApiError(`Competência inválida: ${competencia}`);
  const year = Number(m[1]);
  const month = Number(m[2]);
  const start = `${competencia}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const end = `${competencia}-${String(lastDay).padStart(2, '0')}`;
  return splitShiftDateWindows(start, end);
}

async function fetchWithRetry(
  url: string,
  token: string,
  storeSlug: SaiposStoreSlug,
  attempt = 1
): Promise<Response> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      await sleep(500 * Math.pow(2, attempt - 1));
      return fetchWithRetry(url, token, storeSlug, attempt + 1);
    }
    throw new SaiposDataApiError(
      `Falha de rede na API de Dados (${storeSlug}): ${
        err instanceof Error ? err.message : 'erro desconhecido'
      }`,
      undefined,
      storeSlug
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new SaiposDataApiError(
      `Token inválido ou sem permissão para a loja ${storeSlug} (HTTP ${response.status}). Prefixo: ${tokenPrefix(token)}`,
      response.status,
      storeSlug
    );
  }

  if (response.status >= 500 && attempt < MAX_RETRIES) {
    await sleep(500 * Math.pow(2, attempt - 1));
    return fetchWithRetry(url, token, storeSlug, attempt + 1);
  }

  return response;
}

export type FetchSalesPageParams = {
  storeSlug: SaiposStoreSlug;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD */
  endDate: string;
  limit?: number;
  offset?: number;
  /** Override do token (testes); se omitido, lê do env. */
  token?: string;
};

/**
 * Uma página de Consultar Vendas (`GET /search_sales`), filtro por shift_date.
 */
export async function fetchSalesPage(params: FetchSalesPageParams): Promise<unknown[]> {
  const {
    storeSlug,
    startDate,
    endDate,
    limit = DEFAULT_LIMIT,
    offset = 0,
    token: tokenOverride,
  } = params;

  const token = tokenOverride ?? getSaiposDataToken(storeSlug);
  const qs = new URLSearchParams({
    p_date_column_filter: 'shift_date',
    p_filter_date_start: `${startDate}T00:00:00`,
    p_filter_date_end: `${endDate}T23:59:59`,
    p_limit: String(limit),
    p_offset: String(offset),
  });

  const url = `${BASE_URL}/search_sales?${qs.toString()}`;
  const response = await fetchWithRetry(url, token, storeSlug);

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new SaiposDataApiError(
      `API de Dados ${storeSlug} HTTP ${response.status}: ${body.slice(0, 200)}`,
      response.status,
      storeSlug
    );
  }

  const json = await response.json();
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

/**
 * Todas as vendas do período (paginação + janelas ≤ 15 dias).
 */
export async function fetchAllSales(params: {
  storeSlug: SaiposStoreSlug;
  startDate: string;
  endDate: string;
  token?: string;
}): Promise<unknown[]> {
  const windows = splitShiftDateWindows(params.startDate, params.endDate);
  const all: unknown[] = [];

  for (const win of windows) {
    let offset = 0;
    for (;;) {
      const page = await fetchSalesPage({
        storeSlug: params.storeSlug,
        startDate: win.start,
        endDate: win.end,
        limit: DEFAULT_LIMIT,
        offset,
        token: params.token,
      });
      all.push(...page);
      if (page.length < DEFAULT_LIMIT) break;
      offset += DEFAULT_LIMIT;
      // Evita PGRST003 (pool timeout) em meses com muitas páginas
      await sleep(600);
    }
  }

  return all;
}

export async function fetchSalesForCompetencia(params: {
  storeSlug: SaiposStoreSlug;
  competencia: string;
  token?: string;
}): Promise<unknown[]> {
  const windows = monthShiftDateWindows(params.competencia);
  const all: unknown[] = [];
  for (const win of windows) {
    const chunk = await fetchAllSales({
      storeSlug: params.storeSlug,
      startDate: win.start,
      endDate: win.end,
      token: params.token,
    });
    all.push(...chunk);
  }
  return all;
}
