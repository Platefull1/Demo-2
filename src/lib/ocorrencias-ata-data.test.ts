import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ATRASO_NAO_INFORMADO,
  avisoPainelAta,
  buildLojaResumo,
  buildRedeResumo,
  countByCategoria,
  destaquesDaAta,
  formatNomePessoa,
  motoboysPainel,
  nomeEmpresaAta,
  ordenarCategoriasPainel,
  quebraCategoriaDetalhe,
  rankMotoboys,
  somaAtrasos,
  totalOcorrenciasTexto,
  variacaoLabel,
  variacaoPainel,
  type OcorrenciaAtaRow,
} from './ocorrencias-ata-data';
import { monthBoundsSP, saoPauloYmd } from './ocorrencias-period';

function row(over: Partial<OcorrenciaAtaRow>): OcorrenciaAtaRow {
  return {
    id: over.id ?? '1',
    lojaId: over.lojaId ?? 'ahu',
    lojaNome: over.lojaNome ?? 'CALENZANO AHÚ',
    categorias: over.categorias ?? ['QUALIDADE'],
    motoboyId: over.motoboyId ?? null,
    motoboyNome: over.motoboyNome ?? null,
    destaqueAta: over.destaqueAta ?? false,
    createdAt: over.createdAt ?? '2026-10-10T12:00:00.000-03:00',
    numeroPedidoSaipos: over.numeroPedidoSaipos ?? '100',
    numeroPedidoExterno: over.numeroPedidoExterno ?? null,
    canalExterno: over.canalExterno ?? null,
    descricao: over.descricao ?? '',
    fotoPaths: over.fotoPaths ?? [],
  };
}

