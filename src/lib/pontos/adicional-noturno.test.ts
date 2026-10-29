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
  it('14:08/17:23/18:23/00:00 (ajuste RH) → 22:00–00:00 = 120', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({
        entrada1: '14:08',
        saida1: '17:23',
        entrada2: '18:23',
        saida2: '00:00',
      }),
      horarioEntrada: '15:40',
      horarioSaida: '23:35',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 120);
    assert.equal(r.minutosConsiderados, 120);
  });

  it('18:00–00:00 com intervalo: 22:00–00:00 = 120 relógio', () => {
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
    assert.equal(r.minutosConsiderados, 120);
  });

  it('18:00–00:00 batidas 18:00–00:40: extra depois da jornada entra (160 relógio)', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '18:00', saida1: '00:40' }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 160);
    assert.equal(r.minutosConsiderados, 160);
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
    assert.equal(r.minutosConsiderados, 60);
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
    assert.equal(r.minutosConsiderados, 210);
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

  it('ehFolga sem batidas → FOLGA, 0', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({}),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: true,
    });
    assert.equal(r.status, 'FOLGA');
    assert.equal(r.minutosRelogio, 0);
    assert.equal(r.minutosConsiderados, 0);
  });

  it('folga trabalhada 18:00–23:53 → 113 relógio / FOLGA_TRABALHADA', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({ entrada1: '18:00', saida1: '23:53' }),
      horarioEntrada: '18:00',
      horarioSaida: '00:00',
      ehFolga: true,
    });
    assert.equal(r.status, 'FOLGA_TRABALHADA');
    assert.equal(r.minutosRelogio, 113);
    assert.equal(r.minutosConsiderados, 113);
  });

  it('5º par 22:00–00:00 conta 120 relógio', () => {
    const r = calcularAdicionalNoturnoDia({
      batidas: batidas({
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
        entrada5: '22:00',
        saida5: '00:00',
      }),
      horarioEntrada: '08:00',
      horarioSaida: '17:00',
      ehFolga: false,
    });
    assert.equal(r.status, 'OK');
    assert.equal(r.minutosRelogio, 120);
    assert.equal(r.minutosConsiderados, 120);
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
    assert.equal(r.minutosConsiderados, 60);
  });
});
