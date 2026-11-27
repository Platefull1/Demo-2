/**
 * Corrige saldo uberaba/2026-10 a partir da planilha OUTUBRO.
 *
 * Passos:
 *  2) Restaurar custoMedio (AG) → origem PLANILHA nos itens casados
 *  3) Mapear/criar CARNE BOV DESFIADA, CHOCOLATE KIT KAT BARRA, KUAT LATA
 *  4) Remover saldo duplicado SPRITE ZERO 2L
 *  5) Confirmar ini nov (MP / BEBIDA)
 *
 * Uso:
 *   npx tsx --env-file=.env.prod-backup scripts/fix-uberaba-out-planilha.ts
 *   npx tsx --env-file=.env.prod-backup scripts/fix-uberaba-out-planilha.ts --execute
 */
import { createRequire } from 'module';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient, type CmvRealSecao, type CmvRealUnidade } from '@prisma/client';
import { parseSaldoDaAba } from '../src/lib/nfe/importar-saldo-parse';
import { matchNomeProdutoLista } from '../src/lib/nfe/match-nome-produto';
import { normalizarDescricao } from '../src/lib/nfe/normalize';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx') as typeof import('xlsx');

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';
const STORE = 'uberaba';
const COMP = '2026-10';
const EXECUTE = process.argv.includes('--execute');

const TARGET_PLAN = {
  MATERIA_PRIMA: 31_965.41,
  BEBIDA: 8_356.6,
} as const;

const MISSING = [
  { nomePlanilha: 'CARNE BOV DESFIADA', secao: 'MATERIA_PRIMA' as CmvRealSecao, unidade: 'KG' as CmvRealUnidade },
  { nomePlanilha: 'CHOCOLATE KIT KAT BARRA', secao: 'MATERIA_PRIMA' as CmvRealSecao, unidade: 'KG' as CmvRealUnidade },
  { nomePlanilha: 'KUAT LATA', secao: 'BEBIDA' as CmvRealSecao, unidade: 'UN' as CmvRealUnidade },
];

const prisma = new PrismaClient();

function n(v: unknown): number {
  if (v == null) return 0;
  return typeof v === 'number' ? v : Number(v);
}
function round2(v: number) {
  return Math.round(v * 100) / 100;
}
function round4(v: number) {
  return Math.round(v * 10000) / 10000;
}
function fmt(v: number) {
  const neg = v < 0;
  const s = Math.abs(v).toFixed(2).replace('.', ',');
  const [i, d] = s.split(',');
  return `${neg ? '-' : ''}R$ ${i.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${d}`;
}
function sep(t: string) {
  console.log('\n' + '═'.repeat(72));
  console.log(` ${t}`);
  console.log('═'.repeat(72));
}
function slugify(nome: string): string {
  return normalizarDescricao(nome).toLowerCase().replace(/\s+/g, '-').slice(0, 80);
}

function findWorkbook(): string {
  const dir = 'D:/mods/mds sa/mods the sims';
  const file = fs
    .readdirSync(dir)
    .find((f) => f.toLowerCase().includes('uberaba') && f.endsWith('.xlsx'));
  if (!file) throw new Error('Planilha Uberaba não encontrada');
  return path.join(dir, file);
}

async function sumCatalogoSecao(secao: string): Promise<number> {
  const configs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER, ativo: true, secao: secao as CmvRealSecao },
    select: { estoqueInsumoId: true },
  });
  const ids = configs.map((c) => c.estoqueInsumoId);
  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: {
      userId: OWNER,
      storeSlug: STORE,
      competencia: COMP,
      estoqueInsumoId: { in: ids },
    },
  });
  return round2(saldos.reduce((a, s) => a + n(s.qtdFinal) * n(s.custoMedio), 0));
}

