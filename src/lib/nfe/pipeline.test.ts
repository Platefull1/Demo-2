/**
 * Testes unitários do pipeline NF-e (Fase 2).
 * Rodar: npx tsx --test src/lib/nfe/pipeline.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ratearImpostoNota } from './fcp-st';
import {
  extrairMultipackDaDescricao,
  extrairPesoKgDaDescricao,
  sugerirFatorDaDescricao,
} from './fator-sugerido';
import {
  chaveMapeamentoDesc,
  chaveMapeamentoEan,
  normalizarDescricao,
  normalizarUnidade,
} from './normalize';
import {
  defaultPipelineConfig,
  processarNota,
  resultadoExcecao,
  type PipelineNotaInput,
} from './pipeline';

function baseInput(over: Partial<PipelineNotaInput> = {}): PipelineNotaInput {
  return {
    valorTotal: 100,
    fornecedorIgnorarCmv: false,
    itens: [
      {
        saiposItemId: 1,
        descricao: 'PRODUTO TESTE',
        unidadeComercial: 'KG',
        quantidade: 10,
        valorBruto: 100,
        netItemValue: 100,
        ean: '7891234567890',
      },
    ],
    mapeamentos: [],
    catalogo: [{ id: 'ins-1', nome: 'Produto Teste' }],
    insumosConfig: {
      'ins-1': {
        estoqueInsumoId: 'ins-1',
        unidade: 'KG',
        secao: 'MATERIA_PRIMA',
      },
    },
    config: defaultPipelineConfig(),
    ...over,
  };
}

describe('normalização', () => {
  it('normaliza descrição', () => {
    assert.equal(normalizarDescricao('  Requeijão Cremoso! '), 'REQUEIJAO CREMOSO');
  });
  it('normaliza unidade UNID→UN', () => {
    assert.equal(normalizarUnidade('unid'), 'UN');
    assert.equal(normalizarUnidade('KG'), 'KG');
  });
});

describe('FCP-ST rateio (nota real 9584301)', () => {
  it('rateia FCP-ST e elimina divergência', () => {
    // itens 2.778,33 + FCP-ST 65,43 = total 2.843,76
    const itens = [
      { id: 1, netItemValue: 1500.0 },
      { id: 2, netItemValue: 1278.33 },
    ];
    const total = 2843.76;
    const fcp = 65.43;
    const somaNet = 2778.33;
    assert.ok(Math.abs(total - somaNet - fcp) < 0.01);

    const r = ratearImpostoNota(total, itens, { total_fcp_st: fcp });
    assert.equal(r.aplicado, true);
    assert.equal(r.campo, 'total_fcp_st');
    const somaLiq = r.itens.reduce((s, i) => s + i.valorLiquido, 0);
    assert.ok(Math.abs(somaLiq - total) <= 0.02, `soma=${somaLiq}`);
  });

  it('pipeline não gera TOTAL_DIVERGENTE com FCP-ST', () => {
    const out = processarNota(
      baseInput({
        valorTotal: 2843.76,
        impostosNota: { total_fcp_st: 65.43 },
        itens: [
          {
            saiposItemId: 1,
            descricao: 'COCA COLA',
            unidadeComercial: 'UN',
            quantidade: 10,
            valorBruto: 1500,
            netItemValue: 1500,
          },
          {
            saiposItemId: 2,
            descricao: 'COCA ZERO',
            unidadeComercial: 'UN',
            quantidade: 5,
            valorBruto: 1278.33,
            netItemValue: 1278.33,
          },
        ],
        mapeamentos: [
          {
            id: 'm1',
            chave: chaveMapeamentoDesc(normalizarDescricao('COCA COLA'), 'UN'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
          {
            id: 'm2',
            chave: chaveMapeamentoDesc(normalizarDescricao('COCA ZERO'), 'UN'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        config: defaultPipelineConfig({ autoAprovar: true }),
      }),
    );
    assert.ok(!out.alertas.includes('TOTAL_DIVERGENTE'));
    assert.equal(out.status, 'APROVADA');
  });
});

describe('fator sugerido da descrição', () => {
  it('extrai peso requeijão 1,535 kg', () => {
    assert.equal(
      extrairPesoKgDaDescricao('REQUEIJAO CREMOSO SOFFICE 1,535 kg'),
      1.535,
    );
    const s = sugerirFatorDaDescricao('REQUEIJAO CREMOSO SOFFICE 1,535 kg');
    assert.equal(s?.fator, 1.535);
    assert.equal(s?.origem, 'DESCRICAO');
  });

  it('extrai multipack 6 Pack', () => {
    assert.equal(extrairMultipackDaDescricao('CC Pet 600ml 6 Pack FL'), 6);
    const s = sugerirFatorDaDescricao('CC Pet 600ml 6 Pack FL', { secao: 'BEBIDA' });
    assert.equal(s?.fator, 6);
  });
});

describe('pipeline decisões', () => {
  it('fornecedor ignorado → IGNORADA', () => {
    const out = processarNota(baseInput({ fornecedorIgnorarCmv: true }));
    assert.equal(out.status, 'IGNORADA');
    assert.equal(out.gerarLancamentos, false);
  });

  it('total divergente gera alerta', () => {
    const out = processarNota(
      baseInput({
        valorTotal: 200,
        itens: [
          {
            saiposItemId: 1,
            descricao: 'X',
            unidadeComercial: 'KG',
            quantidade: 1,
            valorBruto: 100,
            netItemValue: 100,
          },
        ],
      }),
    );
    assert.ok(out.alertas.includes('TOTAL_DIVERGENTE'));
    assert.equal(out.status, 'EM_REVISAO');
  });

  it('mapeamento por EAN', () => {
    const ean = '7891234567890';
    const out = processarNota(
      baseInput({
        mapeamentos: [
          {
            id: 'm-ean',
            chave: chaveMapeamentoEan(ean),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        config: defaultPipelineConfig({ autoAprovar: true }),
      }),
    );
    assert.equal(out.itens[0].status, 'MAPEADO');
    assert.equal(out.status, 'APROVADA');
    assert.equal(out.gerarLancamentos, true);
  });

  it('mapeamento por descrição', () => {
    const desc = normalizarDescricao('PRODUTO TESTE');
    const out = processarNota(
      baseInput({
        itens: [
          {
            saiposItemId: 1,
            descricao: 'PRODUTO TESTE',
            unidadeComercial: 'KG',
            quantidade: 10,
            valorBruto: 100,
            netItemValue: 100,
            ean: null,
          },
        ],
        mapeamentos: [
          {
            id: 'm-desc',
            chave: chaveMapeamentoDesc(desc, 'KG'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        config: defaultPipelineConfig({ autoAprovar: true }),
      }),
    );
    assert.equal(out.itens[0].status, 'MAPEADO');
    assert.equal(out.status, 'APROVADA');
  });

  it('sugestão por similaridade sem aplicar', () => {
    const out = processarNota(
      baseInput({
        itens: [
          {
            saiposItemId: 1,
            descricao: 'Produto Teste Extra',
            unidadeComercial: 'KG',
            quantidade: 1,
            valorBruto: 100,
            netItemValue: 100,
            ean: null,
          },
        ],
        mapeamentos: [],
        catalogo: [{ id: 'ins-1', nome: 'Produto Teste' }],
      }),
    );
    assert.equal(out.itens[0].status, 'SUGERIDO');
    assert.ok(out.itens[0].sugestaoInsumoId === 'ins-1');
    assert.equal(out.itens[0].estoqueInsumoId, null); // nunca aplica sozinha
    assert.equal(out.status, 'EM_REVISAO');
  });

  it('conversão quantidade × fator', () => {
    const out = processarNota(
      baseInput({
        mapeamentos: [
          {
            id: 'm1',
            chave: chaveMapeamentoEan('7891234567890'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1.535,
            ignorar: false,
          },
        ],
        itens: [
          {
            saiposItemId: 1,
            descricao: 'REQ',
            unidadeComercial: 'UN',
            quantidade: 100,
            valorBruto: 100,
            netItemValue: 100,
            ean: '7891234567890',
          },
        ],
      }),
    );
    assert.equal(out.itens[0].quantidadeConvertida, 153.5);
    assert.ok(out.itens[0].custoUnitario != null);
  });

  it('custo fora do padrão', () => {
    const out = processarNota(
      baseInput({
        mapeamentos: [
          {
            id: 'm1',
            chave: chaveMapeamentoEan('7891234567890'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        custoMedioPorInsumo: { 'ins-1': 5 },
        itens: [
          {
            saiposItemId: 1,
            descricao: 'X',
            unidadeComercial: 'KG',
            quantidade: 1,
            valorBruto: 100,
            netItemValue: 100, // custo unit = 100 vs ref 5 → >30%
            ean: '7891234567890',
          },
        ],
        config: defaultPipelineConfig({
          autoAprovar: true,
          limiteVariacaoCustoPercent: 30,
        }),
      }),
    );
    assert.ok(out.itens[0].alertas.includes('CUSTO_FORA_DO_PADRAO'));
    assert.equal(out.status, 'EM_REVISAO'); // auto-aprovação bloqueada por alerta
  });

  it('auto-aprovação desligada → EM_REVISAO mesmo mapeado', () => {
    const out = processarNota(
      baseInput({
        mapeamentos: [
          {
            id: 'm1',
            chave: chaveMapeamentoEan('7891234567890'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        config: defaultPipelineConfig({ autoAprovar: false }),
      }),
    );
    assert.equal(out.itens[0].status, 'MAPEADO');
    assert.equal(out.status, 'EM_REVISAO');
  });

  it('retry até FALHA', () => {
    const r1 = resultadoExcecao(0, 3, 'boom');
    assert.equal(r1.status, 'ERRO_PROCESSAMENTO');
    assert.equal(r1.tentativas, 1);
    const r2 = resultadoExcecao(1, 3, 'boom');
    assert.equal(r2.status, 'ERRO_PROCESSAMENTO');
    const r3 = resultadoExcecao(2, 3, 'boom');
    assert.equal(r3.status, 'FALHA');
    assert.equal(r3.problemasNovos.length, 1);
  });

  it('transferência entre lojas → EM_REVISAO', () => {
    const out = processarNota(
      baseInput({
        saiposTransferenciaId: 999,
        mapeamentos: [
          {
            id: 'm1',
            chave: chaveMapeamentoEan('7891234567890'),
            estoqueInsumoId: 'ins-1',
            fatorConversao: 1,
            ignorar: false,
          },
        ],
        config: defaultPipelineConfig({ autoAprovar: true }),
      }),
    );
    assert.ok(out.alertas.includes('TRANSFERENCIA_ENTRE_LOJAS'));
    assert.equal(out.status, 'EM_REVISAO');
  });
});
