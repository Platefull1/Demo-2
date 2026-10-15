import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const p = new PrismaClient();
const n = (v) => (v == null ? 0 : Number(v));

async function main() {
  const tid = 'cmk5ykusf0001jz04iwmf8xa8';
  const embIdsKnown = [
    'cmqnxgpp9002jjs047goosubn',
    'cmqnxgpp9002kjs04dx56nrbf',
    'cmqnxgpp9002ljs04h3pnfc64',
    'cmqnxgpp9002mjs0461hzoll5',
    'cmqnxgpp9002njs042ghfz4ac',
    'cmqnxgpp9002ojs04p8b9a37l',
    'cmqnxgpp9002pjs040gu5c4lu',
  ];
  const cfgsAny = await p.cmvRealInsumoConfig.findMany({
    where: { estoqueInsumoId: { in: embIdsKnown } },
  });
  console.log('configs for EMBALAGEM 20..ENTRADAS (any user):', cfgsAny.length, cfgsAny);

  const allCfg = await p.cmvRealInsumoConfig.findMany({
    where: { userId: tid },
    include: { estoqueInsumo: { select: { nome: true } } },
  });
  console.log(
    'tenant configs emb-like (incl inativo):',
    allCfg
      .filter((c) => /EMBALAGEM|MESINHA|SEPARADOR/i.test(c.estoqueInsumo.nome))
      .map((c) => ({
        nome: c.estoqueInsumo.nome,
        secao: c.secao,
        ativo: c.ativo,
        id: c.estoqueInsumoId,
      }))
  );
  const u = await p.user.findUnique({
    where: { id: tid },
    select: { id: true, email: true },
  });
  console.log('tenant', u);

  const configs = await p.cmvRealInsumoConfig.findMany({
    where: { userId: tid, ativo: true },
    include: { estoqueInsumo: { select: { id: true, nome: true } } },
    orderBy: [{ secao: 'asc' }, { ordem: 'asc' }],
  });
  const by = {};
  for (const c of configs) by[c.secao] = (by[c.secao] || 0) + 1;
  console.log('configs by secao', by);

  const emb = configs.filter((c) => c.secao === 'EMBALAGEM');
  console.log(
    'EMB configs',
    emb.map((c) => `${c.estoqueInsumo.nome}|${c.estoqueInsumoId}`)
  );
  const embIds = emb.map((c) => c.estoqueInsumoId);

  for (const slug of ['portao', 'ahu', 'pilarzinho', 'uberaba']) {
    const saldos = await p.cmvSaldoEstoque.findMany({
      where: {
        userId: tid,
        storeSlug: slug,
        competencia: '2026-09',
        estoqueInsumoId: { in: embIds },
      },
    });
    console.log(
      `\n${slug} EMB match config: ${saldos.length}`,
      saldos.map((s) => {
        const c = emb.find((e) => e.estoqueInsumoId === s.estoqueInsumoId);
        return `${c?.estoqueInsumo.nome}=${n(s.qtdFinal)}`;
      })
    );
  }

  const allPortao = await p.cmvSaldoEstoque.findMany({
    where: { userId: tid, storeSlug: 'portao', competencia: '2026-09' },
  });
  console.log('\nportao ALL saldos 2026-09', allPortao.length);

  const nomes = await p.estoqueInsumo.findMany({
    where: { id: { in: allPortao.map((s) => s.estoqueInsumoId) } },
    select: { id: true, nome: true },
  });
  const nm = Object.fromEntries(nomes.map((i) => [i.id, i.nome]));
  const embLike = allPortao.filter((s) =>
    /EMBALAGEM|MESINHA|SEPARADOR|CALZONE/i.test(nm[s.estoqueInsumoId] || '')
  );
  console.log('portao emb-like rows:');
  for (const s of embLike) {
    console.log(
      `  ${nm[s.estoqueInsumoId]}=${n(s.qtdFinal)} id=${s.estoqueInsumoId} inCfg=${embIds.includes(s.estoqueInsumoId)}`
    );
  }

  // IDs in saldo but NOT in config (orphan packaging)
  const orphan = embLike.filter((s) => !embIds.includes(s.estoqueInsumoId));
  console.log('\norphan emb saldos (in DB, not in cmvRealInsumoConfig):', orphan.length);

  // Compare ahu emb-like for same
  const allAhu = await p.cmvSaldoEstoque.findMany({
    where: { userId: tid, storeSlug: 'ahu', competencia: '2026-09' },
  });
  const nomesA = await p.estoqueInsumo.findMany({
    where: { id: { in: allAhu.map((s) => s.estoqueInsumoId) } },
    select: { id: true, nome: true },
  });
  const nmA = Object.fromEntries(nomesA.map((i) => [i.id, i.nome]));
  const ahuEmb = allAhu.filter((s) =>
    /EMBALAGEM|MESINHA|SEPARADOR|CALZONE/i.test(nmA[s.estoqueInsumoId] || '')
  );
  console.log('\nahu emb-like:');
  for (const s of ahuEmb) {
    console.log(
      `  ${nmA[s.estoqueInsumoId]}=${n(s.qtdFinal)} id=${s.estoqueInsumoId} inCfg=${embIds.includes(s.estoqueInsumoId)}`
    );
  }

  const fech = await p.cmvFechamento.findMany({
    where: { userId: tid, competencia: '2026-10' },
    select: { storeSlug: true, status: true, snapshot: true, updatedAt: true },
  });
  console.log(
    '\nfechamentos 2026-10',
    fech.map((f) => ({
      s: f.storeSlug,
      st: f.status,
      snap: f.snapshot != null,
      upd: f.updatedAt,
    }))
  );

  const slugG = await p.cmvSaldoEstoque.groupBy({
    by: ['storeSlug'],
    where: { userId: tid, competencia: '2026-09' },
    _count: true,
  });
  console.log('saldos 2026-09 by slug', slugG);

  // Simulate montarFechamento for portao
  const saldosIni = await p.cmvSaldoEstoque.findMany({
    where: { userId: tid, storeSlug: 'portao', competencia: '2026-09' },
  });
  const iniMap = new Map(saldosIni.map((s) => [s.estoqueInsumoId, s]));
  const counts = {};
  const withIni = {};
  const embDetail = [];
  for (const cfg of configs) {
    counts[cfg.secao] = (counts[cfg.secao] || 0) + 1;
    const ini = iniMap.get(cfg.estoqueInsumoId);
    const has = !!ini;
    if (has) withIni[cfg.secao] = (withIni[cfg.secao] || 0) + 1;
    if (cfg.secao === 'EMBALAGEM') {
      embDetail.push({
        nome: cfg.estoqueInsumo.nome,
        id: cfg.estoqueInsumoId,
        hasSaldo: has,
        qtd: has ? n(ini.qtdFinal) : null,
      });
    }
  }
  console.log('\n=== SIM portao/2026-10 ===');
  console.log('produtos por secao:', counts);
  console.log('com saldo inicial encontrado:', withIni);
  console.log('EMBALAGEM detalhe:', embDetail);

  // Same for ahu
  const saldosIniA = await p.cmvSaldoEstoque.findMany({
    where: { userId: tid, storeSlug: 'ahu', competencia: '2026-09' },
  });
  const iniA = new Map(saldosIniA.map((s) => [s.estoqueInsumoId, s]));
  const withIniA = {};
  const embA = [];
  for (const cfg of configs) {
    const ini = iniA.get(cfg.estoqueInsumoId);
    if (ini) withIniA[cfg.secao] = (withIniA[cfg.secao] || 0) + 1;
    if (cfg.secao === 'EMBALAGEM') {
      embA.push({
        nome: cfg.estoqueInsumo.nome,
        hasSaldo: !!ini,
        qtd: ini ? n(ini.qtdFinal) : null,
        id: cfg.estoqueInsumoId,
      });
    }
  }
  console.log('\n=== SIM ahu/2026-10 ===');
  console.log('com saldo inicial encontrado:', withIniA);
  console.log('EMBALAGEM detalhe:', embA);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
