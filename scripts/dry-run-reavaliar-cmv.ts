/**
 * Dry-run da reavaliação CMV Real (não grava).
 * npx tsx --env-file=.env scripts/dry-run-reavaliar-cmv.ts
 */
import { reavaliarNotasCmvReal } from '../src/lib/nfe/reavaliar';

const OWNER = 'cmk5ykusf0001jz04iwmf8xa8';

async function main() {
  const r = await reavaliarNotasCmvReal({
    userId: OWNER,
    dryRun: true,
    simularAutoAprovar: true,
  });

  console.log('=== DRY-RUN reavaliação CMV Real ===');
  console.log(`inicioCmvReal: ${r.inicioCmvReal}`);
  console.log(`autoAprovar (simulado): ${r.autoAprovar}`);
  console.log(`alertasQueBloqueiam: ${JSON.stringify(r.alertasQueBloqueiam)}`);
  console.log(`processadas: ${r.processadas}`);
  console.log('');
  console.log(
    'loja|comp\taprovadas\tcom_alerta\tignoradas\tem_revisao\tanterior_cmv',
  );
  for (const key of Object.keys(r.porLojaComp).sort()) {
    const c = r.porLojaComp[key];
    console.log(
      [
        key,
        c.aprovadas,
        c.aprovadasComAlerta,
        c.ignoradas,
        c.emRevisao,
        c.anteriorCmv,
      ].join('\t'),
    );
  }
  console.log('');
  console.log('TOTAIS', r.totais);

  // Ahú 2026-10 detalhe
  console.log('\n=== Ahú 2026-10 (detalhe) ===');
  for (const l of r.linhas.filter(
    (x) => x.storeSlug === 'ahu' && x.competencia === '2026-10',
  )) {
    console.log(
      `NF ${l.numero} | ${l.prontos} | ${l.decisao} | ${l.motivo}${
        l.alertas.length ? ` | alertas: ${l.alertas.join(',')}` : ''
      }`,
    );
  }

  // Em revisão com motivo (só >= inicio)
  const revisao = r.linhas.filter((l) => l.decisao === 'EM_REVISAO');
  console.log(`\n=== EM_REVISAO restantes (${revisao.length}) — amostra ===`);
  for (const l of revisao.slice(0, 40)) {
    console.log(
      `${l.storeSlug} NF ${l.numero} (${l.competencia}) ${l.prontos} — ${l.motivo}`,
    );
  }
  if (revisao.length > 40) console.log(`... +${revisao.length - 40} mais`);

  // Check aceite
  const ahu13 = [
    '153377',
    '6641',
    '305640',
    '740826',
    '740828',
    '740827',
    '9636376',
    '38137',
    '9636377',
    '1762799',
    '40846',
    '2140149',
    '324995',
  ];
  console.log('\n=== Aceite: 13 Ahú ===');
  for (const nf of ahu13) {
    const l = r.linhas.find((x) => x.storeSlug === 'ahu' && x.numero === nf);
    console.log(
      l
        ? `NF ${nf}: ${l.decisao} (${l.motivo})`
        : `NF ${nf}: NÃO NA LISTA`,
    );
  }
  const moacir = r.linhas.find(
    (x) => x.storeSlug === 'ahu' && x.numero === '8949813',
  );
  console.log(
    moacir
      ? `NF 8949813: ${moacir.decisao} (${moacir.motivo})`
      : 'NF 8949813: não encontrada',
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
