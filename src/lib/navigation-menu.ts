/**
 * Definição pura do menu (sem Prisma / auth).
 * Usada no cliente (AppShell) e nos testes.
 */

import { SystemTool } from '@/types/admin';

export type NavIconName =
  | 'LayoutDashboard'
  | 'ShoppingBag'
  | 'ListChecks'
  | 'ClipboardCheck'
  | 'AlertTriangle'
  | 'BarChart2'
  | 'Receipt'
  | 'Warehouse'
  | 'Users'
  | 'Clock'
  | 'MessageSquare'
  | 'Bot'
  | 'Link2'
  | 'Package'
  | 'Tag'
  | 'FileBarChart2';

export type NavMatch = {
  exact?: string[];
  prefix?: string[];
};

export type NavChildDTO = {
  id: string;
  label: string;
  href: string;
};

export type NavItemDTO = {
  id: string;
  label: string;
  href?: string;
  icon: NavIconName;
  match: NavMatch;
  children?: NavChildDTO[];
};

export type NavSectionDTO = {
  id: string;
  label: string;
  items: NavItemDTO[];
};

export function navItemIsActive(pathname: string, match: NavMatch): boolean {
  if (match.exact?.some((p) => pathname === p)) return true;
  if (match.prefix?.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export function buildNavSections(input: {
  hasTool: (tool: SystemTool) => boolean;
  canViewCmvReal: boolean;
}): NavSectionDTO[] {
  const { hasTool, canViewCmvReal } = input;
  const canViewOcorrencias = hasTool(SystemTool.VER_OCORRENCIAS);
  const canRegisterOcorrencias = hasTool(SystemTool.REGISTRAR_OCORRENCIAS);

  const geral: NavItemDTO[] = [
    {
      id: 'visao-geral',
      label: 'Visão geral',
      href: '/dashboard',
      icon: 'LayoutDashboard',
      match: { exact: ['/dashboard'] },
    },
  ];

  const operacao: NavItemDTO[] = [];

  if (hasTool(SystemTool.IFOOD)) {
    operacao.push({
      id: 'ifood',
      label: 'iFood',
      icon: 'ShoppingBag',
      match: { prefix: ['/ifood'] },
      children: [
        { id: 'ifood-config', label: 'Configurações', href: '/ifood/configuracoes' },
        { id: 'ifood-operacional', label: 'Operacional', href: '/ifood/operacional' },
        { id: 'ifood-financeiro', label: 'Financeiro', href: '/ifood/financeiro' },
        { id: 'ifood-cardapio', label: 'Cardápio', href: '/ifood/cardapio' },
      ],
    });
  }

  if (hasTool(SystemTool.TAREFAS)) {
    operacao.push({
      id: 'tarefas',
      label: 'Tarefas',
      href: '/tarefas',
      icon: 'ListChecks',
      match: { prefix: ['/tarefas'] },
    });
  }

  if (hasTool(SystemTool.CHECKLIST)) {
    operacao.push({
      id: 'checklist',
      label: 'Checklist',
      href: '/checklist',
      icon: 'ClipboardCheck',
      match: { prefix: ['/checklist'] },
    });
  }

  if (canViewOcorrencias || canRegisterOcorrencias) {
    operacao.push({
      id: 'ocorrencias',
      label: 'Central de Ocorrências',
      href: canViewOcorrencias ? '/ocorrencias' : '/ocorrencias/nova',
      icon: 'AlertTriangle',
      match: { exact: ['/ocorrencias'], prefix: ['/ocorrencias/'] },
    });
  }

  const financeiro: NavItemDTO[] = [];

  if (hasTool(SystemTool.CMV)) {
    financeiro.push({
      id: 'cmv',
      label: 'CMV',
      href: '/cmv',
      icon: 'BarChart2',
      match: { exact: ['/cmv'], prefix: ['/cmv/'] },
    });
  }

  if (canViewCmvReal) {
    financeiro.push({
      id: 'cmv-real',
      label: 'CMV Real',
      href: '/cmv-real/notas',
      icon: 'Receipt',
      match: { prefix: ['/cmv-real'] },
    });
  }

  if (hasTool(SystemTool.ESTOQUE)) {
    financeiro.push({
      id: 'estoque',
      label: 'Estoque',
      href: '/estoque',
      icon: 'Warehouse',
      match: { prefix: ['/estoque'] },
    });
  }

  const pessoas: NavItemDTO[] = [];

  if (hasTool(SystemTool.RH)) {
    pessoas.push({
      id: 'rh',
      label: 'RH',
      href: '/rh',
      icon: 'Users',
      match: { prefix: ['/rh', '/bonificacao'] },
    });
  }

  if (hasTool(SystemTool.PONTOS)) {
    pessoas.push({
      id: 'pontos',
      label: 'Pontos',
      href: '/pontos',
      icon: 'Clock',
      match: { prefix: ['/pontos'] },
    });
  }

  const comunicacao: NavItemDTO[] = [];

  if (hasTool(SystemTool.WHATSAPP_CHAT)) {
    comunicacao.push({
      id: 'whatsapp',
      label: 'WhatsApp Chat',
      href: '/whatsapp-tools',
      icon: 'MessageSquare',
      match: { exact: ['/whatsapp-tools'], prefix: ['/whatsapp-config'] },
    });
  }

  if (hasTool(SystemTool.CHAT)) {
    comunicacao.push({
      id: 'chat',
      label: 'Chat',
      href: '/chat',
      icon: 'Bot',
      match: { prefix: ['/chat'] },
    });
  }

  const configuracoes: NavItemDTO[] = [];

  if (hasTool(SystemTool.CONEXOES)) {
    configuracoes.push({
      id: 'conexoes',
      label: 'Conexões',
      href: '/connections',
      icon: 'Link2',
      match: { exact: ['/connections'] },
    });
  }

  if (hasTool(SystemTool.PRODUTOS)) {
    configuracoes.push({
      id: 'produtos',
      label: 'Produtos',
      href: '/produtos',
      icon: 'Package',
      match: { exact: ['/produtos'] },
    });
  }

  if (hasTool(SystemTool.ETIQUETAGEM)) {
    configuracoes.push({
      id: 'etiquetagem',
      label: 'Etiquetagem',
      href: '/etiquetagem',
      icon: 'Tag',
      match: { prefix: ['/etiquetagem'] },
    });
  }

  if (hasTool(SystemTool.AGENDAMENTO_RELATORIOS)) {
    configuracoes.push({
      id: 'relatorios',
      label: 'Central de Relatórios',
      href: '/relatorios',
      icon: 'FileBarChart2',
      match: { exact: ['/relatorios'], prefix: ['/relatorios/'] },
    });
  }

  return [
    { id: 'geral', label: 'Geral', items: geral },
    { id: 'operacao', label: 'Operação', items: operacao },
    { id: 'financeiro', label: 'Financeiro', items: financeiro },
    { id: 'pessoas', label: 'Pessoas', items: pessoas },
    { id: 'comunicacao', label: 'Comunicação', items: comunicacao },
    { id: 'configuracoes', label: 'Configurações', items: configuracoes },
  ].filter((section) => section.items.length > 0);
}
