import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  agruparPaginas,
  detectarPaginaSemTexto,
  extrairCpfsDaPagina,
  extrairLiquido,
} from './pdf-ingest';

describe('extrairCpfsDaPagina', () => {
  it('aceita CPF com máscara', () => {
    const { principal } = extrairCpfsDaPagina('Funcionário CPF: 390.533.447-05');
    assert.equal(principal, '39053344705');
  });

  it('aceita CPF sem máscara', () => {
    const { principal } = extrairCpfsDaPagina('Documento 39053344705 folha');
    assert.equal(principal, '39053344705');
  });

  it('ignora CNPJ (14 dígitos)', () => {
    const { principal, outros } = extrairCpfsDaPagina(
      'Empresa CNPJ 11.222.333/0001-81 sem empregado',
    );
    assert.equal(principal, null);
    assert.deepEqual(outros, []);
  });

  it('ignora CPF inválido / sequência repetida', () => {
    const { principal } = extrairCpfsDaPagina('CPF 111.111.111-11 e 123.456.789-00');
    assert.equal(principal, null);
  });

  it('com CPF e CNPJ, prioriza CPF perto do rótulo', () => {
    const texto = [
      'EMPREGADOR CNPJ: 11.222.333/0001-81',
      'Nome: Fulano',
      'CPF do empregado: 390.533.447-05',
      'Outro dado 52998224725',
    ].join('\n');
    const { principal, outros } = extrairCpfsDaPagina(texto);
    assert.equal(principal, '39053344705');
    assert.ok(outros.includes('52998224725'));
  });
});

describe('detectarPaginaSemTexto', () => {
  it('marca página quase vazia', () => {
    assert.equal(detectarPaginaSemTexto('   \n  '), true);
    assert.equal(detectarPaginaSemTexto('abc'), true);
    assert.equal(
      detectarPaginaSemTexto('Líquido a receber 1.234,56 CPF 390.533.447-05'),
      false,
    );
  });
});

describe('agruparPaginas', () => {
  it('1 página por funcionário', () => {
    const { grupos, semVinculo } = agruparPaginas([
      { index: 0, cpf: '39053344705', semTexto: false },
      { index: 1, cpf: '52998224725', semTexto: false },
    ]);
    assert.equal(grupos.length, 2);
    assert.deepEqual(grupos[0]!.pageIndexes, [0]);
    assert.deepEqual(grupos[1]!.pageIndexes, [1]);
    assert.equal(semVinculo.length, 0);
  });

  it('holerite de 2 páginas com CPF só na 1ª', () => {
    const { grupos, semVinculo } = agruparPaginas([
      { index: 0, cpf: '39053344705', semTexto: false },
      { index: 1, cpf: null, semTexto: false },
    ]);
    assert.equal(grupos.length, 1);
    assert.deepEqual(grupos[0]!.pageIndexes, [0, 1]);
    assert.equal(semVinculo.length, 0);
  });

  it('2 páginas seguidas do mesmo CPF', () => {
    const { grupos } = agruparPaginas([
      { index: 0, cpf: '39053344705', semTexto: false },
      { index: 1, cpf: '39053344705', semTexto: false },
    ]);
    assert.equal(grupos.length, 1);
    assert.deepEqual(grupos[0]!.pageIndexes, [0, 1]);
  });

  it('página sem CPF entre dois funcionários → sem vínculo', () => {
    const { grupos, semVinculo } = agruparPaginas([
      { index: 0, cpf: '39053344705', semTexto: false },
      { index: 1, cpf: null, semTexto: false },
      { index: 2, cpf: '52998224725', semTexto: false },
    ]);
    assert.equal(grupos.length, 2);
    assert.deepEqual(grupos[0]!.pageIndexes, [0]);
    assert.deepEqual(grupos[1]!.pageIndexes, [2]);
    assert.equal(semVinculo.length, 1);
    assert.deepEqual(semVinculo[0]!.pageIndexes, [1]);
    assert.equal(semVinculo[0]!.motivo, 'sem_cpf');
  });

  it('página sem texto → sem vínculo', () => {
    const { grupos, semVinculo } = agruparPaginas([
      { index: 0, cpf: '39053344705', semTexto: false },
      { index: 1, cpf: null, semTexto: true },
      { index: 2, cpf: '39053344705', semTexto: false },
    ]);
    assert.equal(grupos.length, 2);
    assert.equal(semVinculo.length, 1);
    assert.equal(semVinculo[0]!.motivo, 'pagina_sem_texto');
  });
});

describe('extrairLiquido', () => {
  it('Líquido a receber 1.234,56 → 123456', () => {
    assert.equal(extrairLiquido('Líquido a receber 1.234,56'), 123456);
  });

  it('texto sem líquido → null', () => {
    assert.equal(extrairLiquido('Total de proventos 2.000,00'), null);
  });

  it('aceita Valor líquido sem acento', () => {
    assert.equal(extrairLiquido('Valor liquido: 990,50'), 99050);
  });
});
