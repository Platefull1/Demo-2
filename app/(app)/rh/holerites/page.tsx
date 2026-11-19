import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { getRhContext } from '@/lib/rh-auth';
import { HoleritesPanel } from '@/components/rh/holerites/HoleritesPanel';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

async function PanelLoader() {
  const ctx = await getRhContext();
  if (!ctx) {
    return (
      <p className="text-sm text-destructive">Sessão expirada. Faça login de novo.</p>
    );
  }
  const lojas = await prisma.rhLoja.findMany({
    where: { userId: ctx.userId, ativo: true },
    orderBy: { nome: 'asc' },
    select: { id: true, nome: true },
  });
  return <HoleritesPanel lojas={lojas} />;
}

export default function HoleritesIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <PanelLoader />
    </Suspense>
  );
}
