import { SystemTool } from '@/types/admin';

export type ApiToolGate =
  | { type: 'skip' }
  | { type: 'all'; tool: SystemTool }
  | { type: 'any'; tools: SystemTool[] };

type Rule = { prefix: string; gate: ApiToolGate };

const RULES: Rule[] = [
  { prefix: '/api/auth/', gate: { type: 'skip' } },
  { prefix: '/api/cron/', gate: { type: 'skip' } },
  { prefix: '/api/calenza-adm/', gate: { type: 'skip' } },
  { prefix: '/api/rider/', gate: { type: 'skip' } },
  { prefix: '/api/ocorrencias', gate: { type: 'skip' } },
  { prefix: '/api/ifood', gate: { type: 'all', tool: SystemTool.IFOOD } },
  { prefix: '/api/chat', gate: { type: 'all', tool: SystemTool.CHAT } },
  { prefix: '/api/tarefas', gate: { type: 'all', tool: SystemTool.TAREFAS } },
  { prefix: '/api/estoque', gate: { type: 'all', tool: SystemTool.ESTOQUE } },
  { prefix: '/api/cmv-real', gate: { type: 'all', tool: SystemTool.CMV_REAL } },
  { prefix: '/api/nfe/ingest', gate: { type: 'skip' } },
  { prefix: '/api/nfe', gate: { type: 'all', tool: SystemTool.CMV_REAL } },
  { prefix: '/api/cmv', gate: { type: 'all', tool: SystemTool.CMV } },
  { prefix: '/api/checklist', gate: { type: 'all', tool: SystemTool.CHECKLIST } },
  {
    prefix: '/api/etiquetagem',
    gate: {
      type: 'any',
      tools: [SystemTool.ETIQUETAGEM, SystemTool.PRODUTOS],
    },
  },
  { prefix: '/api/pontos', gate: { type: 'all', tool: SystemTool.PONTOS } },
  { prefix: '/api/rh', gate: { type: 'all', tool: SystemTool.RH } },
  {
    prefix: '/api/bonificacao',
    gate: { type: 'any', tools: [SystemTool.RH, SystemTool.BONIFICACAO] },
  },
  {
    prefix: '/api/reports',
    gate: { type: 'all', tool: SystemTool.AGENDAMENTO_RELATORIOS },
  },
  {
    prefix: '/api/whatsapp-sessions',
    gate: {
      type: 'any',
      tools: [SystemTool.CONEXOES, SystemTool.WHATSAPP_CHAT],
    },
  },
  { prefix: '/api/whatsapp', gate: { type: 'all', tool: SystemTool.WHATSAPP_CHAT } },
];

const SORTED_RULES = [...RULES].sort((a, b) => b.prefix.length - a.prefix.length);

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (pathname === prefix) return true;
  if (prefix.endsWith('/')) return pathname.startsWith(prefix);
  return pathname.startsWith(`${prefix}/`);
}

/** Qual ferramenta a Camada 1 exige neste path de API, ou skip/null. */
export function matchApiTool(pathname: string): ApiToolGate | null {
  for (const rule of SORTED_RULES) {
    if (matchesPrefix(pathname, rule.prefix)) return rule.gate;
  }
  return null;
}

export function isCronApiRequest(headers: {
  get(name: string): string | null;
}): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (headers.get('x-cron-secret') === secret) return true;
  if (headers.get('authorization') === `Bearer ${secret}`) return true;
  return false;
}
