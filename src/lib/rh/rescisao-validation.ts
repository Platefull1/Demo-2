import { z } from 'zod';

const ymdSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use yyyy-MM-dd)');

const ymdNullableSchema = z
  .union([ymdSchema, z.null()])
  .optional();

export const tipoRescisaoSchema = z.enum([
  'DISPENSA_SEM_JUSTA_CAUSA',
  'DISPENSA_COM_JUSTA_CAUSA',
  'PEDIDO_DE_DISPENSA',
  'ANTECIPADA_EMPREGADOR',
  'ANTECIPADA_EMPREGADO',
]);

export const tipoAvisoSchema = z.enum([
  'INDENIZADO_IMEDIATO',
  'TRABALHADO_REDUCAO_7_DIAS',
  'TRABALHADO_REDUCAO_2_HORAS',
  'TERMINO_EXPERIENCIA',
  'ANTECIPADA_EMPREGADOR',
  'RESCISAO_POR_MORTE',
  'AVISO_TRABALHADO_30_DIAS',
  'AVISO_MEIO_INDENIZADO',
  'DISPENSADO',
]);

export const unidadeRescisaoSchema = z.enum(['horas', 'reais', 'percentual', 'dias']);

/** Valor vazio / null = não se aplica. */
export const rescisaoItemSchema = z.object({
  chave: z.string().min(1),
  descricao: z.string().min(1),
  unidade: unidadeRescisaoSchema,
  codigo: z.string().trim().min(1).nullable().optional(),
  valor: z.union([z.string(), z.number(), z.null()]).optional(),
});

/** Datas de aviso obrigatórias se cumpre OU desconta. */
export function precisaDatasAviso(
  cumpreAviso: boolean | null | undefined,
  descontaAviso: boolean | null | undefined,
): boolean {
  return cumpreAviso === true || descontaAviso === true;
}

/**
 * PATCH rascunho — nenhum campo obrigatório.
 * Snapshot do cadastro não é aceito do cliente (refresh no PATCH/finalizar).
 */
export const rescisaoPatchSchema = z
  .object({
    dataDesligamento: ymdSchema.optional(),
    cumpreAviso: z.boolean().nullable().optional(),
    descontaAviso: z.boolean().nullable().optional(),
    inicioAviso: ymdNullableSchema,
    terminoAviso: ymdNullableSchema,
    possuiEstabilidade: z.boolean().nullable().optional(),
    tipoEstabilidade: z.string().trim().max(200).nullable().optional(),
    foiTransferido: z.boolean().nullable().optional(),
    empresaOrigem: z.string().trim().max(200).nullable().optional(),
    tipoRescisao: tipoRescisaoSchema.nullable().optional(),
    tipoAviso: tipoAvisoSchema.nullable().optional(),
    motivo: z.string().trim().max(5000).nullable().optional(),
    vencimentos: z.array(rescisaoItemSchema).optional(),
    descontos: z.array(rescisaoItemSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.inicioAviso && data.terminoAviso && data.terminoAviso < data.inicioAviso) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Término do aviso deve ser maior ou igual ao início',
        path: ['terminoAviso'],
      });
    }
  });

export type RescisaoPatchInput = z.infer<typeof rescisaoPatchSchema>;

/**
 * Finalizar — valida obrigatórios + condicionais.
 * dataAdmissaoSnapshot é checada à parte (cadastro / snapshot).
 */
export const rescisaoFinalizarSchema = z
  .object({
    dataDesligamento: ymdSchema,
    cumpreAviso: z.boolean({ error: 'Informe se vai cumprir aviso prévio' }),
    descontaAviso: z.boolean({ error: 'Informe se será descontado aviso prévio' }),
    inicioAviso: ymdSchema.nullable().optional(),
    terminoAviso: ymdSchema.nullable().optional(),
    possuiEstabilidade: z.boolean({
      error: 'Informe se possui estabilidade no emprego',
    }),
    tipoEstabilidade: z.preprocess(
      (v) => (v == null ? null : v),
      z.string().trim().max(200).nullable().optional(),
    ),
    foiTransferido: z.boolean({
      error: 'Informe se foi transferido de empresa ou grupo econômico',
    }),
    empresaOrigem: z.preprocess(
      (v) => (v == null ? null : v),
      z.string().trim().max(200).nullable().optional(),
    ),
    tipoRescisao: tipoRescisaoSchema,
    tipoAviso: tipoAvisoSchema,
    // Opcional: null/undefined/'' → null
    motivo: z.preprocess(
      (v) => {
        if (v == null) return null;
        const s = String(v).trim();
        return s.length === 0 ? null : s;
      },
      z.string().max(5000).nullable(),
    ),
    vencimentos: z.array(rescisaoItemSchema).optional(),
    descontos: z.array(rescisaoItemSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (precisaDatasAviso(data.cumpreAviso, data.descontaAviso)) {
      if (!data.inicioAviso) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Início do aviso é obrigatório quando se cumpre ou desconta aviso prévio',
          path: ['inicioAviso'],
        });
      }
      if (!data.terminoAviso) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Término do aviso é obrigatório quando se cumpre ou desconta aviso prévio',
          path: ['terminoAviso'],
        });
      }
      if (
        data.inicioAviso &&
        data.terminoAviso &&
        data.terminoAviso < data.inicioAviso
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Término do aviso deve ser maior ou igual ao início',
          path: ['terminoAviso'],
        });
      }
    } else if (
      data.inicioAviso &&
      data.terminoAviso &&
      data.terminoAviso < data.inicioAviso
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Término do aviso deve ser maior ou igual ao início',
        path: ['terminoAviso'],
      });
    }

    if (data.possuiEstabilidade) {
      const tipo = data.tipoEstabilidade?.trim();
      if (!tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tipo de estabilidade é obrigatório',
          path: ['tipoEstabilidade'],
        });
      }
    }

    if (data.foiTransferido) {
      const origem = data.empresaOrigem?.trim();
      if (!origem) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Empresa de origem da transferência é obrigatória',
          path: ['empresaOrigem'],
        });
      }
    }
  });

export type RescisaoFinalizarInput = z.infer<typeof rescisaoFinalizarSchema>;

export function zodErrorMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? 'Dados inválidos';
}
