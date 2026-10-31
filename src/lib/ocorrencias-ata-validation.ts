import { z } from 'zod';
import { ESCOPO_REDE, ESCOPO_TODAS_LOJAS } from '@/lib/ocorrencias-ata-data';

export const destaqueBodySchema = z.object({
  destaqueAta: z.boolean(),
});

export const atrasosQuerySchema = z.object({
  ano: z.coerce.number().int().min(2020).max(2100),
  mes: z.coerce.number().int().min(1).max(12),
});

export const atrasosPutSchema = z.object({
  ano: z.number().int().min(2020).max(2100),
  mes: z.number().int().min(1).max(12),
  itens: z
    .array(
      z.object({
        lojaId: z.string().trim().min(1).max(64),
        quantidade: z.number().int().min(0).max(9999),
      }),
    )
    .min(1)
    .max(50),
});

export const atasMesQuerySchema = z.object({
  ano: z.coerce.number().int().min(2020).max(2100),
  mes: z.coerce.number().int().min(1).max(12),
  escopo: z.string().trim().min(1).max(64).optional(),
});

export const atasPostSchema = z.object({
  ano: z.number().int().min(2020).max(2100),
  mes: z.number().int().min(1).max(12),
  escopo: z.string().trim().min(1).max(64),
});

export function isEscopoEspecial(escopo: string): boolean {
  return escopo === ESCOPO_REDE || escopo === ESCOPO_TODAS_LOJAS;
}
