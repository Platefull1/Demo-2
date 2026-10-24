import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { classificarDia, analisarBatidas } from './classificarDia';
import { escalaEhFolgaNoDia, sundaySlotInMonth } from './escala-dia';
import { calcularFaltasEDsrPeriodo } from './fechamento-faltas';

const ymd = (s: string) => new Date(`${s}T00:00:00.000Z`);

const escalaSegFolga = {
  diasFolga: ['Seg'],
  domingoFolga: '1' as string | null,
  horarioEntrada: '08:00',
  horarioSaida: '17:00',
  escala: '6x1',
};

describe('escalaEhFolgaNoDia', () => {
  it('dia fixo da semana', () => {
    // 2026-10-19 = segunda
    assert.equal(escalaEhFolgaNoDia({ diasFolga: ['Seg'] }, ymd('2026-10-19')), true);
    assert.equal(escalaEhFolgaNoDia({ diasFolga: ['Seg'] }, ymd('2026-10-20')), false);
  });

  it('domingo N-ésimo e ultimo', () => {
    // Out/2026: 4,11,18,25 — último = 25
    assert.deepEqual(sundaySlotInMonth('2026-10-04'), { nth: 1, isLast: false });
    assert.deepEqual(sundaySlotInMonth('2026-10-25'), { nth: 4, isLast: true });
    assert.equal(
      escalaEhFolgaNoDia({ diasFolga: [], domingoFolga: '1' }, ymd('2026-10-04')),
      true,
    );
    assert.equal(
      escalaEhFolgaNoDia({ diasFolga: [], domingoFolga: '1' }, ymd('2026-10-11')),
      false,
    );
    assert.equal(
      escalaEhFolgaNoDia({ diasFolga: [], domingoFolga: 'ultimo' }, ymd('2026-10-25')),
      true,
    );
    assert.equal(
      escalaEhFolgaNoDia({ diasFolga: [], domingoFolga: 'ultimo' }, ymd('2026-10-18')),
      false,
    );
  });
});

describe('analisarBatidas', () => {
  it('vazio / completo / ímpar', () => {
    assert.deepEqual(analisarBatidas(null), { temBatidas: false, completo: false });
    assert.deepEqual(
      analisarBatidas({ entrada1: '08:00', saida1: '12:00' }),
      { temBatidas: true, completo: true },
    );
    assert.deepEqual(
      analisarBatidas({ entrada1: '08:00' }),
      { temBatidas: true, completo: false },
    );
  });
});

