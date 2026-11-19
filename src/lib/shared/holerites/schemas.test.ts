import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  cpfSchema,
  competenciaSchema,
  limparCpfDigits,
  normalizeTelefoneBr,
  validarCpfDigits,
} from './schemas';
import {
  labelCompetencia,
  labelPayslipType,
  labelPayslipStatusColaborador,
  labelPayslipStatusRh,
} from './labels';

describe('holerites/schemas CPF', () => {
  it('aceita CPF válido sem máscara', () => {
    // 529.982.247-25
    const r = cpfSchema.safeParse('52998224725');
    assert.equal(r.success, true);
    if (r.success) assert.equal(r.data, '52998224725');
  });

  it('aceita CPF válido com máscara', () => {
    const r = cpfSchema.safeParse('529.982.247-25');
    assert.equal(r.success, true);
    if (r.success) assert.equal(r.data, '52998224725');
  });

  it('rejeita sequência repetida', () => {
    assert.equal(validarCpfDigits('11111111111'), false);
    assert.equal(cpfSchema.safeParse('111.111.111-11').success, false);
  });

  it('rejeita CPF inválido', () => {
    assert.equal(cpfSchema.safeParse('12345678901').success, false);
    assert.equal(limparCpfDigits('abc'), '');
  });
});

describe('holerites/schemas competência e telefone', () => {
  it('valida competência YYYY-MM', () => {
    assert.equal(competenciaSchema.safeParse('2026-10').success, true);
    assert.equal(competenciaSchema.safeParse('2026-13').success, false);
    assert.equal(competenciaSchema.safeParse('2026-00').success, false);
  });

  it('normaliza telefone BR para 55+DDD+número', () => {
    assert.equal(normalizeTelefoneBr('(41) 99999-8888'), '5541999998888');
    assert.equal(normalizeTelefoneBr('41999998888'), '5541999998888');
    assert.equal(normalizeTelefoneBr('5541999998888'), '5541999998888');
    assert.equal(normalizeTelefoneBr('4133334444'), '554133334444');
    assert.equal(normalizeTelefoneBr('123'), null);
    assert.equal(normalizeTelefoneBr(null), null);
  });
});

describe('holerites/labels', () => {
  it('formata competência e tipos', () => {
    assert.equal(labelCompetencia('2026-10'), 'Outubro/2026');
    assert.equal(labelPayslipType('DECIMO_TERCEIRO_1'), '13º salário – 1ª parcela');
    assert.equal(labelPayslipType('MENSAL'), 'Mensal');
  });

  it('labels de status RH e colaborador', () => {
    assert.equal(labelPayslipStatusRh('ACKNOWLEDGED'), 'Com ciência');
    assert.equal(labelPayslipStatusColaborador('PUBLISHED'), 'Novo');
    assert.equal(labelPayslipStatusColaborador('ACKNOWLEDGED'), 'Confirmado');
  });
});