describe('contagens da ata', () => {
  it('ocorrência com 2 categorias conta nas duas; PEDIDO_ATRASADO da ocorrência é ignorado', () => {
    const counts = countByCategoria([
      row({ categorias: ['QUALIDADE', 'FALTOU_BEBIDA'] }),
      row({ categorias: ['PEDIDO_ATRASADO'] }),
    ]);
    assert.equal(counts.QUALIDADE, 1);
    assert.equal(counts.FALTOU_BEBIDA, 1);
    assert.equal(counts.PEDIDO_ATRASADO, 0);
  });

  it('atrasos manuais somam e loja sem número fica não informado', () => {
    const { soma, lojasSemNumero } = somaAtrasos([
      { lojaId: 'a', quantidade: 3 },
      { lojaId: 'b', quantidade: null },
      { lojaId: 'c', quantidade: 2 },
    ]);
    assert.equal(soma, 5);
    assert.deepEqual(lojasSemNumero, ['b']);

    const resumo = buildLojaResumo({
      loja: { id: 'b', nome: 'CALENZANO PORTÃO' },
      items: [],
      atraso: null,
      prevItems: null,
      prevAtraso: null,
      temDadosAnterior: false,
    });
    const atrasado = resumo.resumo.find((r) => r.categoria === 'PEDIDO_ATRASADO');
    assert.equal(atrasado?.quantidadeLabel, ATRASO_NAO_INFORMADO);
    assert.equal(atrasado?.variacao, '—');
  });

  it('23h do último dia do mês (SP) entra no mês certo', () => {
    const created = new Date('2026-10-31T23:30:00.000-03:00');
    const { start, end } = monthBoundsSP(2026, 10);
    assert.equal(created >= start && created <= end, true);
    const ymd = saoPauloYmd(created);
    assert.equal(ymd.month, 10);
    assert.equal(ymd.year, 2026);
  });

  it('motoboys: só com motoboy; atrasos não entram', () => {
    const ranked = rankMotoboys([
      row({ id: '1', motoboyId: 'm1', motoboyNome: 'João', categorias: ['QUALIDADE'] }),
      row({ id: '2', motoboyId: 'm1', motoboyNome: 'João', categorias: ['PEDIDO_ERRADO'] }),
      row({ id: '3', motoboyId: null, categorias: ['QUALIDADE'] }),
    ]);
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0]!.total, 2);
    assert.equal(ranked[0]!.porCategoria.QUALIDADE, 1);
    assert.equal(ranked[0]!.porCategoria.PEDIDO_ERRADO, 1);
  });

  it('motoboys: nome padronizado em Nome Sobrenome', () => {
    const ranked = rankMotoboys([
      row({ motoboyId: 'm1', motoboyNome: 'JOÃO DA SILVA' }),
      row({ id: '2', motoboyId: 'm2', motoboyNome: 'maria santos' }),
    ]);
    assert.equal(ranked.find((m) => m.motoboyId === 'm1')?.nome, 'João da Silva');
    assert.equal(ranked.find((m) => m.motoboyId === 'm2')?.nome, 'Maria Santos');
  });

  it('formatNomePessoa / nomeEmpresaAta / totalOcorrenciasTexto', () => {
    assert.equal(formatNomePessoa('JOÃO DA SILVA'), 'João da Silva');
    assert.equal(formatNomePessoa('maria SANTOS'), 'Maria Santos');
    assert.equal(nomeEmpresaAta({ name: 'Calenzano Pizzarias' }), 'Calenzano Pizzarias');
    assert.equal(nomeEmpresaAta({ name: 'admin@x.com', fullName: 'Calenzano Pizzarias' }), 'Calenzano Pizzarias');
    assert.equal(nomeEmpresaAta({ name: 'admin@x.com', fullName: null, email: 'admin@x.com' }), '');
    assert.equal(nomeEmpresaAta({ name: null, fullName: null, email: 'a@b.com' }), '');
    assert.equal(
      totalOcorrenciasTexto(25, 6),
      'Total: 31 — 25 ocorrências registradas + 6 pedidos atrasados.',
    );
    assert.equal(
      totalOcorrenciasTexto(25, null),
      'Total: 25 ocorrências registradas. Pedidos atrasados: não informado.',
    );
    assert.equal(
      totalOcorrenciasTexto(1, 1),
      'Total: 2 — 1 ocorrência registrada + 1 pedido atrasado.',
    );
    assert.equal(
      totalOcorrenciasTexto(1, null),
      'Total: 1 ocorrência registrada. Pedidos atrasados: não informado.',
    );
  });

  it('destaque: só destacadas na seção; sem destaque a lista fica vazia', () => {
    const items = [
      row({ id: 'a', destaqueAta: false }),
      row({ id: 'b', destaqueAta: true, descricao: 'borda queimada' }),
    ];
    const dest = destaquesDaAta(items);
    assert.deepEqual(dest.map((d) => d.id), ['b']);
    assert.deepEqual(destaquesDaAta([row({ destaqueAta: false })]), []);
  });

  it('variação: +X% / estável / (novo) / (resolvido) / —', () => {
    assert.equal(variacaoLabel(12, 10), '+20%');
    assert.equal(variacaoLabel(10, 10), 'estável');
    assert.equal(variacaoLabel(5, 0), '(novo)');
    assert.equal(variacaoLabel(0, 4), '(resolvido)');
    assert.equal(variacaoLabel(3, null), '—');
  });

  it('rede: matriz e ranking usam atrasos manuais', () => {
    const rede = buildRedeResumo({
      lojas: [
        { id: 'ahu', nome: 'CALENZANO AHÚ' },
        { id: 'portao', nome: 'CALENZANO PORTÃO' },
      ],
      items: [row({ lojaId: 'ahu', categorias: ['QUALIDADE'] })],
      atrasos: [
        { lojaId: 'ahu', quantidade: 4 },
        { lojaId: 'portao', quantidade: null },
      ],
      prevItems: null,
      prevAtrasos: null,
      temDadosAnterior: false,
    });
    assert.deepEqual(rede.lojasSemAtraso, ['Portão']);
    const ahu = rede.matriz.lojas.find((l) => l.lojaId === 'ahu');
    const portao = rede.matriz.lojas.find((l) => l.lojaId === 'portao');
    assert.equal(ahu?.valores.PEDIDO_ATRASADO, 4);
    assert.equal(ahu?.valores.QUALIDADE, 1);
    assert.equal(ahu?.total, 5);
    assert.equal(portao?.valores.PEDIDO_ATRASADO, null);
    assert.equal(rede.rankingLojas[0]!.lojaId, 'ahu');
  });
});

