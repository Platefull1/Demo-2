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
import { sugerirDoCatalogo } from './similarity';
import { extractVolume, volumesConflitam } from './volume';

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

  it('SAL PCT 30X1KG → 30 kg (sem sufixo, ambiguo)', () => {
    const s = sugerirFatorDaDescricao('SAL DE COZINHA MARFIN PCT 30X1KG', {
      unidadeComercial: 'UN',
    });
    assert.equal(s?.fator, 30);
    assert.equal(s?.ambiguo, true);
  });

  it('MILHO 6X1,500KG → 9 kg (sem sufixo, ambiguo)', () => {
    const s = sugerirFatorDaDescricao('MILHO VERDE LATA 6X1,500KG');
    assert.equal(s?.fator, 9);
    assert.equal(s?.ambiguo, true);
  });

  it('CARNE 6X1KG → 6 kg (sem sufixo, ambiguo)', () => {
    const s = sugerirFatorDaDescricao('CARNE MOIDA SABOR COSTELA 6X1KG');
    assert.equal(s?.fator, 6);
  });

  it('LOMBO PCT 25X1KG - 1 CX COM 10 sem qtd → P + FATOR_AMBIGUO', () => {
    const s = sugerirFatorDaDescricao('LOMBO SUINO PCT 25X1KG - 1 CX COM 10', {
      unidadeComercial: 'PCT',
    });
    assert.equal(s?.fator, 1); // P do 25X1KG
    assert.equal(s?.ambiguo, true);
    assert.ok(s?.alertas?.includes('FATOR_AMBIGUO'));
  });

  it('PEPERONI PCT 500G - 1 CX COM 6 sem qtd → 0,5 ambiguo', () => {
    const s = sugerirFatorDaDescricao('PEPERONI FATIADO PCT 500G - 1 CX COM 6', {
      unidadeComercial: 'PCT',
    });
    assert.equal(s?.fator, 0.5);
    assert.equal(s?.ambiguo, true);
  });

  it('PEPERONI com unidade CX sem qtd → P=0,5 ambiguo', () => {
    const s = sugerirFatorDaDescricao('PEPERONI FATIADO PCT 500G - 1 CX COM 6', {
      unidadeComercial: 'CX',
    });
    assert.equal(s?.fator, 0.5);
    assert.equal(s?.ambiguo, true);
  });

  it('MOLHO BAG 3,1KG - 6 CXS → 3,1 kg (ignora sufixo se und≠CX)', () => {
    const s = sugerirFatorDaDescricao(
      'MOLHO DE TOMATE BAG 3,1KG TRADICIONAL - 6 CXS E 0 UND',
      { unidadeComercial: 'BAG' },
    );
    assert.equal(s?.fator, 3.1);
  });

  it('LINGUICA PCT 3 Kg → 3 kg', () => {
    const s = sugerirFatorDaDescricao('LINGUICA TOSCANA PCT 3 Kg');
    assert.equal(s?.fator, 3);
  });

  it('MARGARINA BALDE 14,5 KG → 14,5 kg', () => {
    const s = sugerirFatorDaDescricao('MARGARINA COM SAL BALDE 14,5 KG');
    assert.equal(s?.fator, 14.5);
  });

  it('unidade KG sem sufixo → fator 1 (+ FATOR_AMBIGUO se pack)', () => {
    const s = sugerirFatorDaDescricao('MILHO VERDE LATA 6X1,500KG', {
      unidadeComercial: 'KG',
      quantidadeNota: 9,
    });
    assert.equal(s?.fator, 1);
    assert.equal(s?.ambiguo, true);
    assert.ok(s?.alertas?.includes('FATOR_AMBIGUO'));
  });

  it('CONFETES 12X500GR (KG) sem sufixo → fator 1 ambiguo', () => {
    const s = sugerirFatorDaDescricao('CONFETES COLORIDO 12X500GR', {
      unidadeComercial: 'KG',
      quantidadeNota: 6,
    });
    assert.equal(s?.fator, 1);
    assert.equal(s?.ambiguo, true);
  });

  it('CHOCOLATE BIS 1,050KG (KG) → fator 1', () => {
    const s = sugerirFatorDaDescricao('CHOCOLATE PRETO BIS 1,050KG', {
      unidadeComercial: 'KG',
    });
    assert.equal(s?.fator, 1);
    assert.equal(s?.ambiguo, false);
  });

  it('OLEO 20X900ML - 1 CX COM 20 | qtd 20 → P=0,9', () => {
    const s = sugerirFatorDaDescricao(
      'OLEO DE SOJA COCAMAR PET CX 20X900ML - 1 CX COM 20',
      { unidadeComercial: 'TON', quantidadeNota: 20, kgPorUnidade: 0.9 },
    );
    assert.equal(s?.fator, 0.9);
    assert.equal(s?.ambiguo, undefined);
  });

  it('OLEO 20X900ML - 2 CXS E 0 UND | qtd 40 → P=0,9', () => {
    const s = sugerirFatorDaDescricao(
      'OLEO DE SOJA COCAMAR PET CX 20X900ML - 2 CXS E 0 UND',
      { unidadeComercial: 'TON', quantidadeNota: 40, kgPorUnidade: 0.9 },
    );
    assert.equal(s?.fator, 0.9);
  });

  it('ACUCAR PCT 5KG - 1 CX COM 6 | qtd 6 → 5', () => {
    const s = sugerirFatorDaDescricao('ACUCAR PCT 5KG - 1 CX COM 6', {
      unidadeComercial: 'TON',
      quantidadeNota: 6,
    });
    assert.equal(s?.fator, 5);
  });

  it('ACUCAR PCT 5KG - 1 CX COM 2 | qtd 2 → 5', () => {
    const s = sugerirFatorDaDescricao('ACUCAR PCT 5KG - 1 CX COM 2', {
      unidadeComercial: 'TON',
      quantidadeNota: 2,
    });
    assert.equal(s?.fator, 5);
  });

  it('ACUCAR PCT 5KG - 2 CXS E 0 UND | qtd 12 → 5', () => {
    const s = sugerirFatorDaDescricao('ACUCAR PCT 5KG - 2 CXS E 0 UND', {
      unidadeComercial: 'TON',
      quantidadeNota: 12,
    });
    assert.equal(s?.fator, 5);
  });

  it('MILHO 6X1,500KG - 5 CXS | qtd 30 → 1,5', () => {
    const s = sugerirFatorDaDescricao(
      'MILHO VERDE LATA 6X1,500KG - 5 CXS E 0 UND',
      { unidadeComercial: 'KG', quantidadeNota: 30 },
    );
    assert.equal(s?.fator, 1.5);
    assert.ok(!s?.alertas?.includes('FATOR_AMBIGUO'));
  });

  it('MILHO 6X1,500KG - 7 CXS | qtd 42 → 1,5', () => {
    const s = sugerirFatorDaDescricao(
      'MILHO VERDE LATA 6X1,500KG - 7 CXS E 0 UND',
      { unidadeComercial: 'KG', quantidadeNota: 42 },
    );
    assert.equal(s?.fator, 1.5);
  });

  it('CONFETES 12X500GR - 1 CX COM 12 | qtd 12 → 0,5', () => {
    const s = sugerirFatorDaDescricao(
      'CONFETES COLORIDO 12X500GR - 1 CX COM 12',
      { unidadeComercial: 'KG', quantidadeNota: 12 },
    );
    assert.equal(s?.fator, 0.5);
  });

  it('COCA (6) → fator 6', () => {
    const s = sugerirFatorDaDescricao('COCA-COLA ORIGINAL PET 2L (6) FL', {
      unidadeComercial: 'G',
      quantidadeNota: 35,
      secao: 'BEBIDA',
    });
    assert.equal(s?.fator, 6);
  });

  it('CC Pet 600ml 6 Pack → 6', () => {
    const s = sugerirFatorDaDescricao('CC Pet 600ml 6 Pack FL', {
      secao: 'BEBIDA',
    });
    assert.equal(s?.fator, 6);
  });

  it('FATOR_SUSPEITO se custo/kg absurdo', () => {
    const s = sugerirFatorDaDescricao('ACUCAR PCT 5KG - 1 CX COM 6', {
      unidadeComercial: 'TON',
      quantidadeNota: 6,
      valorLiquido: 0.01, // R$ 0,01 / (6×5kg) = absurdo
      secao: 'MATERIA_PRIMA',
    });
    assert.ok(s?.alertas?.includes('FATOR_SUSPEITO'));
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

describe('volume bebidas', () => {
  it('extrai ML, L, LITRO, LATA e número solto', () => {
    assert.deepEqual(extractVolume('PEPSI 600ML ZERO'), { kind: 'ml', ml: 600 });
    assert.deepEqual(extractVolume('PEPSI 2L ZERO'), { kind: 'ml', ml: 2000 });
    assert.deepEqual(extractVolume('COCA 1,5L'), { kind: 'ml', ml: 1500 });
    assert.deepEqual(extractVolume('COCA 1 LITRO'), { kind: 'ml', ml: 1000 });
    assert.deepEqual(extractVolume('COCA 2 LITROS ZERO'), { kind: 'ml', ml: 2000 });
    assert.deepEqual(extractVolume('GUARANA LATA'), { kind: 'lata' });
    assert.deepEqual(extractVolume('COCA COLA LT12 350ML FL'), { kind: 'lata' });
    assert.deepEqual(extractVolume('CC ZERO LT 350ml 6U FL'), { kind: 'lata' });
    assert.deepEqual(extractVolume('PEPSI 600 ZERO'), { kind: 'ml', ml: 600 });
  });

  it('PEPSI 600 vs PEPSI 2L conflita', () => {
    assert.equal(volumesConflitam('PEPSI 600 ZERO', 'PEPSI 2L ZERO'), true);
  });

  it('lata ≠ 1 litro', () => {
    assert.equal(volumesConflitam('COCA COLA LT12 350ML FL', 'COCA 1 LITRO'), true);
    assert.equal(volumesConflitam('CC ZERO LT 350ml', 'COCA LATA ZERO'), false);
  });

  it('2L casa com 2 LITROS', () => {
    assert.equal(
      volumesConflitam('Coca-Cola Zero PET 2L 6U FL', 'COCA 2 LITROS ZERO'),
      false,
    );
    assert.equal(
      volumesConflitam('Coca-Cola Zero PET 2L 6U FL', 'COCA 1 LITRO ZERO'),
      true,
    );
  });

  it('mesmo volume não conflita', () => {
    assert.equal(volumesConflitam('PEPSI 600ML ZERO', 'PEPSI 600 ZERO'), false);
  });

  it('sugerirDoCatalogo descarta volume divergente', () => {
    const sug = sugerirDoCatalogo(
      'PEPSI 600 ZERO',
      [
        { id: 'a', nome: 'PEPSI 2L ZERO' },
        { id: 'b', nome: 'PEPSI 600ML ZERO' },
      ],
      0.5,
    );
    assert.ok(sug);
    assert.equal(sug!.id, 'b');
  });

  it('não confunde peso com volume', () => {
    assert.equal(extractVolume('BACON 500G'), null);
    assert.equal(volumesConflitam('BACON 500G', 'BACON DEFUMADO'), false);
  });
});
