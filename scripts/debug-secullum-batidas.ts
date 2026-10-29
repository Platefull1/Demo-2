/**
 * Consulta SOMENTE LEITURA da API Secullum Integração Externa.
 * Não grava no banco Platefull.
 *
 * Uso: npx tsx --env-file=.env scripts/debug-secullum-batidas.ts
 */
const BASE = 'https://pontowebintegracaoexterna.secullum.com.br/IntegracaoExterna';

async function obterToken(): Promise<{ token: string; bancoid: string }> {
  const user = process.env.SECULLUM_API_USER ?? process.env.SECULLUM_USER ?? '';
  const pass = process.env.SECULLUM_API_PASS ?? process.env.SECULLUM_PASS ?? '';
  const bancoid = process.env.SECULLUM_BANCO_ID ?? '';
  if (!user || !pass) throw new Error('SECULLUM_API_USER/SECULLUM_API_PASS não configuradas');

  const body = new URLSearchParams({
    grant_type: 'password',
    username: user,
    password: pass,
    client_id: '3',
  });
  const res = await fetch('https://autenticador.secullum.com.br/Token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) throw new Error(`Auth ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.access_token) throw new Error('Token ausente');
  return { token: data.access_token as string, bancoid };
}

function headers(token: string, bancoid: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    secullumidbancoselecionado: bancoid,
    Accept: 'application/json',
  };
}

async function getJson(
  token: string,
  bancoid: string,
  path: string,
): Promise<{ status: number; headers: Record<string, string>; body: unknown }> {
  const url = `${BASE}${path}`;
  console.log('\n>>> GET', url);
  const res = await fetch(url, { headers: headers(token, bancoid) });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* raw */
  }
  const hdrs: Record<string, string> = {};
  res.headers.forEach((v, k) => {
    if (/rate|retry|limit/i.test(k)) hdrs[k] = v;
  });
  return { status: res.status, headers: hdrs, body };
}

async function postJson(
  token: string,
  bancoid: string,
  path: string,
  payload: unknown,
): Promise<{ status: number; body: unknown }> {
  const url = `${BASE}${path}`;
  console.log('\n>>> POST', url, JSON.stringify(payload));
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...headers(token, bancoid), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* raw */
  }
  return { status: res.status, body };
}

const TIPO_LABEL: Record<string, string> = {
  '0': 'Original',
  '1': 'Manual',
  '2': 'PreAssinalado',
  '3': 'Desconsiderado',
};
const ORIGEM_LABEL: Record<string, string> = {
  '0': 'Desconhecido',
  '1': 'RelogioPonto',
  '2': 'IncluidoManualmente',
  '3': 'PreAssinalado',
  '4': 'Checkin',
  '5': 'CentralFuncionarioWeb',
  '6': 'CentralFuncionarioApp',
  '7': 'CentralFuncionarioAppOffline',
  '8': 'IntegracaoExterna',
};

type CalcBody = {
  Colunas?: string[];
  Linhas?: Array<{ Key?: string; Value?: unknown[] }>;
  Totais?: string[];
};

function linhaYmd(key: unknown): string {
  const s = String(key ?? '');
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(s);
  return m ? m[1] : s.slice(0, 10);
}

function imprimirCalcular(label: string, status: number, body: unknown, ymds: string[]) {
  console.log('\n========== CALCULAR', label, '==========');
  console.log('HTTP', status);
  if (!body || typeof body !== 'object') {
    console.log(JSON.stringify(body, null, 2));
    return;
  }
  const calc = body as CalcBody;
  console.log('\n--- Colunas (completo) ---');
  console.log(JSON.stringify(calc.Colunas ?? [], null, 2));
  console.log('\n--- Totais ---');
  console.log(JSON.stringify(calc.Totais ?? [], null, 2));
  const want = new Set(ymds);
  const linhas = (calc.Linhas ?? []).filter((l) => want.has(linhaYmd(l.Key)));
  console.log('\n--- Linhas filtradas', ymds.join(', '), `(${linhas.length} de ${calc.Linhas?.length ?? 0}) ---`);
  console.log(JSON.stringify(linhas, null, 2));
}

async function main() {
  const pisAdriana = '20031614455';
  const pisMilagro = '870615404270';
  const periodo = { DataInicial: '2026-09-28', DataFinal: '2026-10-27' };

  const { token, bancoid } = await obterToken();
  console.log('auth ok, bancoid=', bancoid, 'token len=', token.length);

  const consultas: Array<{ label: string; path: string }> = [
    {
      label: 'BATIDAS Adriana 2026-10-07',
      path: `/Batidas?dataInicio=2026-10-07&dataFim=2026-10-07&funcionarioPis=${encodeURIComponent(pisAdriana)}`,
    },
    {
      label: 'FONTE DADOS Adriana 2026-10-07',
      path: `/FonteDados?dataInicio=2026-10-07&dataFim=2026-10-07&funcionarioPis=${encodeURIComponent(pisAdriana)}`,
    },
    {
      label: 'BATIDAS Milagro 2026-10-01 a 2026-10-07',
      path: `/Batidas?dataInicio=2026-10-01&dataFim=2026-10-07&funcionarioPis=${encodeURIComponent(pisMilagro)}`,
    },
    {
      label: 'FONTE DADOS Milagro 2026-10-01 a 2026-10-07',
      path: `/FonteDados?dataInicio=2026-10-01&dataFim=2026-10-07&funcionarioPis=${encodeURIComponent(pisMilagro)}`,
    },
  ];

  for (const c of consultas) {
    console.log('\n==========', c.label, '==========');
    const r = await getJson(token, bancoid, c.path);
    console.log('HTTP', r.status, 'quota', r.headers);
    console.log(JSON.stringify(r.body, null, 2));
    if (c.label.startsWith('FONTE DADOS Adriana') && Array.isArray(r.body)) {
      console.log('\n--- Tipo/Origem (Adriana 07/10) ---');
      for (const row of r.body as Array<Record<string, unknown>>) {
        const tipo = String(row.Tipo ?? '');
        const origem = String(row.Origem ?? '');
        console.log(
          JSON.stringify({
            Data: row.Data,
            Hora: row.Hora,
            Tipo: row.Tipo,
            TipoLabel: TIPO_LABEL[tipo] ?? '?',
            Origem: row.Origem,
            OrigemLabel: ORIGEM_LABEL[origem] ?? '?',
            EquipamentoId: row.EquipamentoId,
            DataInclusao: row.DataInclusao,
          }),
        );
      }
    }
    await new Promise((x) => setTimeout(x, 600));
  }

  const calcAdriana = await postJson(token, bancoid, '/Calcular', {
    FuncionarioPis: pisAdriana,
    ...periodo,
  });
  imprimirCalcular('Adriana 2026-09-28 a 2026-10-27', calcAdriana.status, calcAdriana.body, [
    '2026-10-07',
  ]);

  await new Promise((x) => setTimeout(x, 600));

  const calcMilagro = await postJson(token, bancoid, '/Calcular', {
    FuncionarioPis: pisMilagro,
    ...periodo,
  });
  imprimirCalcular('Milagro 2026-09-28 a 2026-10-27', calcMilagro.status, calcMilagro.body, [
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
    '2026-10-05',
    '2026-10-06',
    '2026-10-07',
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
