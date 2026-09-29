// ─── Strings de permissão (valores exatos salvos no banco) ───────────────────

export const P = {
  // Módulo Funcionários
  EMPLOYEES_VIEW:       'employees.view',
  EMPLOYEES_CREATE:     'employees.create',
  EMPLOYEES_EDIT:       'employees.edit',
  EMPLOYEES_DEACTIVATE: 'employees.deactivate',

  // Módulo Motoboys
  RIDERS_VIEW:          'riders.view',
  RIDERS_CREATE:        'riders.create',
  RIDERS_EDIT:          'riders.edit',
  RIDERS_DEACTIVATE:    'riders.deactivate',
  RIDERS_LAUNCH_PERIOD: 'riders.launch_period',
  RIDERS_APPROVE_DOCS:  'riders.approve_docs',

  // Módulo RH Geral
  RH_VIEW_SALARY:       'rh.view_salary',
  RH_EDIT_SALARY:       'rh.edit_salary',

  // CMV Real — NÃO entram no default de convite (só preset ou toggle manual)
  CMV_REAL_VISUALIZAR:         'cmv_real.visualizar',
  CMV_REAL_REVISAR_APROVAR:    'cmv_real.revisar_aprovar',
  CMV_REAL_LANCAMENTOS:        'cmv_real.lancamentos',
  CMV_REAL_MAPEAMENTO_CRIAR:   'cmv_real.mapeamento_criar',
  CMV_REAL_MAPEAMENTO_EDITAR:  'cmv_real.mapeamento_editar',
  CMV_REAL_FECHAMENTO:         'cmv_real.fechamento',
  CMV_REAL_REABRIR:            'cmv_real.reabrir',
  CMV_REAL_CONFIG:             'cmv_real.config',

  // Gestão de usuários — apenas Admin (nunca concedida a RH)
  USERS_MANAGE:         'users.manage',
} as const;

export type RhPermissionKey = typeof P[keyof typeof P];

/** Todas as permissões CMV Real */
export const CMV_REAL_PERMISSIONS: RhPermissionKey[] = [
  P.CMV_REAL_VISUALIZAR,
  P.CMV_REAL_REVISAR_APROVAR,
  P.CMV_REAL_LANCAMENTOS,
  P.CMV_REAL_MAPEAMENTO_CRIAR,
  P.CMV_REAL_MAPEAMENTO_EDITAR,
  P.CMV_REAL_FECHAMENTO,
  P.CMV_REAL_REABRIR,
  P.CMV_REAL_CONFIG,
];

export const CMV_REAL_PERMISSION_SET = new Set<string>(CMV_REAL_PERMISSIONS);

// Permissões que NUNCA podem ser concedidas a um membro RH
export const ADMIN_ONLY_PERMISSIONS = new Set<string>([P.USERS_MANAGE]);

/**
 * Permissões concedidas no convite por default.
 * NÃO inclui cmv_real.* nem users.manage.
 */
export const DEFAULT_MEMBER_PERMISSIONS: RhPermissionKey[] = (
  Object.values(P) as RhPermissionKey[]
).filter((p) => !ADMIN_ONLY_PERMISSIONS.has(p) && !CMV_REAL_PERMISSION_SET.has(p));

// ─── Rótulos legíveis ─────────────────────────────────────────────────────────

export const PERMISSION_LABELS: Record<string, string> = {
  'employees.view':       'Visualizar funcionários',
  'employees.create':     'Cadastrar funcionários',
  'employees.edit':       'Editar funcionários',
  'employees.deactivate': 'Inativar funcionários',
  'riders.view':          'Visualizar motoboys',
  'riders.create':        'Cadastrar motoboys',
  'riders.edit':          'Editar motoboys',
  'riders.deactivate':    'Inativar motoboys',
  'riders.launch_period': 'Lançar quinzenas',
  'riders.approve_docs':  'Aprovar/rejeitar documentos',
  'rh.view_salary':       'Visualizar salários e valores',
  'rh.edit_salary':       'Editar salários e valores',
  'cmv_real.visualizar':        'Visualizar CMV Real',
  'cmv_real.revisar_aprovar':   'Revisar e aprovar NF-e',
  'cmv_real.lancamentos':       'Lançamentos manuais',
  'cmv_real.mapeamento_criar':  'Criar mapeamentos',
  'cmv_real.mapeamento_editar': 'Editar mapeamentos / fornecedor fora do CMV',
  'cmv_real.fechamento':        'Fechamento do mês',
  'cmv_real.reabrir':           'Reabrir mês fechado',
  'cmv_real.config':            'Configurações CMV Real',
  'users.manage':         'Gerenciar usuários de RH',
};

