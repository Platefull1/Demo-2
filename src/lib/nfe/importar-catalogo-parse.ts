/**
 * Parser puro do catálogo CMV (sem Prisma).
 * B=produto, E=unidade; âncoras via importar-planilha-secoes.
 */

import * as XLSX from 'xlsx';
import {
  cellStr,
  detectarAncoraSecao,
  isFimBlocoInventario,
  lerLinhaProduto,
  type CmvRealSecao,
} from './importar-planilha-secoes';
import { normalizarDescricao } from './normalize';

export type CmvRealUnidade = 'KG' | 'UN';

export interface LinhaCatalogoPlanilha {
  linha: number;
  nome: string;
  nomeNormalizado: string;
  secao: CmvRealSecao;
  unidade: CmvRealUnidade;
  ordem: number;
}

function unidadeFromCol(raw: string, secao: CmvRealSecao): CmvRealUnidade {
  const u = raw.toUpperCase().replace(/[^A-Z]/g, '');
  if (u === 'KG' || u === 'KILO' || u === 'KILOS') return 'KG';
  if (u === 'UN' || u === 'UND' || u === 'UNID' || u === 'PC') return 'UN';
  return secao === 'MATERIA_PRIMA' ? 'KG' : 'UN';
}

/**
 * Lê linhas de produto da aba mensal.
 * Âncoras: B exato + D="ESTOQUE INICIAL". Produto: B + E preenchidos.
 */
export function parseCatalogoDaAba(ws: XLSX.WorkSheet): LinhaCatalogoPlanilha[] {
  const ref = ws['!ref'];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: LinhaCatalogoPlanilha[] = [];
  let secaoAtual: CmvRealSecao | null = null;
  let ordem = 0;

  for (let r = range.s.r; r <= range.e.r; r++) {
    const ancora = detectarAncoraSecao(ws, r);
    if (ancora) {
      secaoAtual = ancora;
      ordem = 0;
      continue;
    }

    const prod = lerLinhaProduto(ws, r);
    if (!prod) {
      const nomeB = cellStr(ws, r, 1);
      if (nomeB && isFimBlocoInventario(nomeB)) secaoAtual = null;
      continue;
    }

    if (!secaoAtual) continue;

    ordem += 1;
    out.push({
      linha: r + 1,
      nome: prod.nome,
      nomeNormalizado: normalizarDescricao(prod.nome),
      secao: secaoAtual,
      unidade: unidadeFromCol(prod.unidadeRaw, secaoAtual),
      ordem,
    });
  }

  return out;
}

export function lerCatalogoDoBuffer(
  buffer: ArrayBuffer,
  abaNome: string,
): LinhaCatalogoPlanilha[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const ws = wb.Sheets[abaNome];
  if (!ws) throw new Error(`Aba "${abaNome}" não encontrada`);
  return parseCatalogoDaAba(ws);
}

export function listarAbas(buffer: ArrayBuffer): string[] {
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  return wb.SheetNames;
}
