import { z } from 'zod';
import { competenciaSchema, cpfSchema, payslipTypeSchema } from './schemas';

export type PayslipType = z.infer<typeof payslipTypeSchema>;
export type Competencia = z.infer<typeof competenciaSchema>;
export type CpfDigits = z.infer<typeof cpfSchema>;

export type PayslipStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'VIEWED'
  | 'ACKNOWLEDGED'
  | 'REVOKED';

export type PayslipBatchStatus = 'PROCESSING' | 'REVIEW' | 'PUBLISHED' | 'CANCELLED';

export type PayslipNotifyStatus = 'pending' | 'sent' | 'failed';
