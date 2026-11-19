import { z } from 'zod';
import { competenciaSchema, payslipTypeSchema } from '@/lib/shared/holerites/schemas';

const MAX_FILE_BYTES = 30 * 1024 * 1024;
const MAX_FILES = 10;

export const createBatchBodySchema = z.object({
  competencia: competenciaSchema,
  type: payslipTypeSchema,
  files: z
    .array(
      z.object({
        name: z.string().min(1).max(255),
        sizeBytes: z.number().int().positive().max(MAX_FILE_BYTES),
      }),
    )
    .min(1)
    .max(MAX_FILES)
    .superRefine((files, ctx) => {
      for (let i = 0; i < files.length; i++) {
        const name = files[i]!.name;
        if (!name.toLowerCase().endsWith('.pdf')) {
          ctx.addIssue({
            code: 'custom',
            message: 'Apenas arquivos .pdf são aceitos',
            path: [i, 'name'],
          });
        }
      }
    }),
});

export const vinculosBodySchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('vincular'),
    sourcePath: z.string().min(1),
    pageIndexes: z.array(z.number().int().nonnegative()).min(1),
    funcionarioId: z.string().min(1),
  }),
  z.object({
    action: z.literal('trocar'),
    payslipId: z.string().min(1),
    funcionarioId: z.string().min(1),
  }),
  z.object({
    action: z.literal('desvincular'),
    payslipId: z.string().min(1),
  }),
]);

export { MAX_FILE_BYTES, MAX_FILES };
