import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calcularAdicionalNoturnoDia,
  intersecaoIntervalos,
  minutosIntersecao,
  type BatidasAdicional,
} from './adicional-noturno';

function batidas(partial: BatidasAdicional): BatidasAdicional {
  return {
    entrada1: null,
    saida1: null,
    entrada2: null,
    saida2: null,
    entrada3: null,
    saida3: null,
    ...partial,
  };
}

describe('intersecaoIntervalos', () => {
  it('[ini, fim) — overlap, adjacente e vazio', () => {
    assert.deepEqual(intersecaoIntervalos({ ini: 0, fim: 100 }, { ini: 50, fim: 150 }), {
      ini: 50,
      fim: 100,
    });
    assert.equal(intersecaoIntervalos({ ini: 0, fim: 60 }, { ini: 60, fim: 120 }), null);
    assert.equal(minutosIntersecao({ ini: 1320, fim: 1440 }, { ini: 1320, fim: 1740 }), 120);
  });
});

describe('calcularAdicionalNoturnoDia', () => {
  it('18:00–00:00 com intervalo: 22:00–00:00 = 120 relógio / 137 considerados', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({
        entrada1: '18:00',
        saida1: '21:00',
        entrada2: '22:00',
        saida2: '00:00',
      }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 120);
    assert.equal(r.minutosConsiderados, 137);
  });

  it('18:00–00:00 batidas 18:00–00:40: extras depois da jornada ficam de fora', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '18:00', saida1: '00:40' }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 120);
    assert.equal(r.minutosConsiderados, 137);
  });

  it('17:00–23:00 = 60 relógio', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '17:00', saida1: '23:00' }),
      horarioEntrada: '17:00',
      horarioSaida: '23:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 60);
    assert.equal(r.minutosConsiderados, 69);
  });

  it('diurno 08:00–17:00 = 0', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '08:00', saida1: '12:00', entrada2: '13:00', saida2: '17:00' }),
      horarioEntrada: '08:00',
      horarioSaida: '17:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 0);
    assert.equal(r.minutosConsiderados, 0);
  });

  it('18:00–02:00 com intervalo: 30 + 180 = 210 relógio', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({
        entrada1: '18:00',
        saida1: '22:30',
        entrada2: '23:00',
        saida2: '02:00',
      }),
      horarioEntrada: '18:00',
      horarioSaida: '02:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 210);
    assert.equal(r.minutosConsiderados, 240);
  });

  it('batidas ímpares → PENDENCIA, 0', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '18:00' }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'PENDENCIA');
    assert.equal(r.minutosRelogio, 0);
    assert.equal(r.minutosConsiderados, 0);
  });

  it('ehFolga = true → FOLGA, 0 (mesmo com batidas)', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '18:00', saida1: '00:00' }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: true,
    });
    assert.equal(r.status, 'FOLGA');
    assert.equal(r.minutosRelogio, 0);
    assert.equal(r.minutosConsiderados, 0);
  });

  it('entrada 04:00 escala 04:00–12:00 → 60 relógio (janela madrugada)', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '04:00', saida1: '12:00' }),
      horarioEntrada: '04:00',
      horarioSaida: '12:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 60);
    assert.equal(r.minutosConsiderados, 69);
  });
});
