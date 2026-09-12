/**
 * Comparação mês atual × mês anterior por loja × categoria.
 * Gera uma linha de ComplaintComparison por combinação loja×categoria.
 */

import { prisma } from '@/lib/prisma';
import { monthPeriod, type MonthPeriod } from '@/lib/complaints/period';

export type ComplaintComparisonLine = {
  lojaId: string;
  lojaNome: string;
  categoria: string;
  contagemMesAtual: number;
  contagemMesAnterior: number;
  variacaoAbsoluta: number;
  variacaoPercentual: number | null;
};

function previousCalendarPeriod(period: MonthPeriod): MonthPeriod {
  const prevMonth = period.month === 1 ? 12 : period.month - 1;
  const prevYear = period.month === 1 ? period.year - 1 : period.year;
  return monthPeriod(prevYear, prevMonth);
}

/**
 * Gera ComplaintComparison (uma linha por loja×categoria) para um ComplaintReviewRun.
 *
 * Lógica:
 * 1. Busca todas as complaints confirmadas (confirmadoPorHumano=true) do run atual
 * 2. Busca o run CONCLUIDO do mês anterior
 * 3. Para cada combinação loja×categoria, calcula contagens e variações
 * 4. Faz upsert de ComplaintComparison para cada loja×categoria
 * 5. Também cria linhas para combinações do mês anterior que sumam (atual=0)
 */
export async function buildAndSaveComparison(params: {
  userId: string;
  reviewRunId: string;
  period: MonthPeriod;
}): Promise<ComplaintComparisonLine[]> {
  const { userId, reviewRunId, period } = params;
  const prevPeriod = previousCalendarPeriod(period);

  // 1. Buscar run anterior CONCLUIDO
  const previousRun = await prisma.complaintReviewRun.findFirst({
    where: {
      userId,
      status: 'CONCLUIDO',
      id: { not: reviewRunId },
      periodStart: prevPeriod.start,
    },
    orderBy: { executadoEm: 'desc' },
    select: { id: true },
  });

  // 2. Buscar complaints confirmadas do run atual (com lojaId e categoria)
  const currentComplaints = await prisma.complaint.findMany({
    where: {
      reviewRunId,
      userId,
      confirmadoPorHumano: true,
      lojaId: { not: null },
    },
    select: { lojaId: true, categoria: true },
  });

  // 3. Buscar complaints confirmadas do run anterior
  const previousComplaints = previousRun
    ? await prisma.complaint.findMany({
        where: {
          reviewRunId: previousRun.id,
          userId,
          confirmadoPorHumano: true,
          lojaId: { not: null },
        },
        select: { lojaId: true, categoria: true },
      })
    : [];

  // 4. Buscar nomes das lojas envolvidas
  const allLojaIds = [
    ...new Set([
      ...currentComplaints.map((c) => c.lojaId!),
      ...previousComplaints.map((c) => c.lojaId!),
    ]),
  ];
  const lojas =
    allLojaIds.length > 0
      ? await prisma.rhLoja.findMany({
          where: { id: { in: allLojaIds } },
          select: { id: true, nome: true },
        })
      : [];
  const lojaNomeById = new Map(lojas.map((l) => [l.id, l.nome]));

  // 5. Agrupar por loja×categoria
  type CountMap = Map<string, Map<string, number>>; // lojaId → categoria → count

  const countComplaints = (
    list: { lojaId: string | null; categoria: string | null }[],
  ): CountMap => {
    const map: CountMap = new Map();
    for (const c of list) {
      if (!c.lojaId || !c.categoria) continue;
      const byLoja = map.get(c.lojaId) ?? new Map<string, number>();
      byLoja.set(c.categoria, (byLoja.get(c.categoria) ?? 0) + 1);
      map.set(c.lojaId, byLoja);
    }
    return map;
  };

  const currentMap = countComplaints(currentComplaints);
  const previousMap = countComplaints(previousComplaints);

  // 6. Coletar todas as combinações loja×categoria de ambos os meses
  const allCombinations = new Set<string>();
  for (const [lojaId, cats] of currentMap) {
    for (const cat of cats.keys()) allCombinations.add(`${lojaId}|${cat}`);
  }
  for (const [lojaId, cats] of previousMap) {
    for (const cat of cats.keys()) allCombinations.add(`${lojaId}|${cat}`);
  }

  // 7. Montar linhas e fazer upsert
  const lines: ComplaintComparisonLine[] = [];

  for (const combo of allCombinations) {
    const [lojaId, categoria] = combo.split('|') as [string, string];
    const lojaNome = lojaNomeById.get(lojaId) ?? lojaId;
    const contagemMesAtual = currentMap.get(lojaId)?.get(categoria) ?? 0;
    const contagemMesAnterior = previousMap.get(lojaId)?.get(categoria) ?? 0;
    const variacaoAbsoluta = contagemMesAtual - contagemMesAnterior;
    const variacaoPercentual =
      contagemMesAnterior === 0
        ? null
        : Math.round(
            ((contagemMesAtual - contagemMesAnterior) / contagemMesAnterior) * 100 * 10,
          ) / 10;

    await prisma.complaintComparison.upsert({
      where: {
        reviewRunId_lojaId_categoria: { reviewRunId, lojaId, categoria },
      },
      create: {
        reviewRunId,
        previousRunId: previousRun?.id ?? null,
        lojaId,
        lojaNome,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        categoria: categoria as any,
        contagemMesAtual,
        contagemMesAnterior,
        variacaoAbsoluta,
        variacaoPercentual,
      },
      update: {
        contagemMesAtual,
        contagemMesAnterior,
        variacaoAbsoluta,
        variacaoPercentual,
        previousRunId: previousRun?.id ?? null,
      },
    });

    lines.push({
      lojaId,
      lojaNome,
      categoria,
      contagemMesAtual,
      contagemMesAnterior,
      variacaoAbsoluta,
      variacaoPercentual,
    });
  }

  return lines;
}