describe('dados do painel da ata (PDF)', () => {
  it('categorias: atrasado primeiro, demais por quantidade, Outros por último', () => {
    const resumo = buildLojaResumo({
      loja: { id: 'ahu', nome: 'CALENZANO AHÚ' },
      items: [
        row({ id: '1', categorias: ['QUALIDADE'] }),
        row({ id: '2', categorias: ['QUALIDADE'] }),
        row({ id: '3', categorias: ['OUTROS'] }),
        row({ id: '4', categorias: ['FALTOU_BEBIDA'] }),
        row({ id: '5', categorias: ['OUTROS'] }),
        row({ id: '6', categorias: ['OUTROS'] }),
      ],
      atraso: 2,
      prevItems: null,
      prevAtraso: null,
      temDadosAnterior: false,
    });
    const labels = ordenarCategoriasPainel(resumo.resumo).map((r) => r.categoria);
    assert.equal(labels[0], 'PEDIDO_ATRASADO');
    assert.equal(labels[labels.length - 1], 'OUTROS');
    assert.ok(labels.indexOf('QUALIDADE') < labels.indexOf('FALTOU_BEBIDA'));
  });

  it('top 6 motoboys e rótulo do resto', () => {
    const items = Array.from({ length: 8 }, (_, i) =>
      row({
        id: String(i),
        motoboyId: `m${i}`,
        motoboyNome: `Motoboy ${i}`,
        categorias: ['QUALIDADE'],
      }),
    );
    items.push(row({ id: 'x1', motoboyId: 'm0', motoboyNome: 'Motoboy 0' }));
    items.push(row({ id: 'x2', motoboyId: 'm1', motoboyNome: 'Motoboy 1' }));
    const ranked = rankMotoboys(items);
    const painel = motoboysPainel(ranked);
    assert.equal(painel.visiveis.length, 6);
    assert.equal(painel.restoLabel, '+ 2 motoboys com 1 ocorrência');

    const misturado = motoboysPainel([
      ...ranked.slice(0, 6),
      { ...ranked[0]!, motoboyId: 'extra1', total: 3 },
      { ...ranked[1]!, motoboyId: 'extra2', total: 1 },
    ]);
    assert.equal(misturado.restoLabel, '+ 2 motoboys');

    assert.equal(motoboysPainel([]).vazio, true);
    assert.equal(quebraCategoriaDetalhe({ QUALIDADE: 2, FALTOU_BEBIDA: 1 }), 'Problema com qualidade 2 · Faltou bebida 1');
  });

  it('aviso correto em cada caso', () => {
    assert.equal(
      avisoPainelAta({
        mesNome: 'Outubro',
        atrasosNaoInformados: true,
        temDadosAnterior: true,
      }),
      'o número de pedidos atrasados de Outubro ainda não foi informado.',
    );
    assert.equal(
      avisoPainelAta({
        mesNome: 'Outubro',
        atrasosNaoInformados: false,
        temDadosAnterior: false,
      }),
      'comparação com o mês anterior disponível a partir do próximo mês.',
    );
    assert.equal(
      avisoPainelAta({
        mesNome: 'Outubro',
        atrasosNaoInformados: true,
        temDadosAnterior: false,
      }),
      'o número de pedidos atrasados de Outubro ainda não foi informado e a comparação com o mês anterior estará disponível a partir do próximo mês.',
    );
    assert.equal(
      avisoPainelAta({
        mesNome: 'Outubro',
        atrasosNaoInformados: true,
        temDadosAnterior: true,
        lojasSemAtraso: ['Portão', 'Uberaba'],
      }),
      'o número de pedidos atrasados de Outubro ainda não foi informado em Portão, Uberaba.',
    );
    assert.equal(
      avisoPainelAta({
        mesNome: 'Outubro',
        atrasosNaoInformados: false,
        temDadosAnterior: true,
      }),
      null,
    );
  });

  it('variação absoluta do painel', () => {
    assert.deepEqual(variacaoPainel(10, 6, true, 'setembro'), {
      tom: 'up',
      delta: 4,
      cabecalho: '▲ 4 vs. setembro',
      indicador: '+4',
    });
    assert.deepEqual(variacaoPainel(3, 5, true, 'setembro'), {
      tom: 'down',
      delta: -2,
      cabecalho: '▼ 2 vs. setembro',
      indicador: '−2',
    });
    assert.equal(variacaoPainel(4, 4, true, 'setembro').indicador, '=');
    assert.equal(variacaoPainel(4, 4, true, 'setembro').cabecalho, 'estável');
    assert.equal(variacaoPainel(4, null, false, 'setembro').tom, 'none');
  });
});
