import { validarCpfDigits } from '@/lib/shared/holerites/schemas';

const CPF_LABEL_RE = /C\s*\.?\s*P\s*\.?\s*F\s*\.?(?:\s+do\s+empregado)?/gi;
const CPF_MASKED_RE = /\d{3}\.\d{3}\.\d{3}-\d{2}/g;
const CPF_PLAIN_RE = /(?<!\d)\d{11}(?!\d)/g;
const LIQUIDO_LABEL_RE =
  /(?:l[ií]quido\s+a\s+receber|valor\s+l[ií]quido|total\s+l[ií]quido|l[ií]quido)\b/gi;
const MONEY_BR_RE = /(\d{1,3}(?:\.\d{3})*,\d{2})/g;

export type PaginaIngest = {
  index: number;
  cpf: string | null;
  semTexto: boolean;
};

export type GrupoComCpf = {
  cpf: string;
  pageIndexes: number[];
};

export type PaginaSemVinculo = {
  pageIndexes: number[];
  cpf: string | null;
  motivo: 'sem_cpf' | 'pagina_sem_texto';
};

export const MAX_PDF_PAGES = 500;
export const PDF_EXTRACT_TIMEOUT_MS = 30_000;

/** Extrai texto de cada página do PDF (runtime Node / unpdf). Timeout 30s. */
export async function extrairTextoPorPagina(
  buffer: Buffer | Uint8Array,
): Promise<string[]> {
  const work = async () => {
    const { extractText } = await import('unpdf');
    // unpdf/pdf.js toma ownership do Uint8Array — sempre passar cópia
    const data = Uint8Array.from(
      buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer),
    );
    const { text } = await extractText(data, { mergePages: false });
    if (Array.isArray(text)) return text.map((t) => t ?? '');
    return [text ?? ''];
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      work(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            Object.assign(new Error('Timeout na extração do PDF (30s)'), {
              status: 400,
            }),
          );
        }, PDF_EXTRACT_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Indício de página escaneada / só imagem. */
export function detectarPaginaSemTexto(texto: string): boolean {
  const uteis = (texto ?? '').replace(/\s+/g, '').length;
  return uteis < 30;
}

function distanciaAoRotulo(texto: string, cpfIndex: number): number {
  const windowStart = Math.max(0, cpfIndex - 48);
  const before = texto.slice(windowStart, cpfIndex);
  let best = Number.POSITIVE_INFINITY;
  CPF_LABEL_RE.lastIndex = 0;
  for (const m of before.matchAll(CPF_LABEL_RE)) {
    const labelEnd = windowStart + (m.index ?? 0) + m[0].length;
    const dist = cpfIndex - labelEnd;
    if (dist >= 0 && dist < best) best = dist;
  }
  return best;
}

/**
 * CPFs válidos na página (com/sem máscara). Ignora CNPJ (14 dígitos) e
 * sequências repetidas. Se vários, prioriza o próximo aos rótulos CPF.
 */
export function extrairCpfsDaPagina(texto: string): {
  principal: string | null;
  outros: string[];
} {
  const found: Array<{ cpf: string; index: number; near: number }> = [];
  const seenAt = new Map<string, number>();

  const push = (digits: string, index: number) => {
    if (!validarCpfDigits(digits)) return;
    const prev = seenAt.get(digits);
    if (prev !== undefined && prev <= index) return;
    seenAt.set(digits, index);
    const existing = found.findIndex((f) => f.cpf === digits);
    const near = distanciaAoRotulo(texto, index);
    if (existing >= 0) {
      if (near < found[existing]!.near) {
        found[existing] = { cpf: digits, index, near };
      }
      return;
    }
    found.push({ cpf: digits, index, near });
  };

  CPF_MASKED_RE.lastIndex = 0;
  for (const m of texto.matchAll(CPF_MASKED_RE)) {
    push(m[0].replace(/\D/g, ''), m.index ?? 0);
  }

  CPF_PLAIN_RE.lastIndex = 0;
  for (const m of texto.matchAll(CPF_PLAIN_RE)) {
    push(m[0], m.index ?? 0);
  }

  if (found.length === 0) return { principal: null, outros: [] };

  found.sort((a, b) => {
    const aLabeled = Number.isFinite(a.near);
    const bLabeled = Number.isFinite(b.near);
    if (aLabeled !== bLabeled) return aLabeled ? -1 : 1;
    if (a.near !== b.near) return a.near - b.near;
    return a.index - b.index;
  });

  const principal = found[0]!.cpf;
  const outros = found.slice(1).map((f) => f.cpf);
  return { principal, outros };
}

