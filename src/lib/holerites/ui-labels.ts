import type { UnmatchedMotivo } from '@/lib/holerites/types-ingest';

export function labelUnmatchedMotivo(motivo: UnmatchedMotivo | string): string {
  switch (motivo) {
    case 'cpf_nao_cadastrado':
      return 'CPF não encontrado no cadastro';
    case 'pagina_sem_texto':
      return 'Página sem texto (escaneada?)';
    case 'sem_cpf':
      return 'Sem CPF na página';
    case 'cpf_ambiguo':
      return 'CPF em mais de um cadastro';
    case 'duplicado_no_lote':
      return 'Duplicado no lote';
    case 'desvinculado_manual':
      return 'Desvinculado manualmente';
    default:
      return motivo;
  }
}

export function formatCentsBr(cents: number | null | undefined): string {
  if (cents == null) return '—';
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function labelBatchStatus(status: string): string {
  switch (status) {
    case 'PROCESSING':
      return 'Processando';
    case 'REVIEW':
      return 'Em conferência';
    case 'PUBLISHED':
      return 'Publicado';
    case 'CANCELLED':
      return 'Cancelado';
    default:
      return status;
  }
}
