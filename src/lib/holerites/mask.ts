import { limparCpfDigits } from '@/lib/shared/holerites/schemas';

/** CPF → ***.***.*89-00 (últimos 4 dígitos legíveis no formato). */
export function maskCpf(cpf: string | null | undefined): string {
  const d = limparCpfDigits(cpf ?? '');
  if (d.length !== 11) return '***.***.***-**';
  return `***.***.*${d.slice(7, 9)}-${d.slice(9)}`;
}

/** Telefone → ••••42 (últimos 2 dígitos). */
export function maskPhone(phone: string | null | undefined): string {
  const d = (phone ?? '').replace(/\D/g, '');
  if (d.length < 2) return '••••••';
  return `••••${d.slice(-2)}`;
}

export function phoneHintFromNormalized(phone: string): string {
  return `••${phone.slice(-2)}`;
}
