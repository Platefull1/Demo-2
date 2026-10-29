import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calcularAdicionalNoturnoPeriodo } from './fechamento-adicional-noturno';

const ymd = (s: string) => new Date(`${s}T00:00:00.000Z`);

const vigNoturna = {
  vigenciaInicio: ymd('2026-01-01'),
  vigenciaFim: null,
  diasFolga: ['Dom'],
  domingoFolga: null as string | null,
  horarioEntrada: '18:00',
  horarioSaida: '00:00',
  escala: '6x1',
};

describe('calcularAdicionalNoturnoPeriodo', () => {
  it('soma hora reduzida dos dias com batida completa e lista pendência', () => {
    const r = calcularAdicionalNoturnoPeriodo({
      dataInicialYmd: '2026-10-20',
      dataFinalYmd: '2026-10-22',
      vigencias: [vigNoturna],
      ocorrencias: [],
      registros: [
        {
          data: ymd('2026-10-20'),
          entrada1: '18:00',
          saida1: '00:40',
        },
        {
          data: ymd('2026-10-21'),
          entrada1: '18:00',
        },
      ],
    });
    // 20 ter: 120 relógio → 137 considerados; 21 qua: ímpar; 22 qui: sem batida
    assert.equal(r.adicionalNoturnoMinutos, 137);
    assert.equal(r.adicionalNoturnoHhMm, '02:17');
    assert.deepEqual(r.diasPendencia, ['2026-10-21']);
  });

  it('ignora férias e afastamento', () => {
    const r = calcularAdicionalNoturnoPeriodo({
      dataInicialYmd: '2026-10-20',
      dataFinalYmd: '2026-10-21',
      dataGozoFerias: '2026-10-20',
      diasFeriasGozados: 1,
      vigencias: [vigNoturna],
      ocorrencias: [
        {
          tipo: 'atestado_medico',
          dataInicioAfastamento: '2026-10-21',
          dataFimAfastamento: '2026-10-21',
          ativo: true,
        },
      ],
      registros: [
        { data: ymd('2026-10-20'), entrada1: '18:00', saida1: '00:00' },
        { data: ymd('2026-10-21'), entrada1: '18:00', saida1: '00:00' },
      ],
    });
    assert.equal(r.adicionalNoturnoMinutos, 0);
    assert.deepEqual(r.diasPendencia, []);
  });
});
