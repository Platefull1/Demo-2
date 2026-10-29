/**
 * Matriz de acesso da Central de Ocorrências.
 * Espelha middleware de isolamento + requireOcorrenciasContext + RH core.
 */

export type OcorrenciasProfileId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';

export interface OcorrenciasProfile {
  id: OcorrenciasProfileId;
  loggedIn: boolean;
  tenantId: string;
  canRegister: boolean;
  canView: boolean;
  /** Só REGISTRAR_OCORRENCIAS, sem VER e sem outras ferramentas. */
  isOcorrenciasOnly: boolean;
  isTenantOwner: boolean;
  hasCoreRh: boolean;
}

export const CALENZANO_TENANT = 'tenant-calenzano';
export const OTHER_TENANT = 'tenant-outra-empresa';

export const PROFILES: Record<OcorrenciasProfileId, OcorrenciasProfile> = {
  P1: {
    id: 'P1',
    loggedIn: true,
    tenantId: CALENZANO_TENANT,
    canRegister: true,
    canView: false,
    isOcorrenciasOnly: true,
    isTenantOwner: false,
    hasCoreRh: false,
  },
  P2: {
    id: 'P2',
    loggedIn: true,
    tenantId: CALENZANO_TENANT,
    canRegister: false,
    canView: true,
    isOcorrenciasOnly: false,
    isTenantOwner: false,
    hasCoreRh: false,
  },
  P3: {
    id: 'P3',
    loggedIn: true,
    tenantId: CALENZANO_TENANT,
    canRegister: true,
    canView: true,
    isOcorrenciasOnly: false,
    isTenantOwner: false,
    hasCoreRh: false,
  },
  P4: {
    id: 'P4',
    loggedIn: true,
    tenantId: CALENZANO_TENANT,
    canRegister: true,
    canView: true,
    isOcorrenciasOnly: false,
    isTenantOwner: true,
    hasCoreRh: true,
  },
  P5: {
    id: 'P5',
    loggedIn: true,
    tenantId: OTHER_TENANT,
    canRegister: true,
    canView: true,
    isOcorrenciasOnly: false,
    isTenantOwner: false,
    hasCoreRh: false,
  },
  P6: {
    id: 'P6',
    loggedIn: false,
    tenantId: '',
    canRegister: false,
    canView: false,
    isOcorrenciasOnly: false,
    isTenantOwner: false,
    hasCoreRh: false,
  },
};

export type PageOutcome =
  | 'ok'
  | 'redirect-login'
  | 'redirect-nova'
  | 'redirect-ocorrencias'
  | 'redirect-continuar'
  | 'redirect-dashboard';

export type ApiOutcome = 200 | 201 | 400 | 401 | 403 | 404;

export function pageAccess(profile: OcorrenciasProfile, path: string): PageOutcome {
  if (!profile.loggedIn) return 'redirect-login';

  if (profile.isOcorrenciasOnly) {
    if (path === '/ocorrencias/nova' || path.startsWith('/ocorrencias/nova/')) {
      return 'ok';
    }
    return 'redirect-nova';
  }

  if (path === '/ocorrencias' || path.startsWith('/ocorrencias/')) {
    if (path.startsWith('/ocorrencias/nova')) {
      if (!profile.canRegister) {
        return profile.canView ? 'redirect-ocorrencias' : 'redirect-continuar';
      }
      return 'ok';
    }
    if (!profile.canView) {
      return profile.canRegister ? 'redirect-nova' : 'redirect-dashboard';
    }
    return 'ok';
  }

  return 'ok';
}

export function apiAccess(
  profile: OcorrenciasProfile,
  method: string,
  path: string,
  opts?: { resourceTenantId?: string },
): ApiOutcome {
  const m = method.toUpperCase();

  if (profile.isOcorrenciasOnly) {
    const allowedApi =
      path === '/api/ocorrencias' ||
      path.startsWith('/api/ocorrencias/') ||
      path.startsWith('/api/auth/') ||
      path === '/api/auth';
    if (!allowedApi) return 403;
  }

  if (path.startsWith('/api/rh/')) {
    if (!profile.loggedIn) return 401;
    if (!profile.hasCoreRh) return 403;
    return 200;
  }

  if (path === '/api/ocorrencias/isolation' && m === 'GET') {
    return 200;
  }

  if (path === '/api/ocorrencias/set-mode') {
    if (!profile.loggedIn) return 401;
    return 200;
  }

  if (path === '/api/ocorrencias/opcoes' && m === 'GET') {
    if (!profile.loggedIn) return 401;
    if (!profile.canRegister && !profile.canView) return 401;
    return 200;
  }

  if (path === '/api/ocorrencias' && m === 'POST') {
    if (!profile.loggedIn) return 401;
    if (!profile.canRegister) return 403;
    if (opts?.resourceTenantId && opts.resourceTenantId !== profile.tenantId) {
      return 400;
    }
    return 201;
  }

  if (path === '/api/ocorrencias' && m === 'GET') {
    if (!profile.loggedIn) return 401;
    if (!profile.canView) return 403;
    return 200;
  }

  const idMatch = path.match(/^\/api\/ocorrencias\/([^/]+)(\/foto)?$/);
  if (idMatch && m === 'GET' && idMatch[1] !== 'opcoes' && idMatch[1] !== 'isolation' && idMatch[1] !== 'set-mode') {
    if (!profile.loggedIn) return 401;
    if (!profile.canView) return 403;
    if (opts?.resourceTenantId && opts.resourceTenantId !== profile.tenantId) {
      return 404;
    }
    return 200;
  }

  if (!profile.loggedIn) return 401;
  return 200;
}

export function otherModuleApiAccess(
  profile: OcorrenciasProfile,
  path: string,
): ApiOutcome {
  if (profile.isOcorrenciasOnly) return 403;
  if (!profile.loggedIn) return 401;
  return 200;
}
