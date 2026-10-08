import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { storeSlugFromLojaNome, competenciaAnterior } from './lojas';
import { semanaFromDataEntrada } from './dates';
import { qtdContagemParaKg } from './contagem';

describe('lojaNome → storeSlug', () => {
  it('normaliza ahú / ahu', () => {
    assert.equal(storeSlugFromLojaNome('Ahú'), 'ahu');
    assert.equal(storeSlugFromLojaNome('ahu'), 'ahu');
    assert.equal(storeSlugFromLojaNome('Calenzano Ahú'), 'ahu');
  });
  it('portão / portao', () => {
    assert.equal(storeSlugFromLojaNome('Portão'), 'portao');
    assert.equal(storeSlugFromLojaNome('portao'), 'portao');
  });
  it('desconhecido → null', () => {
    assert.equal(storeSlugFromLojaNome('Centro'), null);
    assert.equal(storeSlugFromLojaNome(null), null);
  });
});

describe('semanas fixas', () => {
  it('faixas 1–5', () => {
    // 2026-10-01 Thursday UTC noon ≈ Brasília same day
    assert.equal(semanaFromDataEntrada('2026-10-01T15:00:00.000Z'), 1);
    assert.equal(semanaFromDataEntrada('2026-10-08T15:00:00.000Z'), 2);
    assert.equal(semanaFromDataEntrada('2026-10-15T15:00:00.000Z'), 3);
    assert.equal(semanaFromDataEntrada('2026-10-22T15:00:00.000Z'), 4);
    assert.equal(semanaFromDataEntrada('2026-10-29T15:00:00.000Z'), 5);
  });
});

describe('competenciaAnterior', () => {
  it('volta um mês', () => {
    assert.equal(competenciaAnterior('2026-10'), '2026-09');
    assert.equal(competenciaAnterior('2026-01'), '2025-12');
  });
});

describe('qtdContagemParaKg', () => {
  it('já em kg quando item tinha kgPorUnidade', () => {
    const r = qtdContagemParaKg(18, {
      modoContagem: 'unidade',
      kgPorUnidadeItem: 0.9,
      kgPorUnidadeConfig: 0.9,
    });
    assert.equal(r.qtdKg, 18);
    assert.equal(r.convertidaDeUnidade, false);
  });
  it('converte com config se item sem fator', () => {
    const r = qtdContagemParaKg(20, {
      modoContagem: 'unidade',
      kgPorUnidadeItem: null,
      kgPorUnidadeConfig: 0.9,
    });
    assert.equal(r.qtdKg, 18);
    assert.equal(r.convertidaDeUnidade, true);
  });
});
