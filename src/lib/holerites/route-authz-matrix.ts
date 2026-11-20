import { P } from '@/lib/rh-permissions';

export type AuthzPermission =
  | typeof P.PAYSLIPS_VIEW
  | typeof P.PAYSLIPS_UPLOAD
  | typeof P.PAYSLIPS_PUBLISH
  | typeof P.PAYSLIPS_REVOKE
  | typeof P.PAYSLIPS_PORTAL_MANAGE
  /** GET lote: view OU upload (checagem manual após requireRhPermission(undefined)) */
  | 'payslips.view|payslips.upload';

export type AuthzRoute = {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  permission: AuthzPermission;
  tenantFilter: true;
  /** Import dinâmico do handler */
  load: () => Promise<(req: Request, ctx?: { params: Promise<Record<string, string>> }) => Promise<Response>>;
  /** Precisa de params.id (payslip ou batch ou funcionario) */
  paramKind?: 'payslip' | 'batch' | 'funcionario';
  body?: unknown;
};

/**
 * Matriz canônica: Rota · Método · Permissão · Tenant.
 * Fonte para route-authz.test.ts e relatório etapa 7.
 */
export const RH_HOLERITES_AUTHZ_ROUTES: AuthzRoute[] = [
  {
    id: 'list',
    path: '/api/rh/holerites',
    method: 'GET',
    permission: P.PAYSLIPS_VIEW,
    tenantFilter: true,
    load: async () => (await import('../../../app/api/rh/holerites/route')).GET,
  },
  {
    id: 'export',
    path: '/api/rh/holerites/export.csv',
    method: 'GET',
    permission: P.PAYSLIPS_VIEW,
    tenantFilter: true,
    load: async () =>
      (await import('../../../app/api/rh/holerites/export.csv/route')).GET,
  },
  {
    id: 'funcionario-get',
    path: '/api/rh/holerites/funcionarios/[id]',
    method: 'GET',
    permission: P.PAYSLIPS_VIEW,
    tenantFilter: true,
    paramKind: 'funcionario',
    load: async () =>
      (await import('../../../app/api/rh/holerites/funcionarios/[id]/route'))
        .GET,
  },
  {
    id: 'portal',
    path: '/api/rh/holerites/funcionarios/[id]/portal',
    method: 'POST',
    permission: P.PAYSLIPS_PORTAL_MANAGE,
    tenantFilter: true,
    paramKind: 'funcionario',
    body: { action: 'revoke_sessions' },
    load: async () =>
      (
        await import(
          '../../../app/api/rh/holerites/funcionarios/[id]/portal/route'
        )
      ).POST,
  },
  {
    id: 'arquivo',
    path: '/api/rh/holerites/[id]/arquivo',
    method: 'GET',
    permission: P.PAYSLIPS_VIEW,
    tenantFilter: true,
    paramKind: 'payslip',
    load: async () =>
      (await import('../../../app/api/rh/holerites/[id]/arquivo/route')).GET,
  },
  {
    id: 'historico',
    path: '/api/rh/holerites/[id]/historico',
    method: 'GET',
    permission: P.PAYSLIPS_VIEW,
    tenantFilter: true,
    paramKind: 'payslip',
    load: async () =>
      (await import('../../../app/api/rh/holerites/[id]/historico/route')).GET,
  },
  {
    id: 'revogar',
    path: '/api/rh/holerites/[id]/revogar',
    method: 'POST',
    permission: P.PAYSLIPS_REVOKE,
    tenantFilter: true,
    paramKind: 'payslip',
    body: { motivo: 'Motivo de teste com dez+' },
    load: async () =>
      (await import('../../../app/api/rh/holerites/[id]/revogar/route')).POST,
  },
  {
    id: 'reenviar-aviso',
    path: '/api/rh/holerites/[id]/reenviar-aviso',
    method: 'POST',
    permission: P.PAYSLIPS_PUBLISH,
    tenantFilter: true,
    paramKind: 'payslip',
    load: async () =>
      (await import('../../../app/api/rh/holerites/[id]/reenviar-aviso/route'))
        .POST,
  },
  {
    id: 'lotes-create',
    path: '/api/rh/holerites/lotes',
    method: 'POST',
    permission: P.PAYSLIPS_UPLOAD,
    tenantFilter: true,
    body: {
      competencia: '2099-01',
      type: 'MENSAL',
      files: [{ name: 'x.pdf', sizeBytes: 100 }],
    },
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/route')).POST,
  },
  {
    id: 'lote-get',
    path: '/api/rh/holerites/lotes/[id]',
    method: 'GET',
    permission: 'payslips.view|payslips.upload',
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/route')).GET,
  },
  {
    id: 'lote-delete',
    path: '/api/rh/holerites/lotes/[id]',
    method: 'DELETE',
    permission: P.PAYSLIPS_UPLOAD,
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/route')).DELETE,
  },
  {
    id: 'lote-preview',
    path: '/api/rh/holerites/lotes/[id]/preview',
    method: 'GET',
    permission: P.PAYSLIPS_UPLOAD,
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/preview/route'))
        .GET,
  },
  {
    id: 'lote-processar',
    path: '/api/rh/holerites/lotes/[id]/processar',
    method: 'POST',
    permission: P.PAYSLIPS_UPLOAD,
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/processar/route'))
        .POST,
  },
  {
    id: 'lote-publicar',
    path: '/api/rh/holerites/lotes/[id]/publicar',
    method: 'POST',
    permission: P.PAYSLIPS_PUBLISH,
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/publicar/route'))
        .POST,
  },
  {
    id: 'lote-reenviar-avisos',
    path: '/api/rh/holerites/lotes/[id]/reenviar-avisos',
    method: 'POST',
    permission: P.PAYSLIPS_PUBLISH,
    tenantFilter: true,
    paramKind: 'batch',
    load: async () =>
      (
        await import(
          '../../../app/api/rh/holerites/lotes/[id]/reenviar-avisos/route'
        )
      ).POST,
  },
  {
    id: 'lote-vinculos',
    path: '/api/rh/holerites/lotes/[id]/vinculos',
    method: 'PATCH',
    permission: P.PAYSLIPS_UPLOAD,
    tenantFilter: true,
    paramKind: 'batch',
    body: {
      action: 'ignorar',
      sourcePath: 'x/_staging/y/z.pdf',
      pageIndexes: [0],
    },
    load: async () =>
      (await import('../../../app/api/rh/holerites/lotes/[id]/vinculos/route'))
        .PATCH,
  },
];
