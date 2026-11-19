import type { PayslipStatus, PayslipType } from '@/lib/shared/holerites/types';
import type { NextResponse } from 'next/server';
import {
  setEmployeeCookie,
  type EmployeeSession,
} from '@/lib/employee-auth';

export const PORTAL_VISIBLE_STATUSES: PayslipStatus[] = [
  'PUBLISHED',
  'VIEWED',
  'ACKNOWLEDGED',
];

export type PortalPayslipItem = {
  id: string;
  competencia: string;
  type: PayslipType;
  status: PayslipStatus;
  netAmountCents: number | null;
  isRetificacao: boolean;
  publishedAt: string | null;
  acknowledgedAt: string | null;
};

export function serializePortalPayslip(p: {
  id: string;
  competencia: string;
  type: PayslipType;
  status: PayslipStatus;
  netAmountCents: number | null;
  replacesId: string | null;
  publishedAt: Date | null;
  acknowledgedAt: Date | null;
}): PortalPayslipItem {
  return {
    id: p.id,
    competencia: p.competencia,
    type: p.type,
    status: p.status,
    netAmountCents: p.netAmountCents,
    isRetificacao: Boolean(p.replacesId),
    publishedAt: p.publishedAt?.toISOString() ?? null,
    acknowledgedAt: p.acknowledgedAt?.toISOString() ?? null,
  };
}

export function applySessionCookie(
  res: NextResponse,
  session: EmployeeSession,
): void {
  if (session.renewedToken) {
    setEmployeeCookie(res, session.renewedToken);
  }
}

/** Cursor opaco: competencia|publishedAtISO|id */
export function encodePayslipCursor(p: {
  competencia: string;
  publishedAt: Date | null;
  id: string;
}): string {
  const published = p.publishedAt?.toISOString() ?? '';
  return Buffer.from(
    `${p.competencia}\n${published}\n${p.id}`,
    'utf8',
  ).toString('base64url');
}

export function decodePayslipCursor(cursor: string): {
  competencia: string;
  publishedAt: Date | null;
  id: string;
} | null {
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const [competencia, published, id] = raw.split('\n');
    if (!competencia || !id) return null;
    return {
      competencia,
      publishedAt: published ? new Date(published) : null,
      id,
    };
  } catch {
    return null;
  }
}

const TYPE_SLUG: Record<PayslipType, string> = {
  MENSAL: 'mensal',
  ADIANTAMENTO: 'adiantamento',
  DECIMO_TERCEIRO_1: '13-1',
  DECIMO_TERCEIRO_2: '13-2',
  FERIAS: 'ferias',
  RESCISAO: 'rescisao',
};

export function payslipDownloadFilename(
  competencia: string,
  type: PayslipType,
): string {
  return `holerite-${competencia}-${TYPE_SLUG[type] ?? 'holerite'}.pdf`;
}