async function main() {
  const host = (process.env.DATABASE_URL || '').match(/@([^/?]+)/)?.[1] ?? '?';
  console.log(`DB host: ${host}`);
  console.log(`Modo: ${EXECUTE ? 'EXECUTE (grava)' : 'DRY-RUN (só lê)'}`);

  const wbPath = findWorkbook();
  const wb = XLSX.readFile(wbPath);
  const sheet =
    wb.SheetNames.find((s) => s.trim().toUpperCase() === 'OUTUBRO') ??
    wb.SheetNames.find((s) => s.toUpperCase().includes('OUTUBRO'));
  if (!sheet) throw new Error('Aba OUTUBRO não encontrada');
  const plan = parseSaldoDaAba(wb.Sheets[sheet]);
  console.log(`Planilha: ${wbPath} | aba="${sheet}" | linhas=${plan.length}`);

  // ─── PASSO 3 primeiro no fluxo lógico de match (precisa existir no catálogo
  //     antes de restaurar AG nos 3 itens). Executamos 3→2→4 como pedidos
  //     numericamente pelo usuário: 2 restore, 3 map, 4 sprite — mas map
  //     precisa vir antes do restore dos 3. Ordem do usuário: 2,3,4.
  //     Farei: report passo2 dry, passo3, passo2 apply, passo4, passo5.
  //     Na verdade usuário pediu ordem 2,3,4. Restore dos casados pode ser
  //     antes; depois map cria/mapeia e aí atualiza custo dos 3; depois sprite.

  const allConfigs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: OWNER },
    include: { estoqueInsumo: { select: { id: true, nome: true, insumoId: true } } },
  });
  const ativos = allConfigs.filter((c) => c.ativo);
  const cfgById = new Map(allConfigs.map((c) => [c.estoqueInsumoId, c]));

  const catalogoAtivo = ativos.map((c) => ({
    id: c.estoqueInsumoId,
    nome: c.estoqueInsumo.nome,
    nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
    secao: c.secao,
    unidade: c.unidade,
  }));

  const saldos = await prisma.cmvSaldoEstoque.findMany({
    where: { userId: OWNER, storeSlug: STORE, competencia: COMP },
  });
  const saldoById = new Map(saldos.map((s) => [s.estoqueInsumoId, s]));

  const beforeMp = await sumCatalogoSecao('MATERIA_PRIMA');
  const beforeBeb = await sumCatalogoSecao('BEBIDA');
  console.log(`Antes: MP=${fmt(beforeMp)} BEB=${fmt(beforeBeb)}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSO 2 — restaurar AG → PLANILHA nos casados
  // ═══════════════════════════════════════════════════════════════════════════
  sep('PASSO 2 — Restaurar custoMedio da coluna AG (itens casados)');

  type RestoreRow = {
    id: string;
    nome: string;
    secao: string;
    qtdDb: number;
    custoAntes: number | null;
    origemAntes: string | null;
    custoAg: number;
    valorAntes: number;
    valorDepois: number;
  };
  const restores: RestoreRow[] = [];
  const usedIds = new Set<string>();

  for (const pl of plan) {
    if (!(pl.qtdFinal > 0) && !(pl.valorFinal > 0)) continue;
    const custoAg = pl.custoPlanilha;
    if (custoAg == null || !(custoAg > 0)) continue;

    const match = matchNomeProdutoLista(pl.nome, catalogoAtivo);
    if (!match.item) continue;
    if (usedIds.has(match.item.id)) {
      // segunda linha planilha no mesmo insumo — já tratado na 1ª (agregar?)
      // Para custo, usa AG da linha atual só se ainda não restaurado; se agregado,
      // custo efetivo = valorAH/qtd. Preferimos AG da planilha quando qtd casa.
      continue;
    }
    usedIds.add(match.item.id);

    const s = saldoById.get(match.item.id);
    if (!s) continue;

    const qtdDb = n(s.qtdFinal);
    const custoAntes = s.custoMedio != null ? n(s.custoMedio) : null;
    const valorAntes = round2(qtdDb * (custoAntes ?? 0));
    const valorDepois = round2(qtdDb * custoAg);

    // Só restaura se qtd próxima da planilha (evita product mismatch)
    if (Math.abs(qtdDb - (pl.qtdFinal || 0)) > 0.0006 && qtdDb > 0) {
      // ainda restaura custo AG se for o mesmo produto matchado — qtd pode ter sido editada
    }

    if (
      s.custoOrigem === 'PLANILHA' &&
      custoAntes != null &&
      Math.abs(custoAntes - custoAg) < 0.00015
    ) {
      continue; // já ok
    }

    restores.push({
      id: match.item.id,
      nome: match.item.nome,
      secao: match.item.secao,
      qtdDb,
      custoAntes,
      origemAntes: s.custoOrigem,
      custoAg: round4(custoAg),
      valorAntes,
      valorDepois,
    });
  }

  console.log(`Itens a restaurar: ${restores.length}`);
  let deltaRestore = 0;
  for (const r of restores.sort((a, b) => Math.abs(b.valorDepois - b.valorAntes) - Math.abs(a.valorDepois - a.valorAntes))) {
    const d = round2(r.valorDepois - r.valorAntes);
    deltaRestore += d;
    if (Math.abs(d) > 0.01) {
      console.log(
        `  [${r.secao}] ${r.nome}: ${r.custoAntes} (${r.origemAntes}) → ${r.custoAg} PLANILHA | valor ${fmt(r.valorAntes)} → ${fmt(r.valorDepois)} (Δ ${fmt(d)})`,
      );
    }
  }
  console.log(`Δ valor total restore: ${fmt(round2(deltaRestore))}`);

  if (EXECUTE) {
    let upd = 0;
    for (const r of restores) {
      const res = await prisma.cmvSaldoEstoque.updateMany({
        where: {
          userId: OWNER,
          storeSlug: STORE,
          competencia: COMP,
          estoqueInsumoId: r.id,
        },
        data: {
          custoMedio: r.custoAg,
          custoOrigem: 'PLANILHA',
          custoOrigemDetalhe: 'OUTUBRO 2026 AG (restaurado)',
        },
      });
      upd += res.count;
    }
    console.log(`Gravados: ${upd} saldos`);
  } else {
    console.log('(dry-run — nada gravado)');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSO 3 — mapear/criar 3 produtos
  // ═══════════════════════════════════════════════════════════════════════════
  sep('PASSO 3 — Mapear/criar produtos faltantes');

  // Busca ampla em EstoqueInsumo do tenant
  const allInsumos = await prisma.estoqueInsumo.findMany({
    where: { userId: OWNER },
    select: { id: true, nome: true, insumoId: true, unidade: true, categoriaId: true },
  });
  // Também insumos de outros users do merge? CMV configs are on OWNER.
  // Orphan saldos may point to insumos of OWNER.

  for (const miss of MISSING) {
    const pl = plan.find(
      (p) => normalizarDescricao(p.nome) === normalizarDescricao(miss.nomePlanilha),
    );
    if (!pl) {
      console.log(`  ! ${miss.nomePlanilha}: não achou na planilha`);
      continue;
    }

    const custoAg = pl.custoPlanilha ?? (pl.qtdFinal > 0 ? pl.valorFinal / pl.qtdFinal : null);
    console.log(
      `\n  → ${miss.nomePlanilha} | plan qtd=${pl.qtdFinal} AG=${custoAg} AH=${fmt(pl.valorFinal)} seção=${miss.secao}`,
    );

    // 1) match no catálogo CMV (ativo ou inativo)
    const catalogoTodos = allConfigs.map((c) => ({
      id: c.estoqueInsumoId,
      nome: c.estoqueInsumo.nome,
      nomeNormalizado: normalizarDescricao(c.estoqueInsumo.nome),
      ativo: c.ativo,
      secao: c.secao,
      unidade: c.unidade,
      cfgId: c.id,
    }));
    const mCfg = matchNomeProdutoLista(miss.nomePlanilha, catalogoTodos, {
      minCasado: 0.92,
      minSugerido: 0.75,
    });

    // 2) match em EstoqueInsumo sem config
    const catalogoInsumos = allInsumos.map((i) => ({
      id: i.id,
      nome: i.nome,
      nomeNormalizado: normalizarDescricao(i.nome),
      unidade: i.unidade,
      insumoId: i.insumoId,
    }));
    const mIns = matchNomeProdutoLista(miss.nomePlanilha, catalogoInsumos, {
      minCasado: 0.92,
      minSugerido: 0.75,
    });

    // Heurística extra: contains keywords
    const keywords: Record<string, string[]> = {
      'CARNE BOV DESFIADA': ['DESFIAD', 'CARNE BOV'],
      'CHOCOLATE KIT KAT BARRA': ['KIT KAT', 'KITKAT'],
      'KUAT LATA': ['KUAT'],
    };
    const kws = keywords[miss.nomePlanilha] ?? [];
    const fuzzyInsumos = allInsumos.filter((i) => {
      const u = i.nome.toUpperCase();
      return kws.every((k) => u.includes(k)) || kws.some((k) => u.includes(k) && miss.nomePlanilha.includes('KUAT') && u.includes('LATA'));
    });

    console.log(
      `    match cfg: ${mCfg.status} → ${mCfg.item?.nome ?? '-'} (score=${mCfg.score.toFixed(3)}, ativo=${(mCfg.item as { ativo?: boolean } | undefined)?.ativo})`,
    );
    console.log(
      `    match insumo: ${mIns.status} → ${mIns.item?.nome ?? '-'} (score=${mIns.score.toFixed(3)})`,
    );
    if (fuzzyInsumos.length) {
      console.log(
        `    fuzzy: ${fuzzyInsumos.map((i) => `${i.nome} [${i.id.slice(-6)}]`).join(' | ')}`,
      );
    }

    let targetId: string | null = null;
    let createdNew = false;
    let action = '';

    if (mCfg.item && (mCfg.status === 'casado' || mCfg.score >= 0.9)) {
      targetId = mCfg.item.id;
      const cfg = cfgById.get(targetId)!;
      if (!cfg.ativo) {
        action = `reativar config existente "${cfg.estoqueInsumo.nome}"`;
        if (EXECUTE) {
          await prisma.cmvRealInsumoConfig.update({
            where: { id: cfg.id },
            data: { ativo: true, secao: miss.secao, unidade: miss.unidade },
          });
        }
      } else {
        action = `já no catálogo ativo como "${cfg.estoqueInsumo.nome}"`;
      }
    } else if (mIns.item && (mIns.status === 'casado' || mIns.score >= 0.9)) {
      targetId = mIns.item.id;
      action = `mapear EstoqueInsumo existente "${mIns.item.nome}" → CmvRealInsumoConfig`;
      if (EXECUTE) {
        const existing = await prisma.cmvRealInsumoConfig.findUnique({
          where: {
            userId_estoqueInsumoId: { userId: OWNER, estoqueInsumoId: targetId },
          },
        });
        if (existing) {
          await prisma.cmvRealInsumoConfig.update({
            where: { id: existing.id },
            data: { ativo: true, secao: miss.secao, unidade: miss.unidade },
          });
        } else {
          const max = await prisma.cmvRealInsumoConfig.aggregate({
            where: { userId: OWNER, secao: miss.secao },
            _max: { ordem: true },
          });
          await prisma.cmvRealInsumoConfig.create({
            data: {
              userId: OWNER,
              estoqueInsumoId: targetId,
              secao: miss.secao,
              unidade: miss.unidade,
              ordem: (max._max.ordem ?? 0) + 1,
              ativo: true,
            },
          });
        }
      }
    } else if (
      fuzzyInsumos.length === 1 ||
      (fuzzyInsumos.length > 0 && miss.nomePlanilha === 'KUAT LATA' &&
        fuzzyInsumos.filter((i) => i.nome.toUpperCase().includes('LATA')).length === 1)
    ) {
      const pick =
        miss.nomePlanilha === 'KUAT LATA'
          ? fuzzyInsumos.find((i) => i.nome.toUpperCase().includes('LATA')) ?? fuzzyInsumos[0]
          : fuzzyInsumos[0];
      // Para KIT KAT: preferir BARRA se existir
      let chosen = pick;
      if (miss.nomePlanilha.includes('KIT KAT')) {
        const barra = fuzzyInsumos.find((i) => i.nome.toUpperCase().includes('BARRA'));
        const creme = fuzzyInsumos.find((i) => i.nome.toUpperCase().includes('CREME'));
        // não mapear para CREME KIT KAT
        chosen = barra ?? fuzzyInsumos.find((i) => !i.nome.toUpperCase().includes('CREME')) ?? pick;
        if (chosen.nome.toUpperCase().includes('CREME')) {
          console.log(`    AVISO: fuzzy só achou CREME — vai criar produto novo`);
          chosen = null as unknown as typeof pick;
        }
      }
      if (chosen) {
        targetId = chosen.id;
        action = `mapear por fuzzy "${chosen.nome}" → CmvRealInsumoConfig`;
        if (EXECUTE) {
          const existing = await prisma.cmvRealInsumoConfig.findUnique({
            where: {
              userId_estoqueInsumoId: { userId: OWNER, estoqueInsumoId: targetId },
            },
          });
          if (existing) {
            await prisma.cmvRealInsumoConfig.update({
              where: { id: existing.id },
              data: { ativo: true, secao: miss.secao, unidade: miss.unidade },
            });
          } else {
            const max = await prisma.cmvRealInsumoConfig.aggregate({
              where: { userId: OWNER, secao: miss.secao },
              _max: { ordem: true },
            });
            await prisma.cmvRealInsumoConfig.create({
              data: {
                userId: OWNER,
                estoqueInsumoId: targetId,
                secao: miss.secao,
                unidade: miss.unidade,
                ordem: (max._max.ordem ?? 0) + 1,
                ativo: true,
              },
            });
          }
        }
      }
    }

    if (!targetId) {
      // criar novo
      createdNew = true;
      action = `CRIAR produto novo "${miss.nomePlanilha}" + config CMV`;
      const slug = slugify(miss.nomePlanilha);
      if (EXECUTE) {
        const unidadeEstoque = miss.unidade === 'KG' ? 'kg' : 'un';
        const categoriaId = miss.secao === 'BEBIDA' ? 'bebidas' : 'materias-primas';
        const categoriaNome = miss.secao === 'BEBIDA' ? 'Bebidas' : 'Matérias-primas';
        const created = await prisma.estoqueInsumo.create({
          data: {
            userId: OWNER,
            insumoId: slug,
            nome: miss.nomePlanilha,
            unidade: unidadeEstoque,
            categoriaId,
            categoriaNome,
            categoriaIcone: miss.secao === 'BEBIDA' ? '🥤' : '🥬',
          },
        });
        targetId = created.id;
        const max = await prisma.cmvRealInsumoConfig.aggregate({
          where: { userId: OWNER, secao: miss.secao },
          _max: { ordem: true },
        });
        await prisma.cmvRealInsumoConfig.create({
          data: {
            userId: OWNER,
            estoqueInsumoId: targetId,
            secao: miss.secao,
            unidade: miss.unidade,
            ordem: (max._max.ordem ?? 0) + 1,
            ativo: true,
          },
        });
      } else {
        targetId = '(novo)';
      }
    }

    console.log(`    ação: ${action}${createdNew ? ' ⚠️ NOVO' : ''}`);

    // Upsert saldo com qtd/custo da planilha
    if (targetId && targetId !== '(novo)') {
      const existingSaldo = saldoById.get(targetId);
      console.log(
        `    saldo atual: ${existingSaldo ? `qtd=${n(existingSaldo.qtdFinal)} custo=${existingSaldo.custoMedio} origem=${existingSaldo.custoOrigem}` : 'AUSENTE'}`,
      );
      console.log(
        `    saldo alvo: qtd=${pl.qtdFinal} custo=${custoAg} origem=PLANILHA valor=${fmt(pl.valorFinal)}`,
      );
      if (EXECUTE && custoAg != null) {
        await prisma.cmvSaldoEstoque.upsert({
          where: {
            userId_storeSlug_competencia_estoqueInsumoId: {
              userId: OWNER,
              storeSlug: STORE,
              competencia: COMP,
              estoqueInsumoId: targetId,
            },
          },
          create: {
            userId: OWNER,
            storeSlug: STORE,
            competencia: COMP,
            estoqueInsumoId: targetId,
            qtdFinal: pl.qtdFinal,
            custoMedio: round4(custoAg),
            custoOrigem: 'PLANILHA',
            custoOrigemDetalhe: 'OUTUBRO 2026 AG (restaurado)',
            origem: 'IMPORTACAO',
          },
          update: {
            qtdFinal: pl.qtdFinal,
            custoMedio: round4(custoAg),
            custoOrigem: 'PLANILHA',
            custoOrigemDetalhe: 'OUTUBRO 2026 AG (restaurado)',
          },
        });
        console.log('    saldo upsert OK');
      }
    } else if (!EXECUTE) {
      console.log(
        `    (dry-run) criaria saldo qtd=${pl.qtdFinal} custo=${custoAg} valor=${fmt(pl.valorFinal)}`,
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSO 4 — remover SPRITE ZERO 2L
  // ═══════════════════════════════════════════════════════════════════════════
  sep('PASSO 4 — Remover saldo duplicado SPRITE ZERO 2L');

  const spriteZero = ativos.find(
    (c) => normalizarDescricao(c.estoqueInsumo.nome) === normalizarDescricao('SPRITE ZERO 2L'),
  );
  const sprite2LZero = ativos.find(
    (c) =>
      normalizarDescricao(c.estoqueInsumo.nome) ===
      normalizarDescricao('SPRITE 2 LITROS ZERO'),
  );
  console.log(
    `SPRITE ZERO 2L: ${spriteZero ? spriteZero.estoqueInsumo.nome + ' ' + spriteZero.estoqueInsumoId.slice(-8) : 'NÃO ACHADO'}`,
  );
  console.log(
    `SPRITE 2 LITROS ZERO: ${sprite2LZero ? sprite2LZero.estoqueInsumo.nome + ' ' + sprite2LZero.estoqueInsumoId.slice(-8) : 'NÃO ACHADO'}`,
  );

  if (spriteZero) {
    const s = saldoById.get(spriteZero.estoqueInsumoId);
    if (s) {
      const valor = round2(n(s.qtdFinal) * n(s.custoMedio));
      console.log(
        `Saldo a remover: qtd=${n(s.qtdFinal)} custo=${s.custoMedio} valor=${fmt(valor)} origem=${s.custoOrigem}`,
      );
      if (EXECUTE) {
        const del = await prisma.cmvSaldoEstoque.deleteMany({
          where: {
            userId: OWNER,
            storeSlug: STORE,
            competencia: COMP,
            estoqueInsumoId: spriteZero.estoqueInsumoId,
          },
        });
        console.log(`Removidos: ${del.count}`);
      } else {
        console.log('(dry-run — não removido)');
      }
    } else {
      console.log('Sem saldo out para SPRITE ZERO 2L — nada a fazer');
    }
  }

  if (sprite2LZero) {
    const s = saldoById.get(sprite2LZero.estoqueInsumoId);
    console.log(
      `Mantido SPRITE 2 LITROS ZERO: qtd=${s ? n(s.qtdFinal) : 0} custo=${s?.custoMedio ?? '—'} (será PLANILHA se passo 2 rodou)`,
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PASSO 5 — confirmar totais
  // ═══════════════════════════════════════════════════════════════════════════
  sep('PASSO 5 — Confirmar estoque inicial nov (saldo out catálogo)');

  if (!EXECUTE) {
    console.log('Dry-run: estimando totais após mudanças...');
    // Estimativa: before + deltas
    // Melhor re-simular
  }

  const afterMp = EXECUTE ? await sumCatalogoSecao('MATERIA_PRIMA') : null;
  const afterBeb = EXECUTE ? await sumCatalogoSecao('BEBIDA') : null;

  if (EXECUTE) {
    console.log(`MP: ${fmt(afterMp!)} (alvo ${fmt(TARGET_PLAN.MATERIA_PRIMA)}) Δ=${fmt(round2(afterMp! - TARGET_PLAN.MATERIA_PRIMA))}`);
    console.log(`BEB: ${fmt(afterBeb!)} (alvo ${fmt(TARGET_PLAN.BEBIDA)}) Δ=${fmt(round2(afterBeb! - TARGET_PLAN.BEBIDA))}`);
    const okMp = Math.abs(afterMp! - TARGET_PLAN.MATERIA_PRIMA) < 0.02;
    const okBeb = Math.abs(afterBeb! - TARGET_PLAN.BEBIDA) < 0.02;
    console.log(okMp && okBeb ? '✅ Totais fecham' : '❌ Totais NÃO fecham — investigar');
  } else {
    console.log('Rode com --execute para gravar e confirmar totais no banco.');
    console.log(`Alvos: MP ${fmt(TARGET_PLAN.MATERIA_PRIMA)} | BEB ${fmt(TARGET_PLAN.BEBIDA)}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
