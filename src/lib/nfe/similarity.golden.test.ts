/**
 * Golden set do matching por tokens (NF-e → catálogo CMV Real).
 * Rodar: npx tsx --test src/lib/nfe/similarity.golden.test.ts
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  sugerirDoCatalogo,
  type CatalogoItem,
  SUGESTAO_MIN_SCORE,
} from './similarity';

/** Catálogo mínimo cobrindo o golden set (nomes reais do CMV). */
const CATALOGO: CatalogoItem[] = [
  { id: 'mussarela', nome: 'QUEIJO MUSSARELA', secao: 'MATERIA_PRIMA' },
  { id: 'provolone', nome: 'QUEIJO PROVOLONE', secao: 'MATERIA_PRIMA' },
  { id: 'parmesao', nome: 'QUEIJO PARMESÃO', secao: 'MATERIA_PRIMA' },
  { id: 'ricota', nome: 'QUEIJO RICOTA', secao: 'MATERIA_PRIMA' },
  { id: 'sal', nome: 'SAL', secao: 'MATERIA_PRIMA' },
  { id: 'margarina', nome: 'MARGARINA', secao: 'MATERIA_PRIMA' },
  { id: 'lombo', nome: 'LOMBO', secao: 'MATERIA_PRIMA' },
  { id: 'bacon', nome: 'BACON (CRU)', secao: 'MATERIA_PRIMA' },
  { id: 'pepperoni', nome: 'PEPPERONI', secao: 'MATERIA_PRIMA' },
  { id: 'linguica', nome: 'LINGUIÇA CALABRESA', secao: 'MATERIA_PRIMA' },
  { id: 'milho', nome: 'MILHO', secao: 'MATERIA_PRIMA' },
  { id: 'moida', nome: 'CARNE MOÍDA (BOLONHESA)', secao: 'MATERIA_PRIMA' },
  { id: 'isca', nome: 'CARNE EM ISCA (STROGONOFF)', secao: 'MATERIA_PRIMA' },
  { id: 'costela', nome: 'COSTELA', secao: 'MATERIA_PRIMA' },
  { id: 'coca600', nome: 'COCA 600', secao: 'BEBIDA' },
  { id: 'coca2z', nome: 'COCA 2 LITROS ZERO', secao: 'BEBIDA' },
  { id: 'guarana2', nome: 'GUARANÁ ANTÁRCTICA 2L', secao: 'BEBIDA' },
  { id: 'pepsi600', nome: 'PEPSI 600 ZERO', secao: 'BEBIDA' },
  { id: 'pepsi2', nome: 'PEPSI 2L ZERO', secao: 'BEBIDA' },
  { id: 'apresuntado', nome: 'APRESUNTADO', secao: 'MATERIA_PRIMA' },
  { id: 'requeijao', nome: 'REQUEIJÃO', secao: 'MATERIA_PRIMA' },
  { id: 'molho', nome: 'MOLHO DE TOMATE', secao: 'MATERIA_PRIMA' },
];

type Case =
  | { nfe: string; expectId: string; ncm?: string; label?: string }
  | { nfe: string; expectNone: true; ncm?: string; label?: string }
  | { nfe: string; ambiguous: true; ncm?: string; label?: string };

const POSITIVOS: Case[] = [
  { nfe: 'MUSSARELA DI PAULA INT KG', expectId: 'mussarela' },
  { nfe: 'PROVOLONE MATAUROS', expectId: 'provolone' },
  { nfe: 'PARMESAO DI PAULA KG', expectId: 'parmesao' },
  { nfe: 'RICOTA DI PAULA PEQUENA 300GR', expectId: 'ricota' },
  { nfe: 'SAL DE COZINHA MARFIN PCT 30X1KG', expectId: 'sal' },
  {
    nfe: 'MARGARINA COAMO 50% DE GORDURA COM SAL BALDE 14,5 KG',
    expectId: 'margarina',
  },
  { nfe: 'LOMBO CANADENSE FATIADO SIGMA PCT 25X1KG', expectId: 'lombo' },
  { nfe: 'BACON EM CUBOS BASSO 1KG', expectId: 'bacon' },
  { nfe: 'PEPERONI FATIADO JULIATTO PCT 500G', expectId: 'pepperoni' },
  {
    nfe: 'LINGUICA TIPO CALABRESA COZ. RETA PCT 3 Kg - Frimesa',
    expectId: 'linguica',
  },
  { nfe: 'MILHO VERDE LATA 6X1,500KG', expectId: 'milho' },
  { nfe: 'CARNE MOIDA PRIMEIRA', expectId: 'moida' },
  { nfe: 'PATINHO S/ OSSO ISCAS', expectId: 'isca' },
  {
    nfe: 'CARNE BOVINA COZIDA DESFIADA SABOR COSTELA 6X1KG',
    expectId: 'costela',
  },
  { nfe: 'CC Pet 600ml 6 Pack FL', expectId: 'coca600', ncm: '22021000' },
  {
    nfe: 'Coca-Cola Zero PET 2L 6U FL',
    expectId: 'coca2z',
    ncm: '22021000',
  },
  {
    nfe: 'GUARANA CHP ANTARCTICA PET 2L CAIXA C/6',
    expectId: 'guarana2',
    ncm: '22021000',
  },
];