// ─── Grupos de permissões para a UI de toggles ────────────────────────────────

export const PERMISSION_GROUPS: Array<{
  label: string;
  permissions: RhPermissionKey[];
}> = [
  {
    label: 'Funcionários',
    permissions: [
      P.EMPLOYEES_VIEW,
      P.EMPLOYEES_CREATE,
      P.EMPLOYEES_EDIT,
      P.EMPLOYEES_DEACTIVATE,
    ],
  },
  {
    label: 'Motoboys',
    permissions: [
      P.RIDERS_VIEW,
      P.RIDERS_CREATE,
      P.RIDERS_EDIT,
      P.RIDERS_DEACTIVATE,
      P.RIDERS_LAUNCH_PERIOD,
      P.RIDERS_APPROVE_DOCS,
    ],
  },
  {
    label: 'RH Geral',
    permissions: [P.RH_VIEW_SALARY, P.RH_EDIT_SALARY],
  },
  {
    label: 'CMV Real',
    permissions: CMV_REAL_PERMISSIONS,
  },
];

// ─── Lojas / perfis (presets) ─────────────────────────────────────────────────

export const RH_STORE_SLUGS = ['ahu', 'pilarzinho', 'portao', 'uberaba'] as const;
export type RhStoreSlug = (typeof RH_STORE_SLUGS)[number];

export const RH_STORE_LABELS: Record<RhStoreSlug, string> = {
  ahu: 'Ahu',
  pilarzinho: 'Pilarzinho',
  portao: 'Portão',
  uberaba: 'Uberaba',
};

export type RhMemberPerfil = 'escritorio' | 'gerente_loja';

export const RH_PERFIL_LABELS: Record<RhMemberPerfil, string> = {
  escritorio: 'Escritório',
  gerente_loja: 'Gerente de loja',
};

export interface RhPermissionPreset {
  id: RhMemberPerfil;
  label: string;
  /** Permissões CMV Real concedidas pelo preset */
  cmvRealPermissions: RhPermissionKey[];
  /**
   * null = lojas vazias (= todas).
   * 'required' = precisa escolher ao menos uma (Gerente).
   */
  lojasMode: 'todas' | 'required';
}

/** Presets: só afetam cmv_real.*; demais permissões RH ficam como estão. */
export const RH_PERMISSION_PRESETS: RhPermissionPreset[] = [
  {
    id: 'escritorio',
    label: 'Escritório',
    cmvRealPermissions: CMV_REAL_PERMISSIONS.filter(
      (p) => p !== P.CMV_REAL_REABRIR && p !== P.CMV_REAL_CONFIG,
    ),
    lojasMode: 'todas',
  },
  {
    id: 'gerente_loja',
    label: 'Gerente de loja',
    cmvRealPermissions: [
      P.CMV_REAL_VISUALIZAR,
      P.CMV_REAL_REVISAR_APROVAR,
      P.CMV_REAL_LANCAMENTOS,
      P.CMV_REAL_MAPEAMENTO_CRIAR,
    ],
    lojasMode: 'required',
  },
];

export function getPreset(id: string): RhPermissionPreset | undefined {
  return RH_PERMISSION_PRESETS.find((p) => p.id === id);
}

export function isValidStoreSlug(slug: string): slug is RhStoreSlug {
  return (RH_STORE_SLUGS as readonly string[]).includes(slug);
}
