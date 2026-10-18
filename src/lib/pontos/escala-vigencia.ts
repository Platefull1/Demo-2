import type { Prisma, PrismaClient } from '@prisma/client';
import { addDaysYmd, ymdToUtcDate } from '@/lib/pontos/escala-dia';

type Tx = Prisma.TransactionClient | PrismaClient;

export type SnapshotEscala = {
  escala: string;
  diasFolga: unknown;
  domingoFolga: string | null;
  horarioEntrada: string;
  horarioSaida: string;
};

/** Encontra a vigência que cobre YYYY-MM-DD (lista já carregada). */
export function vigenciasParaData<
  T extends { vigenciaInicio: Date; vigenciaFim: Date | null },
>(vigencias: T[], ymd: string): T | null {
  const dia = ymdToUtcDate(ymd);
  const candidatas = vigencias.filter((v) => {
    const ini = v.vigenciaInicio;
    const fim = v.vigenciaFim;
    if (ini > dia) return false;
    if (fim != null && fim < dia) return false;
    return true;
  });
  if (candidatas.length === 0) return null;
  candidatas.sort((a, b) => b.vigenciaInicio.getTime() - a.vigenciaInicio.getTime());
  return candidatas[0] ?? null;
}

/**
 * Ao salvar escala na ficha:
 * - remove vigências com início >= valeAPartir
 * - fecha a que cobria valeAPartir (fim = ontem relativo a valeAPartir)
 * - se a aberta começou no mesmo dia, só atualiza
 * - cria nova a partir de valeAPartir
 */
export async function aplicarNovaEscalaVigencia(
  tx: Tx,
  funcionarioId: string,
  snapshot: SnapshotEscala,
  valeAPartirYmd: string,
): Promise<void> {
  const inicio = ymdToUtcDate(valeAPartirYmd);
  const ontemYmd = addDaysYmd(valeAPartirYmd, -1);
  const ontem = ymdToUtcDate(ontemYmd);

  const todas = await tx.rhEscalaVigencia.findMany({
    where: { funcionarioId },
    orderBy: { vigenciaInicio: 'asc' },
  });

  const mesmaData = todas.find(
    (v) => v.vigenciaInicio.toISOString().slice(0, 10) === valeAPartirYmd && v.vigenciaFim == null,
  );
  if (mesmaData) {
    await tx.rhEscalaVigencia.update({
      where: { id: mesmaData.id },
      data: {
        escala: snapshot.escala,
        diasFolga: snapshot.diasFolga as Prisma.InputJsonValue,
        domingoFolga: snapshot.domingoFolga,
        horarioEntrada: snapshot.horarioEntrada,
        horarioSaida: snapshot.horarioSaida,
      },
    });
    return;
  }

  // Remove futuras / a partir de valeAPartir (serão substituídas)
  const aRemover = todas.filter((v) => v.vigenciaInicio >= inicio);
  if (aRemover.length > 0) {
    await tx.rhEscalaVigencia.deleteMany({
      where: { id: { in: aRemover.map((v) => v.id) } },
    });
  }

  const restantes = todas.filter((v) => v.vigenciaInicio < inicio);
  const cobrindo = [...restantes].reverse().find((v) => {
    if (v.vigenciaFim == null) return true;
    return v.vigenciaFim >= inicio;
  });

  if (cobrindo) {
    // Se a vigência começa no mesmo dia que estamos fechando ontem < inicio, ok
    if (cobrindo.vigenciaInicio.toISOString().slice(0, 10) === valeAPartirYmd) {
      await tx.rhEscalaVigencia.update({
        where: { id: cobrindo.id },
        data: {
          escala: snapshot.escala,
          diasFolga: snapshot.diasFolga as Prisma.InputJsonValue,
          domingoFolga: snapshot.domingoFolga,
          horarioEntrada: snapshot.horarioEntrada,
          horarioSaida: snapshot.horarioSaida,
          vigenciaFim: null,
        },
      });
      return;
    }
    const fim =
      ontem >= cobrindo.vigenciaInicio
        ? ontem
        : cobrindo.vigenciaInicio; // evita fim < início
    await tx.rhEscalaVigencia.update({
      where: { id: cobrindo.id },
      data: { vigenciaFim: fim },
    });
  }

  await tx.rhEscalaVigencia.create({
    data: {
      funcionarioId,
      vigenciaInicio: inicio,
      vigenciaFim: null,
      escala: snapshot.escala,
      diasFolga: snapshot.diasFolga as Prisma.InputJsonValue,
      domingoFolga: snapshot.domingoFolga,
      horarioEntrada: snapshot.horarioEntrada,
      horarioSaida: snapshot.horarioSaida,
    },
  });
}