/**
 * Agrupa páginas consecutivas do mesmo CPF.
 * Página sem CPF após X entra no grupo se a sequência de páginas sem CPF
 * for seguida de outra página de X ou do fim do arquivo.
 * Página semTexto nunca agrupa.
 */
export function agruparPaginas(paginas: PaginaIngest[]): {
  grupos: GrupoComCpf[];
  semVinculo: PaginaSemVinculo[];
} {
  const grupos: GrupoComCpf[] = [];
  const semVinculo: PaginaSemVinculo[] = [];
  const n = paginas.length;
  let i = 0;

  const canAbsorbNullRun = (from: number, cpfX: string): boolean => {
    let k = from;
    while (k < n && !paginas[k]!.semTexto && paginas[k]!.cpf === null) k++;
    if (k >= n) return true;
    if (paginas[k]!.semTexto) return false;
    return paginas[k]!.cpf === cpfX;
  };

  while (i < n) {
    const page = paginas[i]!;

    if (page.semTexto) {
      semVinculo.push({
        pageIndexes: [page.index],
        cpf: null,
        motivo: 'pagina_sem_texto',
      });
      i++;
      continue;
    }

    if (!page.cpf) {
      semVinculo.push({
        pageIndexes: [page.index],
        cpf: null,
        motivo: 'sem_cpf',
      });
      i++;
      continue;
    }

    const cpf = page.cpf;
    const indexes = [page.index];
    let j = i + 1;

    while (j < n) {
      const next = paginas[j]!;
      if (next.semTexto) break;

      if (next.cpf === cpf) {
        indexes.push(next.index);
        j++;
        continue;
      }

      if (next.cpf === null && canAbsorbNullRun(j, cpf)) {
        while (j < n && !paginas[j]!.semTexto && paginas[j]!.cpf === null) {
          indexes.push(paginas[j]!.index);
          j++;
        }
        continue;
      }

      break;
    }

    grupos.push({ cpf, pageIndexes: indexes });
    i = j;
  }

  return { grupos, semVinculo };
}

/** Converte "1.234,56" → centavos. Ambiguidade → null. */
export function extrairLiquido(texto: string): number | null {
  const hits: number[] = [];
  LIQUIDO_LABEL_RE.lastIndex = 0;

  for (const m of texto.matchAll(LIQUIDO_LABEL_RE)) {
    const from = (m.index ?? 0) + m[0].length;
    const window = texto.slice(from, from + 80);
    MONEY_BR_RE.lastIndex = 0;
    const money = MONEY_BR_RE.exec(window);
    if (!money) continue;
    const raw = money[1]!.replace(/\./g, '').replace(',', '.');
    const reais = Number.parseFloat(raw);
    if (!Number.isFinite(reais)) continue;
    hits.push(Math.round(reais * 100));
  }

  if (hits.length === 0) return null;
  const unique = [...new Set(hits)];
  if (unique.length !== 1) return null;
  return unique[0]!;
}

export function isPdfMagic(buffer: Buffer | Uint8Array): boolean {
  if (buffer.byteLength < 5) return false;
  const head =
    typeof buffer.slice === 'function'
      ? buffer.slice(0, 5)
      : new Uint8Array(buffer.buffer, buffer.byteOffset, 5);
  const s =
    typeof Buffer !== 'undefined' && Buffer.isBuffer(head)
      ? head.toString('ascii')
      : String.fromCharCode(...Array.from(head as Uint8Array));
  return s === '%PDF-';
}
