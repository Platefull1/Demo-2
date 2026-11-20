import { prisma } from '@/lib/prisma';
import { removePayslipObjects } from '@/lib/holerites/storage';
import type { PayslipSourceFile } from '@/lib/holerites/types-ingest';

export type HoleritesCleanupResult = {
  loginCodesDeleted: number;
  rateBucketsDeleted: number;
  stagingBatches: number;
  stagingPathsRemoved: number;
};

/**
 * Limpeza diária: OTP velhos, rate limits expirados, staging órfão.
 */
export async function runHoleritesCleanup(
  now = new Date(),
): Promise<HoleritesCleanupResult> {
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const codes = await prisma.employeeLoginCode.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        { consumedAt: { not: null, lt: dayAgo } },
      ],
    },
  });

  const buckets = await prisma.rateLimitBucket.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  const staleBatches = await prisma.payslipBatch.findMany({
    where: {
      OR: [
        { status: 'CANCELLED' },
        {
          status: 'PROCESSING',
          updatedAt: { lt: dayAgo },
        },
      ],
    },
    select: {
      id: true,
      status: true,
      sourceFiles: true,
      updatedAt: true,
    },
    take: 200,
  });

  let stagingPathsRemoved = 0;
  let stagingBatches = 0;

  for (const batch of staleBatches) {
    const paths = ((batch.sourceFiles ?? []) as PayslipSourceFile[])
      .map((f) => f.path)
      .filter(Boolean);
    if (paths.length) {
      try {
        await removePayslipObjects(paths);
        stagingPathsRemoved += paths.length;
      } catch (err) {
        console.error('[holerites/cleanup] staging', batch.id, err);
      }
    }

    if (batch.status === 'PROCESSING' && batch.updatedAt < dayAgo) {
      await prisma.payslipBatch.update({
        where: { id: batch.id },
        data: {
          status: 'CANCELLED',
          errorMessage: 'expirado',
          sourceFiles: [],
        },
      });
      stagingBatches += 1;
    } else if (batch.status === 'CANCELLED' && paths.length) {
      await prisma.payslipBatch.update({
        where: { id: batch.id },
        data: { sourceFiles: [] },
      });
      stagingBatches += 1;
    }
  }

  return {
    loginCodesDeleted: codes.count,
    rateBucketsDeleted: buckets.count,
    stagingBatches,
    stagingPathsRemoved,
  };
}
