import { maskPhone } from '@/lib/holerites/mask';

export type EmployeeOtpPayload = {
  phone: string;
  whatsappLid: string | null;
  firstName: string;
  code: string;
};

export type PayslipPublishedItem = {
  payslipId: string;
  firstName: string;
  phone: string;
  whatsappLid: string | null;
  competenciaLabel: string;
  typeLabel: string;
  isRetificacao: boolean;
  link: string;
};

/**
 * Dispara OTP via webhook n8n / webhook.site.
 * Falha ou timeout → log mascarado; não propaga.
 */
export async function sendEmployeeOtp(
  input: EmployeeOtpPayload,
): Promise<boolean> {
  const url = process.env.N8N_EMPLOYEE_OTP_WEBHOOK?.trim();
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (!url || !secret) {
    console.warn(
      '[holerites/n8n] N8N_EMPLOYEE_OTP_WEBHOOK ou N8N_WEBHOOK_SECRET ausente — OTP não enviado',
    );
    return false;
  }

  const body = {
    type: 'employee_otp' as const,
    phone: input.phone,
    whatsappLid: input.whatsappLid,
    firstName: input.firstName,
    code: input.code,
    expiresInMinutes: 10,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-webhook-secret': secret,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn(
        `[holerites/n8n] webhook OTP status=${res.status} phone=${maskPhone(input.phone)}`,
      );
      return false;
    }
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.name : 'error';
    console.warn(
      `[holerites/n8n] webhook OTP falhou (${msg}) phone=${maskPhone(input.phone)}`,
    );
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Aviso de holerites publicados (n8n / receptor local).
 * Timeout 10s. Retorna false em falha (não lança).
 */
export async function sendPayslipsPublishedWebhook(input: {
  batchId: string;
  items: PayslipPublishedItem[];
}): Promise<boolean> {
  const url = process.env.N8N_PAYSLIP_PUBLISHED_WEBHOOK?.trim();
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();

  if (!url || !secret) {
    console.warn(
      '[holerites/n8n] N8N_PAYSLIP_PUBLISHED_WEBHOOK ou N8N_WEBHOOK_SECRET ausente',
    );
    return false;
  }

  const body = {
    type: 'payslips_published' as const,
    batchId: input.batchId,
    items: input.items,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-webhook-secret': secret,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn(
        `[holerites/n8n] webhook published status=${res.status} batch=${input.batchId} n=${input.items.length}`,
      );
      return false;
    }
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.name : 'error';
    console.warn(
      `[holerites/n8n] webhook published falhou (${msg}) batch=${input.batchId}`,
    );
    return false;
  } finally {
    clearTimeout(timer);
  }
}
