import { z } from 'zod';

const PAYSLIP_TYPES = [
  'MENSAL',
  'ADIANTAMENTO',
  'DECIMO_TERCEIRO_1',
  'DECIMO_TERCEIRO_2',
  'FERIAS',
  'RESCISAO',
] as const;

export const payslipTypeSchema = z.enum(PAYSLIP_TYPES);

export function limparCpfDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

/** Valida dígitos verificadores; rejeita sequências repetidas (111…, 000…). */
export function validarCpfDigits(digits: string): boolean {
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]!, 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits[9]!, 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]!, 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(digits[10]!, 10);
}

export const competenciaSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Competência inválida (use YYYY-MM)');

export const cpfSchema = z
  .string()
  .transform((v) => limparCpfDigits(v))
  .refine((d) => d.length === 11, 'CPF deve ter 11 dígitos')
  .refine((d) => validarCpfDigits(d), 'CPF inválido');

/**
 * Normaliza telefone BR para 55 + DDD + número (12–13 dígitos).
 * Inválido → null (não lança).
 */
export function normalizeTelefoneBr(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;

  // Remove zeros à esquerda tipo 0DDD...
  if (digits.startsWith('0') && !digits.startsWith('55')) {
    digits = digits.replace(/^0+/, '');
  }

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    const ddd = digits.slice(2, 4);
    const num = digits.slice(4);
    if (!/^[1-9]\d$/.test(ddd)) return null;
    if (num.length !== 8 && num.length !== 9) return null;
    return digits;
  }

  // DDD + número (10 ou 11 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const num = digits.slice(2);
    if (!/^[1-9]\d$/.test(ddd)) return null;
    if (num.length !== 8 && num.length !== 9) return null;
    return `55${digits}`;
  }

  return null;
}

export const telefoneBrSchema = z
  .string()
  .nullable()
  .optional()
  .transform((v) => normalizeTelefoneBr(v ?? null));
