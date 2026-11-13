/**
 * Simula o fluxo de transferências WhatsApp sem Baileys.
 *
 * Cenários:
 *  1. Ciclo completo (origem confirma → destino confirma qtds iguais → CONCLUIDA + CMV)
 *  2. Divergência (destino confirma qtd diferente → DIVERGENTE rascunho, sem lançamento)
 *  3. Resolver divergência (escolhe qtd recebida → CONCILIADA + lançamentos + audit)
 *  4. Gerente de loja errada tentando confirmar recebimento
 *  5. Cancelamento
 *
 * Uso:
 *   npx tsx --env-file=.env scripts/test-transferencias-whatsapp.ts
 */
import { PrismaClient } from '@prisma/client';
import { cargoFamilia } from '../src/lib/rh-cargo-familia';
import { storeSlugFromLojaNome } from '../src/lib/nfe/lojas';
import {
  buscarCustoTransferencia,
  resolverDivergenciaWhatsapp,
} from '../src/lib/nfe/transferencia-documento';
import { competenciaFromDataEntrada } from '../src/lib/nfe/dates';
import {
  cancelar,
  confirmarOrigem,
  confirmarRecebimento,
  criarSessao,
} from '../src/transferencias/sessoes';
import { identificarGerente } from '../src/transferencias/gerentes';
import { canonicalizarTelefone } from '../src/transferencias/telefone';

const OWNER_EMAIL = 'platefull.app@gmail.com';
const OWNER_FALLBACK = 'cmk5ykusf0001jz04iwmf8xa8';
const prisma = new PrismaClient();

type GerenteCtx = {
  id: string;
  nome: string;
  telefone: string;
  storeSlug: string;
};

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function resolveTenant(): Promise<string> {
  const byEmail = await prisma.user.findFirst({
    where: { email: OWNER_EMAIL },
    select: { id: true },
  });
  if (byEmail) return byEmail.id;
  const byId = await prisma.user.findUnique({
    where: { id: OWNER_FALLBACK },
    select: { id: true },
  });
  if (!byId) throw new Error('Tenant platefull.app não encontrado');
  return byId.id;
}

async function listarGerentes(tenantUserId: string): Promise<GerenteCtx[]> {
  const rows = await prisma.rhFuncionario.findMany({
    where: {
      userId: tenantUserId,
      ativo: true,
      telefone: { not: null },
      lojaId: { not: null },
      cargo: { isNot: null },
    },
    include: {
      cargo: { select: { nome: true } },
      loja: { select: { nome: true } },
    },
  });

  const out: GerenteCtx[] = [];
  for (const f of rows) {
    if (!f.cargo || cargoFamilia(f.cargo.nome) !== 'Gerente') continue;
    if (!f.loja || !f.telefone) continue;
    const slug = storeSlugFromLojaNome(f.loja.nome);
    if (!slug) continue;
    out.push({
      id: f.id,
      nome: f.nome,
      telefone: f.telefone,
      storeSlug: slug,
    });
  }
  return out;
}

async function pickInsumoComCusto(
  tenantUserId: string,
  lojaOrigem: string,
): Promise<{ estoqueInsumoId: string; nome: string; unidade: 'KG' | 'UN' }> {
  const competencia = competenciaFromDataEntrada(new Date());
  const cfgs = await prisma.cmvRealInsumoConfig.findMany({
    where: { userId: tenantUserId, ativo: true },
    include: { estoqueInsumo: { select: { nome: true } } },
    take: 40,
    orderBy: { ordem: 'asc' },
  });
  for (const cfg of cfgs) {
    const custo = await buscarCustoTransferencia({
      userId: tenantUserId,
      lojaOrigem,
      estoqueInsumoId: cfg.estoqueInsumoId,
      competencia,
    });
    if (custo.custo != null && !custo.exigePreenchimento) {
      return {
        estoqueInsumoId: cfg.estoqueInsumoId,
        nome: cfg.estoqueInsumo.nome,
        unidade: cfg.unidade as 'KG' | 'UN',
      };
    }
  }
  throw new Error(
    `Nenhum insumo com custo resolvível na origem ${lojaOrigem} (competência ${competencia})`,
  );
}

async function cleanupSessao(sessaoId: string, tenantUserId: string) {
  const s = await prisma.sessaoTransferencia.findUnique({
    where: { id: sessaoId },
    select: { cmvTransferenciaId: true },
  });
  if (s?.cmvTransferenciaId) {
    const itens = await prisma.cmvTransferenciaItem.findMany({
      where: { lado: { transferenciaId: s.cmvTransferenciaId } },
      select: { id: true },
    });
    await prisma.cmvLancamento.deleteMany({
      where: { transferenciaItemId: { in: itens.map((i) => i.id) } },
    });
    await prisma.cmvTransferencia.updateMany({
      where: { id: s.cmvTransferenciaId, userId: tenantUserId, origem: 'WHATSAPP' },
      data: { excluidoEm: new Date(), excluidoPorId: tenantUserId },
    });
  }
  await prisma.sessaoTransferencia.delete({ where: { id: sessaoId } }).catch(() => null);
}

