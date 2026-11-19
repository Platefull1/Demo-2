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

export function formatDateTimeSp(d: Date): string {
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${get('day')}/${get('month')}/${get('year')} às ${get('hour')}:${get('minute')}`;
}

export function formatDateSp(d: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
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
