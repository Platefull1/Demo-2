import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmployeeSession } from '@/lib/employee-auth';
import {
  PORTAL_VISIBLE_STATUSES,
  applySessionCookie,
  decodePayslipCursor,
  encodePayslipCursor,
  serializePortalPayslip,
} from '@/lib/holerites/portal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const session = await getEmployeeSession(req);
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const cursorRaw = req.nextUrl.searchParams.get('cursor');
  const cursor = cursorRaw ? decodePayslipCursor(cursorRaw) : null;

  const rows = await prisma.payslip.findMany({
    where: {
      funcionarioId: session.funcionarioId,
      status: { in: [...PORTAL_VISIBLE_STATUSES] },
      ...(cursor
        ? {
            OR: [
              { competencia: { lt: cursor.competencia } },
              {
                competencia: cursor.competencia,
                publishedAt: cursor.publishedAt
                  ? { lt: cursor.publishedAt }
                  : undefined,
              },
              {
                competencia: cursor.competencia,
                publishedAt: cursor.publishedAt,
                id: { lt: cursor.id },
              },
            ],
          }
        : {}),
    },
    orderBy: [{ competencia: 'desc' }, { publishedAt: 'desc' }, { id: 'desc' }],
    take: PAGE_SIZE + 1,
    select: {
      id: true,
      competencia: true,
      type: true,
      status: true,
      netAmountCents: true,
      replacesId: true,
      publishedAt: true,
      acknowledgedAt: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;
  const page = hasMore ? rows.slice(0, PAGE_SIZE) : rows;
  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last
      ? encodePayslipCursor({
          competencia: last.competencia,
          publishedAt: last.publishedAt,
          id: last.id,
        })
      : null;

  const res = NextResponse.json({
    items: page.map(serializePortalPayslip),
    nextCursor,
  });
  applySessionCookie(res, session);
  return res;
}