async function main() {
  const tenantUserId = await resolveTenant();
  console.log('tenant', tenantUserId);

  const gerentes = await listarGerentes(tenantUserId);
  const porLoja = new Map<string, GerenteCtx[]>();
  for (const g of gerentes) {
    const list = porLoja.get(g.storeSlug) || [];
    list.push(g);
    porLoja.set(g.storeSlug, list);
  }
  const lojas = [...porLoja.keys()];
  assert(lojas.length >= 2, `Precisa de gerentes em ≥2 lojas (achou ${lojas.length})`);

  const origem = porLoja.get(lojas[0])![0];
  const destino = porLoja.get(lojas[1])![0];
  console.log(`origem ${origem.storeSlug} ${origem.nome}`);
  console.log(`destino ${destino.storeSlug} ${destino.nome}`);

  const insumo = await pickInsumoComCusto(tenantUserId, origem.storeSlug);
  console.log(`insumo ${insumo.nome} (${insumo.unidade})`);

  // ─── identificarGerente ───────────────────────────────────────────────────
  const idOk = await identificarGerente(tenantUserId, origem.telefone, null);
  assert(idOk.funcionarioId === origem.id, 'identificarGerente falhou no match');
  console.log('✓ identificarGerente');

  const createdIds: string[] = [];

  try {
    // ─── 1. Ciclo completo ──────────────────────────────────────────────────
    {
      const sessao = await criarSessao({
        tenantUserId,
        gerenteOrigemId: origem.id,
        lojaOrigem: origem.storeSlug,
        lojaDestino: destino.storeSlug,
        telefoneOrigem: canonicalizarTelefone(origem.telefone),
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            textoOriginal: insumo.nome,
            quantidade: 1,
            unidade: insumo.unidade,
          },
        ],
        mensagemOriginal: 'teste ciclo completo',
      });
      createdIds.push(sessao.id);
      assert(sessao.estado === 'AGUARDANDO_CONFIRMACAO_ORIGEM', 'estado inicial');
      assert(/^T\d+$/.test(sessao.codigo), `codigo inválido ${sessao.codigo}`);

      const conf = await confirmarOrigem({
        sessaoId: sessao.id,
        gerenteId: origem.id,
      });
      assert(conf.estado === 'AGUARDANDO_RECEBIMENTO', 'após origem');
      assert(conf.itens[0]?.custoUnitario != null, 'custo congelado');

      const fim = await confirmarRecebimento({
        sessaoId: sessao.id,
        gerenteId: destino.id,
        actorUserId: tenantUserId,
      });
      assert(fim.estado === 'CONCLUIDA', `esperado CONCLUIDA, veio ${fim.estado}`);
      assert(fim.cmvTransferenciaId, 'sem cmvTransferenciaId');

      const doc = await prisma.cmvTransferencia.findUniqueOrThrow({
        where: { id: fim.cmvTransferenciaId! },
        include: {
          lados: { include: { itens: { include: { lancamento: true } } } },
        },
      });
      assert(doc.origem === 'WHATSAPP', 'origem WHATSAPP');
      assert(doc.status === 'CONCILIADA', 'status CONCILIADA');
      assert(doc.lados.every((l) => !l.rascunho), 'lados confirmados');
      assert(
        doc.lados.every((l) => l.itens.every((i) => i.lancamento)),
        'lançamentos CMV gerados',
      );
      console.log(`✓ ciclo completo ${sessao.codigo} → ${doc.numeroDocumento}`);
    }

    // ─── 2. Divergência ─────────────────────────────────────────────────────
    {
      const sessao = await criarSessao({
        tenantUserId,
        gerenteOrigemId: origem.id,
        lojaOrigem: origem.storeSlug,
        lojaDestino: destino.storeSlug,
        telefoneOrigem: origem.telefone,
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            textoOriginal: insumo.nome,
            quantidade: 2,
            unidade: insumo.unidade,
          },
        ],
        mensagemOriginal: 'teste divergencia',
      });
      createdIds.push(sessao.id);
      await confirmarOrigem({ sessaoId: sessao.id, gerenteId: origem.id });
      const div = await confirmarRecebimento({
        sessaoId: sessao.id,
        gerenteId: destino.id,
        quantidadesRecebidas: { [insumo.estoqueInsumoId]: 1 },
        actorUserId: tenantUserId,
      });
      assert(div.estado === 'DIVERGENTE', `esperado DIVERGENTE, veio ${div.estado}`);
      assert(div.cmvTransferenciaId, 'doc divergente sem id');

      const doc = await prisma.cmvTransferencia.findUniqueOrThrow({
        where: { id: div.cmvTransferenciaId! },
        include: {
          lados: { include: { itens: { include: { lancamento: true } } } },
        },
      });
      assert(doc.status === 'DIVERGENTE', 'status doc');
      assert(doc.origem === 'WHATSAPP', 'origem');
      assert(doc.lados.every((l) => l.rascunho === true), 'ambos rascunho');
      assert(
        doc.lados.every((l) => l.itens.every((i) => !i.lancamento)),
        'sem lançamento CMV',
      );
      console.log(`✓ divergência ${sessao.codigo} → ${doc.numeroDocumento}`);
    }

    // ─── 3. Resolver divergência ─────────────────────────────────────────────
    {
      const sessao = await criarSessao({
        tenantUserId,
        gerenteOrigemId: origem.id,
        lojaOrigem: origem.storeSlug,
        lojaDestino: destino.storeSlug,
        telefoneOrigem: origem.telefone,
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            textoOriginal: insumo.nome,
            quantidade: 3,
            unidade: insumo.unidade,
          },
        ],
        mensagemOriginal: 'teste resolver divergencia',
      });
      createdIds.push(sessao.id);
      await confirmarOrigem({ sessaoId: sessao.id, gerenteId: origem.id });
      const div = await confirmarRecebimento({
        sessaoId: sessao.id,
        gerenteId: destino.id,
        quantidadesRecebidas: { [insumo.estoqueInsumoId]: 2 },
        actorUserId: tenantUserId,
      });
      assert(div.estado === 'DIVERGENTE', 'pré-condição DIVERGENTE');
      assert(div.cmvTransferenciaId, 'doc id');

      const resolved = await resolverDivergenciaWhatsapp({
        userId: tenantUserId,
        actorUserId: tenantUserId,
        id: div.cmvTransferenciaId!,
        motivo: 'Conferência no destino — pesagem válida',
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            escolha: 'RECEBIDA',
          },
        ],
      });
      assert(resolved.status === 'CONCILIADA', `status ${resolved.status}`);
      assert(resolved.origem === 'WHATSAPP', 'origem permanece WHATSAPP');
      assert(resolved.resolucaoDivergencia?.motivo.includes('pesagem'), 'audit motivo');
      assert(
        resolved.resolucaoDivergencia?.itens[0]?.qtdFinal === 2,
        'qtd final = recebida',
      );
      assert(
        resolved.lados.every((l) => !l.rascunho),
        'lados confirmados',
      );
      assert(
        resolved.lados.every((l) =>
          l.itens.every((i) => i.estoqueInsumoId === insumo.estoqueInsumoId && i.quantidade === 2),
        ),
        'ambos lados com qtd 2',
      );

      const doc = await prisma.cmvTransferencia.findUniqueOrThrow({
        where: { id: resolved.id },
        include: {
          lados: { include: { itens: { include: { lancamento: true } } } },
        },
      });
      assert(
        doc.lados.every((l) => l.itens.every((i) => i.lancamento)),
        'lançamentos CMV após resolução',
      );

      const sessaoFresh = await prisma.sessaoTransferencia.findUniqueOrThrow({
        where: { id: sessao.id },
      });
      assert(sessaoFresh.estado === 'CONCLUIDA', 'sessão WhatsApp → CONCLUIDA');
      console.log(`✓ resolver divergência ${sessao.codigo} → ${doc.numeroDocumento}`);
    }

    // ─── 4. Gerente loja errada ──────────────────────────────────────────────
    {
      const sessao = await criarSessao({
        tenantUserId,
        gerenteOrigemId: origem.id,
        lojaOrigem: origem.storeSlug,
        lojaDestino: destino.storeSlug,
        telefoneOrigem: origem.telefone,
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            textoOriginal: insumo.nome,
            quantidade: 1,
            unidade: insumo.unidade,
          },
        ],
      });
      createdIds.push(sessao.id);
      await confirmarOrigem({ sessaoId: sessao.id, gerenteId: origem.id });

      let blocked = false;
      try {
        await confirmarRecebimento({
          sessaoId: sessao.id,
          gerenteId: origem.id, // gerente da ORIGEM tentando confirmar DESTINO
          actorUserId: tenantUserId,
        });
      } catch (e) {
        blocked = e instanceof Error && /destino/i.test(e.message);
        console.log(`  (esperado) ${e instanceof Error ? e.message : e}`);
      }
      assert(blocked, 'gerente da origem não deveria confirmar recebimento');
      console.log('✓ gerente loja errada bloqueado');

      await cancelar({ sessaoId: sessao.id, forcar: true });
    }

    // ─── 5. Cancelamento ────────────────────────────────────────────────────
    {
      const sessao = await criarSessao({
        tenantUserId,
        gerenteOrigemId: origem.id,
        lojaOrigem: origem.storeSlug,
        lojaDestino: destino.storeSlug,
        telefoneOrigem: origem.telefone,
        itens: [
          {
            estoqueInsumoId: insumo.estoqueInsumoId,
            textoOriginal: insumo.nome,
            quantidade: 1,
            unidade: insumo.unidade,
          },
        ],
      });
      createdIds.push(sessao.id);
      const canceled = await cancelar({
        sessaoId: sessao.id,
        actorGerenteId: origem.id,
      });
      assert(canceled.estado === 'CANCELADA', 'estado CANCELADA');
      console.log(`✓ cancelamento ${sessao.codigo}`);
    }

    console.log('\nTodos os cenários passaram.');
  } finally {
    for (const id of createdIds) {
      await cleanupSessao(id, tenantUserId);
    }
    console.log(`cleanup ${createdIds.length} sessão(ões)`);
  }
}

main()
  .catch((err) => {
    console.error('\nFALHOU:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
