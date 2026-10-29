import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  indiceColunaExata,
  parseHorarioHhMm,
  parsearLinhasCalcular,
  parsearTotaisCalcular,
  type SecullumCalcularBody,
} from './secullum-calcular';

/** Fixture anonimizado da resposta real do POST /Calcular (out/2026). */
const FIXTURE: SecullumCalcularBody = {
  Colunas: [
    'Data',
    'Entrada 1',
    'Saída 1',
    'Entrada 2',
    'Saída 2',
    'Entrada 3',
    'Saída 3',
    'Normais',
    'Faltas',
    'Ex60%',
    'Ex100%',
    'DSR',
    'DSR.Deb',
    'Not.',
    'EN60%',
    'EN100%',
    'Ajuste',
    'Abono2',
    'Abono3',
    'Abono4',
    'Atras.',
    'Adian.',
    'Folga',
    'Carga',
    'JustPa.',
    'T+/-',
    'ExInt',
    'Not.Tot.',
    'Refeição',
  ],
  Totais: [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '159:42',
    '00:00',
    '01:16',
    '06:46',
    '35:00',
    '00:00',
    '16:18',
    '31:52',
    '02:12',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '00:00',
    '34:35',
    '176:00',
    '',
    '00:00',
    '00:00',
    '50:22',
    '0',
  ],
  Linhas: [
    {
      Key: '2026-10-07T00:00:00',
      Value: [
        '07/10/2026 - Qua',
        '14:08',
        '17:23',
        '18:23',
        '00:00',
        null,
        null,
        '06:52',
        '',
        '',
        '',
        '',
        '',
        '00:03',
        '01:57',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '06:55',
        '',
        '',
        '',
        '02:00',
        '',
      ],
    },
    {
      Key: '2026-10-01T00:00:00',
      Value: [
        '01/10/2026 - Qui',
        'FOLGA',
        'FOLGA',
        'FOLGA',
        'FOLGA',
        'FOLGA',
        'FOLGA',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '06:55',
        '',
        '',
        '',
        '',
        '',
        '',
      ],
    },
    {
      Key: '2026-10-12T00:00:00',
      Value: [
        '12/10/2026 - Seg',
        'FALTA D',
        'FERIADO',
        'FALTA D',
        '',
        null,
        'xx',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '00:00',
        '',
      ],
    },
  ],
};

describe('parseHorarioHhMm', () => {
  it('aceita 00:00 e rejeita textos de cartão', () => {
    assert.equal(parseHorarioHhMm('00:00'), '00:00');
    assert.equal(parseHorarioHhMm('14:08'), '14:08');
    assert.equal(parseHorarioHhMm('FOLGA'), null);
    assert.equal(parseHorarioHhMm('FALTA D'), null);
    assert.equal(parseHorarioHhMm('FERIADO'), null);
    assert.equal(parseHorarioHhMm(''), null);
    assert.equal(parseHorarioHhMm(null), null);
    assert.equal(parseHorarioHhMm('24:00'), null);
  });
});

describe('indiceColunaExata', () => {
  it('não confunde Not. com Not.Tot. nem Entrada 1 com Entrada 2', () => {
    const cols = FIXTURE.Colunas!;
    assert.equal(cols[indiceColunaExata(cols, ['not.tot.'])], 'Not.Tot.');
    assert.equal(cols[indiceColunaExata(cols, ['not.'])], 'Not.');
    assert.equal(cols[indiceColunaExata(cols, ['entrada 1'])], 'Entrada 1');
    assert.equal(cols[indiceColunaExata(cols, ['saida 2'])], 'Saída 2');
  });
});

describe('parsearTotaisCalcular / parsearLinhasCalcular', () => {
  it('extrai Not.Tot. do total e batidas tratadas por dia', () => {
    const totais = parsearTotaisCalcular(FIXTURE);
    assert.equal(totais.en60, '31:52');
    assert.equal(totais.en100, '02:12');
    assert.equal(totais.notTot, '50:22');

    const linhas = parsearLinhasCalcular(FIXTURE);
    const dia07 = linhas.find((l) => l.ymd === '2026-10-07');
    assert.ok(dia07);
    assert.equal(dia07!.entrada1, '14:08');
    assert.equal(dia07!.saida1, '17:23');
    assert.equal(dia07!.entrada2, '18:23');
    assert.equal(dia07!.saida2, '00:00');
    assert.equal(dia07!.entrada3, null);
    assert.equal(dia07!.saida3, null);
    assert.equal(dia07!.notTot, '02:00');

    const folga = linhas.find((l) => l.ymd === '2026-10-01');
    assert.ok(folga);
    assert.equal(folga!.entrada1, null);
    assert.equal(folga!.saida2, null);
    assert.equal(folga!.notTot, null);

    const textos = linhas.find((l) => l.ymd === '2026-10-12');
    assert.ok(textos);
    assert.equal(textos!.entrada1, null);
    assert.equal(textos!.saida1, null);
    assert.equal(textos!.entrada2, null);
    assert.equal(textos!.notTot, '00:00');
  });
});
