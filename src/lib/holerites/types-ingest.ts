import type { PayslipType } from '@/lib/shared/holerites/types';

export type PayslipSourceFile = {
  path: string;
  name: string;
  sizeBytes: number;
};

export type UnmatchedMotivo =
  | 'sem_cpf'
  | 'cpf_nao_cadastrado'
  | 'cpf_ambiguo'
  | 'pagina_sem_texto'
  | 'duplicado_no_lote'
  | 'desvinculado_manual';

export type UnmatchedPage = {
  sourcePath: string;
  pageIndexes: number[];
  cpfDetectado: string | null;
  motivo: UnmatchedMotivo;
  previewText: string;
};

export type IgnoredPage = {
  sourcePath: string;
  pageIndexes: number[];
  cpfDetectado: string | null;
  previewText: string;
  ignoredAt: string;
};

export type CreateBatchInput = {
  competencia: string;
  type: PayslipType;
  files: Array<{ name: string; sizeBytes: number }>;
};
