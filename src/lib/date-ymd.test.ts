import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMonthLong,
  parseYm,
  addMonthsYm,
  ymFromYmd,
  todayYmd,
} from './date-ymd';
import { competenciaMesAnterior } from './holerites/rh-panel';

describe('parseYm / formatMonthLong — valor vazio (tela holerites sem competência)', () => {
  it('parseYm retorna null para undefined, null e string vazia', () => {
    assert.equal(parseYm(undefined), null);
    assert.equal(parseYm(null), null);
    assert.equal(parseYm(''), null);
    assert.equal(parseYm('   '), null);
    assert.equal(parseYm('2026'), null);
  });

  it('parseYm aceita yyyy-MM válido', () => {
    assert.deepEqual(parseYm('2026-10'), { year: 2026, month: 10 });
    assert.deepEqual(parseYm('2026-01-15'), { year: 2026, month: 1 });
  });

  it('formatMonthLong não chama slice em undefined — placeholder', () => {
    assert.equal(formatMonthLong(undefined), 'Selecionar mês');
    assert.equal(formatMonthLong(null), 'Selecionar mês');
    assert.equal(formatMonthLong(''), 'Selecionar mês');
  });

  it('formatMonthLong formata competência válida', () => {
    assert.match(formatMonthLong('2026-10'), /Outubro de 2026/i);
  });
});

describe('competência fallback (tenant sem holerites)', () => {
  it('competenciaMesAnterior devolve yyyy-MM do mês anterior em SP', () => {
    const ym = competenciaMesAnterior(new Date('2026-11-20T12:00:00-03:00'));
    assert.equal(ym, '2026-10');
    assert.ok(parseYm(ym));
  });

  it('MonthPicker-equivalent: value undefined → yearFrom fallback sem throw', () => {
    // Espelha yearFromValue do MonthPicker: nunca .slice em undefined
    const value: string | undefined = undefined;
    const parsed = parseYm(value);
    const year =
      parsed?.year ??
      Number(ymFromYmd(todayYmd()).slice(0, 4)) ??
      new Date().getFullYear();
    assert.ok(Number.isFinite(year) && year >= 2020);
  });

  it('painel vazio: monthPickerValue nunca fica undefined', () => {
    const competencia = '';
    const resolvedCompetencia = '';
    const fallback = competenciaMesAnterior();
    const monthPickerValue =
      resolvedCompetencia || competencia || fallback;
    assert.ok(monthPickerValue);
    assert.ok(parseYm(monthPickerValue));
    // defaultCompetencia do "novo lote" também
    assert.ok(parseYm(addMonthsYm(ymFromYmd(todayYmd()), -1)));
  });
});
