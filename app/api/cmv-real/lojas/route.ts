export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { CMV_STORE_SLUGS, type CmvStoreSlug } from '@/lib/nfe/lojas';
import { gravarCnpjLojaCmv, listarCnpjsLojasCmv } from '@/lib/nfe/lojas-cnpj';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';

function podeEditarCnpj(tenant: {
  isAdmin: boolean;
  perfil: string | null;
}): boolean {
  return tenant.isAdmin || tenant.perfil === 'escritorio';
}

export async function GET() {
  const { tenant, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;
  const lojas = await listarCnpjsLojasCmv(tenant.tenantUserId);
  return NextResponse.json({
    ok: true,
    canEdit: podeEditarCnpj(tenant),
    lojas,
  });
}

export async function PATCH(req: NextRequest) {
  const { tenant, ctx, error } = await requireCmvRealAccess(P.CMV_REAL_VISUALIZAR);
  if (error) return error;
  if (!podeEditarCnpj(tenant) && !(ctx?.hasPermission(P.CMV_REAL_CONFIG) ?? false)) {
    return NextResponse.json({ error: 'Só o escritório edita o CNPJ' }, { status: 403 });
  }

  const body = (await req.json()) as { storeSlug?: string; cnpj?: string | null };
  if (!body.storeSlug || !CMV_STORE_SLUGS.includes(body.storeSlug as CmvStoreSlug)) {
    return NextResponse.json({ error: 'storeSlug inválido' }, { status: 400 });
  }
  try {
    await gravarCnpjLojaCmv({
      tenantUserId: tenant.tenantUserId,
      storeSlug: body.storeSlug as CmvStoreSlug,
      cnpj: body.cnpj ?? null,
    });
    const lojas = await listarCnpjsLojasCmv(tenant.tenantUserId);
    return NextResponse.json({ ok: true, lojas });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Falha ao gravar CNPJ' },
      { status: 400 },
    );
  }
}
