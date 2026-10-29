import { z } from 'zod';
import { CATEGORIA_CHIP_VALUES, resolverCategorias } from '@/lib/ocorrencias-categorias';

export const DESCRICAO_MAX = 2000;
export const SAIPOS_MAX = 20;
export const EXTERNO_MAX = 30;
export const PAGE_SIZE_MAX = 100;
export const PAGE_SIZE_DEFAULT = 25;

export const ocorrenciaBodySchema = z
  .object({
    lojaId: z.string().trim().min(1, 'Loja obrigatória').max(64),
    numeroPedidoSaipos: z
      .string()
      .trim()
      .regex(/^\d{1,20}$/, 'Número do pedido Saipos deve ter só dígitos (máx. 20)'),
    numeroPedidoExterno: z
      .string()
      .trim()
      .max(EXTERNO_MAX)
      .regex(/^[a-zA-Z0-9]*$/, 'Número externo deve ser alfanumérico')
      .optional()
      .transform((s) => (s && s.length > 0 ? s : undefined)),
    canalExterno: z.enum(['IFOOD', 'DELIVERY_DIRETO']).optional(),
    descricao: z.string().max(DESCRICAO_MAX, 'Descrição muito longa').optional().default(''),
    motoboyId: z
      .string()
      .trim()
      .max(64)
      .optional()
      .transform((s) => (s && s.length > 0 ? s : undefined)),
    categorias: z.array(z.string().max(40)).max(CATEGORIA_CHIP_VALUES.length).default([]),
    idempotencyKey: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().uuid().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    const result = resolverCategorias(data.categorias, data.descricao);
    if (result.ok === false) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.error,
        path: data.categorias.length === 0 ? ['descricao'] : ['categorias'],
      });
    }
    if (data.numeroPedidoExterno && !data.canalExterno) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Canal externo obrigatório quando há número de pedido externo',
        path: ['canalExterno'],
      });
    }
  });

export function parseCategorias(raw: FormDataEntryValue | null): string[] {
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export function parsePage(raw: string | null): number {
  const n = parseInt(raw || '1', 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 1_000_000);
}

export function parsePageSize(raw: string | null, fallback = PAGE_SIZE_DEFAULT): number {
  const n = parseInt(raw || String(fallback), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, PAGE_SIZE_MAX);
}

export function ocorrenciaByIdWhere(tenantUserId: string, id: string) {
  return { id, userId: tenantUserId };
}

export function clampBusca(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const t = raw.trim().slice(0, 50);
  return t.length > 0 ? t : undefined;
}
