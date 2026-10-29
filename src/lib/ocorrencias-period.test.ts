import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  currentMonthBoundsSP,
  spDayStart,
  spDayEnd,
  saoPauloYmd,
  formatOcorrenciaDateTime,
} from './ocorrencias-period';

describe('período America/Sao_Paulo', () => {
  it('23h do último dia do mês cai no mês certo', () => {
    const created = new Date('2026-10-31T23:30:00.000-03:00');
    const ymd = saoPauloYmd(created);
    assert.equal(ymd.year, 2026);
    assert.equal(ymd.month, 10);
    assert.equal(ymd.day, 31);

    const bounds = currentMonthBoundsSP(created);
    assert.equal(created >= bounds.start && created <= bounds.end, true);

    const nov = currentMonthBoundsSP(new Date('2026-11-01T00:30:00.000-03:00'));
    assert.equal(created >= nov.start, false);
  });

  it('virada de dia: 00:00 SP pertence ao dia novo', () => {
    const justAfter = new Date('2026-10-15T00:00:00.000-03:00');
    const justBefore = new Date('2026-10-14T23:59:59.000-03:00');
    assert.equal(saoPauloYmd(justAfter).day, 15);
    assert.equal(saoPauloYmd(justBefore).day, 14);
    assert.equal(justAfter >= spDayStart('2026-10-15'), true);
    assert.equal(justBefore <= spDayEnd('2026-10-14'), true);
  });

  it('formatOcorrenciaDateTime usa SP, não UTC', () => {
    const iso = '2026-10-31T23:15:00.000-03:00';
    const label = formatOcorrenciaDateTime(iso);
    assert.match(label, /31\/10\/26 23:15/);
    const utcIso = '2026-11-01T02:15:00.000Z';
    assert.match(formatOcorrenciaDateTime(utcIso), /31\/10\/26 23:15/);
  });
});
