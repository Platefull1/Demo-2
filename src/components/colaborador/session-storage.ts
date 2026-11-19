const CPF_KEY = 'colaborador_otp_cpf';
const HINT_KEY = 'colaborador_otp_phone_hint';
const NEXT_KEY = 'colaborador_otp_next';

export function saveLoginFlow(data: {
  cpf: string;
  phoneHint: string | null;
  next: string;
}): void {
  try {
    sessionStorage.setItem(CPF_KEY, data.cpf);
    if (data.phoneHint) sessionStorage.setItem(HINT_KEY, data.phoneHint);
    else sessionStorage.removeItem(HINT_KEY);
    sessionStorage.setItem(NEXT_KEY, data.next);
  } catch {
    /* private mode */
  }
}

export function readLoginFlow(): {
  cpf: string | null;
  phoneHint: string | null;
  next: string | null;
} {
  try {
    return {
      cpf: sessionStorage.getItem(CPF_KEY),
      phoneHint: sessionStorage.getItem(HINT_KEY),
      next: sessionStorage.getItem(NEXT_KEY),
    };
  } catch {
    return { cpf: null, phoneHint: null, next: null };
  }
}

export function clearLoginFlow(): void {
  try {
    sessionStorage.removeItem(CPF_KEY);
    sessionStorage.removeItem(HINT_KEY);
    sessionStorage.removeItem(NEXT_KEY);
  } catch {
    /* ignore */
  }
}

/** Máscara visual 000.000.000-00 a partir de dígitos. */
export function maskCpfInput(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  let out = p1;
  if (p2) out += `.${p2}`;
  if (p3) out += `.${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

export function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}