describe('classificarDia', () => {
  it('FORA_VINCULO antes da admissão', () => {
    const r = classificarDia({
      data: ymd('2026-10-01'),
      dataAdmissao: '2026-10-10',
      escalaVigente: escalaSegFolga,
    });
    assert.equal(r.status, 'FORA_VINCULO');
  });

  it('AFASTADO tem prioridade sobre escala', () => {
    const r = classificarDia({
      data: ymd('2026-10-20'),
      escalaVigente: escalaSegFolga,
      ocorrencias: [
        {
          tipo: 'atestado_medico',
          dataInicioAfastamento: '2026-10-18',
          dataFimAfastamento: '2026-10-22',
        },
      ],
    });
    assert.equal(r.status, 'AFASTADO');
    assert.equal(r.motivo, 'atestado_medico');
  });

  it('FERIAS por intervalo [gozo, gozo+dias)', () => {
    const r = classificarDia({
      data: ymd('2026-10-05'),
      dataGozoFerias: '2026-10-01',
      diasFeriasGozados: 10,
      escalaVigente: escalaSegFolga,
    });
    assert.equal(r.status, 'FERIAS');
    // último dia exclusivo: 10 → 01..09
    const fora = classificarDia({
      data: ymd('2026-10-11'),
      dataGozoFerias: '2026-10-01',
      diasFeriasGozados: 10,
      escalaVigente: escalaSegFolga,
      batidas: { entrada1: '08:00', saida1: '17:00' },
    });
    assert.notEqual(fora.status, 'FERIAS');
  });

  it('férias atravessando virada do mês', () => {
    const r = classificarDia({
      data: ymd('2026-11-02'),
      dataGozoFerias: '2026-10-25',
      diasFeriasGozados: 15,
      escalaVigente: escalaSegFolga,
    });
    assert.equal(r.status, 'FERIAS');
  });

  it('fallback statusFerias gozando sem datas', () => {
    const r = classificarDia({
      data: ymd('2026-10-20'),
      statusFerias: 'gozando',
      escalaVigente: escalaSegFolga,
    });
    assert.equal(r.status, 'FERIAS');
    assert.match(r.motivo, /sem datas/);
  });

  it('SEM_ESCALA sem vigência ou sem folgas', () => {
    assert.equal(
      classificarDia({ data: ymd('2026-10-20'), escalaVigente: null }).status,
      'SEM_ESCALA',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'),
        escalaVigente: {
          diasFolga: [],
          domingoFolga: null,
          horarioEntrada: '08:00',
          horarioSaida: '17:00',
        },
      }).status,
      'SEM_ESCALA',
    );
  });

  it('FOLGA e TRABALHOU_NA_FOLGA', () => {
    // segunda = folga
    assert.equal(
      classificarDia({ data: ymd('2026-10-19'), escalaVigente: escalaSegFolga }).status,
      'FOLGA',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-19'),
        escalaVigente: escalaSegFolga,
        batidas: { entrada1: '08:00', saida1: '12:00' },
      }).status,
      'TRABALHOU_NA_FOLGA',
    );
  });

  it('SEM_REGISTRO / FALTA_JUSTIFICADA / NORMAL / PENDENCIA', () => {
    // terça = trabalho; "agora" = dia seguinte (BRT) para não cair em AGUARDANDO
    const depois = new Date('2026-10-21T15:00:00.000Z');
    // Sem batidas e sem ocorrência → SEM_REGISTRO (FALTA só confirmada pelo Secullum)
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'),
        escalaVigente: escalaSegFolga,
        agora: depois,
      }).status,
      'SEM_REGISTRO',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'),
        escalaVigente: escalaSegFolga,
        ocorrencias: [{ tipo: 'falta_justificada', data: '2026-10-20' }],
        agora: depois,
      }).status,
      'FALTA_JUSTIFICADA',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'),
        escalaVigente: escalaSegFolga,
        batidas: { entrada1: '08:00', saida1: '17:00' },
      }).status,
      'NORMAL',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'),
        escalaVigente: escalaSegFolga,
        batidas: { entrada1: '08:00' },
      }).status,
      'PENDENCIA',
    );
  });

  it('AGUARDANDO antes de entrada+30min no dia de hoje', () => {
    // Simula "agora" = 2026-10-20 08:10 BRT (= 11:10 UTC)
    const agora = new Date('2026-10-20T11:10:00.000Z');
    const r = classificarDia({
      data: ymd('2026-10-20'),
      escalaVigente: escalaSegFolga,
      agora,
    });
    assert.equal(r.status, 'AGUARDANDO');
  });

  it('não trata ativo=false (regra não existe no classificarDia)', () => {
    const r = classificarDia({
      data: ymd('2026-10-20'),
      escalaVigente: escalaSegFolga,
      agora: new Date('2026-10-21T15:00:00.000Z'),
    });
    // Sem batidas → SEM_REGISTRO; FALTA só após confirmação Secullum
    assert.equal(r.status, 'SEM_REGISTRO');
  });

  it('troca de vigência no meio do mês', () => {
    const vigAntiga = { ...escalaSegFolga, diasFolga: ['Seg'] };
    const vigNova = { ...escalaSegFolga, diasFolga: ['Ter'] };
    const depois = new Date('2026-10-21T15:00:00.000Z');

    assert.equal(
      classificarDia({
        data: ymd('2026-10-12'), // seg
        escalaVigente: vigAntiga,
      }).status,
      'FOLGA',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-13'), // ter
        escalaVigente: vigAntiga,
        agora: depois,
      }).status,
      'SEM_REGISTRO',
    );
    assert.equal(
      classificarDia({
        data: ymd('2026-10-20'), // ter
        escalaVigente: vigNova,
      }).status,
      'FOLGA',
    );
  });
});

describe('calcularFaltasEDsrPeriodo', () => {
  it('identifica dias SEM_REGISTRO sem acumular faltas (resolução via Secullum)', () => {
    const vigencias = [
      {
        vigenciaInicio: ymd('2026-01-01'),
        vigenciaFim: null,
        diasFolga: ['Dom'],
        domingoFolga: null as string | null,
        horarioEntrada: '08:00',
        horarioSaida: '16:00', // 8h
        escala: '5x2',
      },
    ];
    // 19 seg, 20 ter, 21 qua — sem batidas → 3 dias SEM_REGISTRO
    // Faltas e DSR ficam zerados aqui; resolução ocorre na route via Secullum.
    const r = calcularFaltasEDsrPeriodo({
      dataInicialYmd: '2026-10-19',
      dataFinalYmd: '2026-10-21',
      vigencias,
      ocorrencias: [],
      registros: [],
    });
    assert.equal(r.faltasDias, 0,  'faltas devem ser 0 antes da resolução Secullum');
    assert.equal(r.faltasHhMm, '00:00');
    assert.equal(r.faltaDsrDias, 0, 'DSR deve ser 0 antes da resolução Secullum');
    assert.equal(r.faltaDsrHhMm, '00:00');
    assert.equal(r.diasSemRegistro.length, 3, 'três dias de trabalho sem batidas');
    assert.equal(r.diasSemRegistro[0]!.jornadaMinutos, 480);
    assert.ok(r.dias.every(d => d.status === 'SEM_REGISTRO'), 'todos SEM_REGISTRO antes da resolução');
  });

  it('FALTA_JUSTIFICADA não vira SEM_REGISTRO', () => {
    const vigencias = [
      {
        vigenciaInicio: ymd('2026-01-01'),
        vigenciaFim: null,
        diasFolga: ['Dom'],
        domingoFolga: null as string | null,
        horarioEntrada: '08:00',
        horarioSaida: '16:00',
        escala: '5x2',
      },
    ];
    const r = calcularFaltasEDsrPeriodo({
      dataInicialYmd: '2026-10-20',
      dataFinalYmd: '2026-10-20',
      vigencias,
      ocorrencias: [{ tipo: 'falta_justificada', data: '2026-10-20', ativo: true }],
      registros: [],
    });
    assert.equal(r.dias[0]?.status, 'FALTA_JUSTIFICADA');
    assert.equal(r.diasSemRegistro.length, 0);
  });
});
