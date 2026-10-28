/**
 * Testes da lib de conciliação de transferências.
 * npx tsx --test src/lib/nfe/transferencia-concilicao.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  classificarNfTransferencia,
  diffItens,
  ehCfopTransferencia,
  emitenteEhLojaCalenzano,
  linhasEspelho,
  montarEspelhoSaida,
  pendenciasDocumentoTransferencia,
  resolverCustoUnitario,
  statusDocumento,
  ladoGeraLancamento,
} from './transferencia-concilicao';

describe('CFOP e emitente Calenzano', () => {
  it('reconhece 5152 e 5409', () => {
    assert.equal(ehCfopTransferencia('5152'), true);
    assert.equal(ehCfopTransferencia('5409'), true);
    assert.equal(ehCfopTransferencia('5102'), false);
  });

  const mapaAhu = { ahu: '08821071000167' } as const;

  it('matriz 08821071000167 é loja Calenzano', () => {
    assert.equal(emitenteEhLojaCalenzano('08.821.071/0001-67'), true);
    assert.equal(emitenteEhLojaCalenzano('08821071000248'), true);
    assert.equal(emitenteEhLojaCalenzano('56944067000139'), false);
  });

  it('NF loja + CFOP 5152 → transferência', () => {
    const r = classificarNfTransferencia({
      emitenteCnpj: '08821071000167',
      destStoreSlug: 'pilarzinho',
      cfops: ['5152'],
      storeCnpjBySlug: mapaAhu,
    });
    assert.equal(r.isTransfer, true);
    assert.equal(r.origemSlug, 'ahu');
    assert.equal(r.emitenteCalenzano, true);
  });

  it('mesmo emitente da loja destino não vira transferência', () => {
    const r = classificarNfTransferencia({
      emitenteCnpj: '08821071000167',
      destStoreSlug: 'ahu',
      cfops: ['5152'],
      storeCnpjBySlug: mapaAhu,
    });
    assert.equal(r.isTransfer, false);
  });

  it('Saipos id sozinho já classifica', () => {
    const r = classificarNfTransferencia({
      emitenteCnpj: '123',
      destStoreSlug: 'ahu',
      cfops: ['5102'],
      saiposTransferenciaId: 99,
    });
    assert.equal(r.isTransfer, true);
  });
});

describe('resolverCustoUnitario', () => {
  it('usa último custo da origem', () => {
    const r = resolverCustoUnitario({
      ultimoCustoOrigem: 12.5,
      custoEstoqueInicialOrigem: 9,
      ultimoCustoQualquerLoja: 8,
    });
    assert.equal(r.custo, 12.5);
    assert.equal(r.origem, 'ULTIMO_CUSTO_ORIGEM');
    assert.equal(r.exigePreenchimento, false);
  });

  it('cai no estoque inicial da origem', () => {
    const r = resolverCustoUnitario({
      custoEstoqueInicialOrigem: 9,
      ultimoCustoQualquerLoja: 8,
    });
    assert.equal(r.origem, 'ESTOQUE_INICIAL_ORIGEM');
    assert.equal(r.custo, 9);
  });

  it('cai no último custo de qualquer loja', () => {
    const r = resolverCustoUnitario({ ultimoCustoQualquerLoja: 8 });
    assert.equal(r.origem, 'ULTIMO_CUSTO_QUALQUER_LOJA');
  });

  it('sem fallback obriga custo manual', () => {
    const r = resolverCustoUnitario({});
    assert.equal(r.origem, 'CUSTO_MANUAL');
    assert.equal(r.exigePreenchimento, true);
    assert.equal(r.custo, null);
  });

  it('custo informado sem fallback = manual preenchido', () => {
    const r = resolverCustoUnitario({ custoInformado: 3.2 });
    assert.equal(r.origem, 'CUSTO_MANUAL');
    assert.equal(r.custo, 3.2);
    assert.equal(r.exigePreenchimento, false);
  });
});

describe('statusDocumento / diff', () => {
  it('entrada sem saída confirmada → AGUARDANDO_SAIDA', () => {
    const r = statusDocumento({
      entradaRegistrada: true,
      saidaConfirmada: false,
      itensEntrada: [{ estoqueInsumoId: 'a', quantidade: 2 }],
    });
    assert.equal(r.status, 'AGUARDANDO_SAIDA');
  });

  it('lados iguais → CONCILIADA', () => {
    const itens = [
      { estoqueInsumoId: 'a', quantidade: 2 },
      { estoqueInsumoId: 'b', quantidade: 1 },
    ];
    const r = statusDocumento({
      entradaRegistrada: true,
      saidaConfirmada: true,
      itensSaida: itens,
      itensEntrada: montarEspelhoSaida(itens),
    });
    assert.equal(r.status, 'CONCILIADA');
    assert.equal(r.diffs.length, 0);
  });

  it('quantidade diferente → DIVERGENTE', () => {
    const r = statusDocumento({
      entradaRegistrada: true,
      saidaConfirmada: true,
      itensSaida: [{ estoqueInsumoId: 'a', quantidade: 2 }],
      itensEntrada: [{ estoqueInsumoId: 'a', quantidade: 1 }],
    });
    assert.equal(r.status, 'DIVERGENTE');
    assert.deepEqual(r.diffs, [{ estoqueInsumoId: 'a', qtdSaida: 2, qtdEntrada: 1 }]);
  });

  it('diff soma o mesmo insumo', () => {
    const diffs = diffItens(
      [
        { estoqueInsumoId: 'a', quantidade: 1 },
        { estoqueInsumoId: 'a', quantidade: 1 },
      ],
      [{ estoqueInsumoId: 'a', quantidade: 2 }],
    );
    assert.equal(diffs.length, 0);
  });

  it('espelho rascunho não lança CMV', () => {
    assert.equal(ladoGeraLancamento({ rascunho: true }), false);
    assert.equal(ladoGeraLancamento({ rascunho: false }), true);
  });

  it('linhasEspelho une os dois lados e marca divergência', () => {
    const linhas = linhasEspelho(
      [{ estoqueInsumoId: 'a', quantidade: 2, valorTotal: 20, custoUnitario: 10 }],
      [{ estoqueInsumoId: 'a', quantidade: 1, valorTotal: 10, custoUnitario: 10 },
       { estoqueInsumoId: 'b', quantidade: 3, valorTotal: 9, custoUnitario: 3 }],
    );
    assert.equal(linhas.length, 2);
    assert.equal(linhas[0].estoqueInsumoId, 'a');
    assert.equal(linhas[0].divergente, true);
    assert.equal(linhas[0].qtdSaida, 2);
    assert.equal(linhas[0].qtdEntrada, 1);
    assert.equal(linhas[1].estoqueInsumoId, 'b');
    assert.equal(linhas[1].qtdSaida, 0);
    assert.equal(linhas[1].divergente, true);
  });

  it('CONCILIADA sem rascunho não gera pendência', () => {
    const p = pendenciasDocumentoTransferencia({
      numeroDocumento: '12',
      status: 'CONCILIADA',
      lojaOrigemLabel: 'Portão',
      lojaDestinoLabel: 'Uberaba',
      lados: [
        { tipo: 'SAIDA', rascunho: false },
        { tipo: 'ENTRADA', rascunho: false },
      ],
    });
    assert.equal(p.length, 0);
  });

  it('espelho rascunho + aguardando o outro lado', () => {
    const p = pendenciasDocumentoTransferencia({
      numeroDocumento: '12',
      status: 'AGUARDANDO_SAIDA',
      lojaOrigemLabel: 'Portão',
      lojaDestinoLabel: 'Uberaba',
      lados: [
        { tipo: 'SAIDA', rascunho: true },
        { tipo: 'ENTRADA', rascunho: false },
      ],
    });
    assert.equal(p.length, 1);
    assert.equal(p[0].tipo, 'TRANSFERENCIA_ESPELHO');
  });

  it('aguardando entrada (lado ausente)', () => {
    const p = pendenciasDocumentoTransferencia({
      numeroDocumento: '12',
      status: 'AGUARDANDO_ENTRADA',
      lojaOrigemLabel: 'Portão',
      lojaDestinoLabel: 'Uberaba',
      lados: [{ tipo: 'SAIDA', rascunho: false }],
    });
    assert.deepEqual(
      p.map((x) => x.tipo),
      ['TRANSFERENCIA_AGUARDANDO'],
    );
  });

  it('divergente', () => {
    const p = pendenciasDocumentoTransferencia({
      numeroDocumento: '12',
      status: 'DIVERGENTE',
      lojaOrigemLabel: 'Portão',
      lojaDestinoLabel: 'Uberaba',
      lados: [
        { tipo: 'SAIDA', rascunho: false },
        { tipo: 'ENTRADA', rascunho: false },
      ],
    });
    assert.equal(p[0].tipo, 'TRANSFERENCIA_DIVERGENTE');
  });
});
