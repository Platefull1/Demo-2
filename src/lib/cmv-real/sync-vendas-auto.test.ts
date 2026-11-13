import { describe, expect, it } from 'vitest';
import {
  addDaysYmd,
  competenciasNoIntervalo,
  janelaPadraoSyncAuto,
} from './sync-vendas-auto';

describe('janelaPadraoSyncAuto', () => {
  it('dia 15: só mês corrente até ontem', () => {
    // 2026-11-15 12:00 UTC = manhã SP
    const r = janelaPadraoSyncAuto(new Date('2026-11-15T15:00:00.000Z'));
    expect(r.de).toBe('2026-11-01');
    expect(r.ate).toBe('2026-11-14');
    expect(r.competencias).toEqual(['2026-11']);
  });

  it('dia 2: inclui mês anterior', () => {
    const r = janelaPadraoSyncAuto(new Date('2026-11-02T15:00:00.000Z'));
    expect(r.de).toBe('2026-10-01');
    expect(r.ate).toBe('2026-11-01');
    expect(r.competencias).toEqual(['2026-10', '2026-11']);
  });

  it('dia 1: só mês anterior inteiro', () => {
    const r = janelaPadraoSyncAuto(new Date('2026-11-01T15:00:00.000Z'));
    expect(r.de).toBe('2026-10-01');
    expect(r.ate).toBe('2026-10-31');
    expect(r.competencias).toEqual(['2026-10']);
  });
});

describe('competenciasNoIntervalo / addDaysYmd', () => {
  it('cruza meses', () => {
    expect(competenciasNoIntervalo('2026-10-28', '2026-11-03')).toEqual([
      '2026-10',
      '2026-11',
    ]);
  });

  it('addDaysYmd', () => {
    expect(addDaysYmd('2026-11-01', -1)).toBe('2026-10-31');
  });
});