const NEGATIVOS: Case[] = [
  {
    nfe: 'PEPSI 600 ZERO',
    expectNone: true,
    label: 'não pode sugerir PEPSI 2L',
    ncm: '22021000',
  },
  {
    nfe: 'PARAFUSO SEXTAVADO 1/4 ZINCADO SABADIN',
    expectNone: true,
    label: 'ferragem Sabadin',
    ncm: '73181500',
  },
];

const AMBIGUOS: Case[] = [
  { nfe: 'APRESUNTADO FRIMESA', ambiguous: true },
  { nfe: 'REQUEIJAO CREMOSO SOFFICE', ambiguous: true },
  { nfe: 'MOLHO DE TOMATE BAG 3,1KG PREDILECTA', ambiguous: true },
];

describe('golden set matching tokens', () => {
  it(`positivos + negativos ≥ 80% (limiar ${SUGESTAO_MIN_SCORE})`, () => {
    const scored = [...POSITIVOS, ...NEGATIVOS];
    let ok = 0;
    const fails: string[] = [];

    for (const c of scored) {
      // Para negativo PEPSI 600: catálogo tem pepsi600 e pepsi2; deve sugerir 600, NÃO 2L.
      // expectNone no caso PEPSI 600 ZERO no enunciado era "≠ PEPSI 2L ZERO".
      // Reinterpreto: o top não pode ser pepsi2; sugerir pepsi600 é correto.
      if ('label' in c && c.label === 'não pode sugerir PEPSI 2L') {
        const sug = sugerirDoCatalogo(c.nfe, CATALOGO, SUGESTAO_MIN_SCORE, {
          ncm: c.ncm,
        });
        const pass = !sug || sug.id !== 'pepsi2';
        // ideal: sugere 600
        const better = sug?.id === 'pepsi600';
        if (pass && (better || !sug || sug.id === 'pepsi600')) {
          // count as ok if not suggesting 2L; prefer 600
          if (sug?.id === 'pepsi2') {
            fails.push(`${c.nfe} → ${sug?.nome} (não pode ser 2L)`);
          } else {
            ok++;
          }
        } else if (pass) {
          ok++;
        } else {
          fails.push(`${c.nfe} → ${sug?.nome ?? 'null'} (não pode ser 2L)`);
        }
        continue;
      }

      const sug = sugerirDoCatalogo(c.nfe, CATALOGO, SUGESTAO_MIN_SCORE, {
        ncm: 'ncm' in c ? c.ncm : undefined,
      });

      if ('expectNone' in c && c.expectNone) {
        if (!sug) ok++;
        else fails.push(`${c.nfe} → ${sug.nome} (esperava nenhum)`);
        continue;
      }

      if ('expectId' in c) {
        if (sug?.id === c.expectId) ok++;
        else
          fails.push(
            `${c.nfe} → ${sug?.nome ?? 'null'} (score ${sug?.score?.toFixed(2) ?? '-'}) esperava ${c.expectId}`,
          );
      }
    }

    const rate = ok / scored.length;
    console.log(
      `\n[golden] acertos ${ok}/${scored.length} = ${(rate * 100).toFixed(1)}%`,
    );
    if (fails.length) console.log('[golden] falhas:\n  ' + fails.join('\n  '));
    assert.ok(
      rate >= 0.8,
      `taxa ${(rate * 100).toFixed(1)}% < 80%. Falhas:\n${fails.join('\n')}`,
    );
  });

  it('ambíguos: qualquer resultado (incl. nenhum) é aceito', () => {
    for (const c of AMBIGUOS) {
      const sug = sugerirDoCatalogo(c.nfe, CATALOGO, SUGESTAO_MIN_SCORE);
      // só garante que não explode
      assert.ok(sug === null || typeof sug.score === 'number');
    }
  });

  it('PEPSI 600 ZERO não sugere PEPSI 2L ZERO', () => {
    const sug = sugerirDoCatalogo('PEPSI 600 ZERO', CATALOGO, 0.3, {
      ncm: '22021000',
    });
    assert.notEqual(sug?.id, 'pepsi2');
  });
});
