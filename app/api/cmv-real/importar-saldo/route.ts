export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { loadCatalogoEstoqueForUserId } from '@/lib/estoque/catalogo';
import {
  confirmarSaldo,
  lerSaldoDoBuffer,
  listarAbas,
  previewSaldoComCatalogo,
  type ConfirmSaldoItem,
} from '@/lib/nfe/importar-saldo';
import { requireCmvRealAccess } from '@/lib/nfe/tenant';
import { P } from '@/lib/rh-permissions';
import { CMV_STORE_SLUGS, storeLabel } from '@/lib/nfe/lojas';

/**
 * POST /api/cmv-real/importar-saldo
 * multipart: action=listar-abas|preview + file + aba + storeSlug + competencia
 * json: action=confirmar + storeSlug + competencia + itens
 * Exige cmv_real.config (mesmo do catálogo) ou cmv_real.fechamento.
 */
export async function POST(req: NextRequest) {
  // Prefer config; fallback fechamento
  let access = await requireCmvRealAccess(P.CMV_REAL_CONFIG);
  if (access.error) {
    access = await requireCmvRealAccess(P.CMV_REAL_FECHAMENTO);
  }
  if (access.error) return access.error;
  const { tenant } = access;

  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const action = String(form.get('action') || 'preview');
      const file = form.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Arquivo obrigatório' }, { status: 400 });
      }
      const buffer = await file.arrayBuffer();

      if (action === 'listar-abas') {
        return NextResponse.json({
          abas: listarAbas(buffer),
          stores: CMV_STORE_SLUGS.map((s) => ({
            slug: s,
            label: storeLabel(s),
          })),
        });
      }

      const aba = String(form.get('aba') || '');
      const storeSlug = String(form.get('storeSlug') || '');
      const competencia = String(form.get('competencia') || '');
      if (!aba || !storeSlug || !competencia) {
        return NextResponse.json(
          { error: 'aba, storeSlug e competencia obrigatórios' },
          { status: 400 },
        );
      }
      if (
        !tenant.isAdmin &&
        tenant.allowedStoreSlugs &&
        !tenant.allowedStoreSlugs.includes(storeSlug)
      ) {
        return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
      }

      const catalogo = await loadCatalogoEstoqueForUserId(tenant.tenantUserId);
      if (!catalogo) {
        return NextResponse.json({ error: 'Catálogo Estoque indisponível' }, { status: 500 });
      }

      const linhas = lerSaldoDoBuffer(buffer, aba);
      const preview = previewSaldoComCatalogo(linhas, catalogo.itens);
      return NextResponse.json({
        ok: true,
        storeSlug,
        storeLabel: storeLabel(storeSlug),
        competencia,
        total: preview.length,
        casados: preview.filter((p) => p.status === 'casado').length,
        sugeridos: preview.filter((p) => p.status === 'sugerido').length,
        naoEncontrados: preview.filter((p) => p.status === 'nao_encontrado').length,
        itens: preview,
      });
    }

    const body = (await req.json()) as {
      action?: string;
      storeSlug?: string;
      competencia?: string;
      itens?: ConfirmSaldoItem[];
    };

    if (body.action === 'confirmar') {
      if (!body.storeSlug || !body.competencia) {
        return NextResponse.json(
          { error: 'storeSlug e competencia obrigatórios' },
          { status: 400 },
        );
      }
      if (
        !tenant.isAdmin &&
        tenant.allowedStoreSlugs &&
        !tenant.allowedStoreSlugs.includes(body.storeSlug)
      ) {
        return NextResponse.json({ error: 'Sem acesso a esta loja' }, { status: 403 });
      }
      const result = await confirmarSaldo({
        tenantUserId: tenant.tenantUserId,
        storeSlug: body.storeSlug,
        competencia: body.competencia,
        itens: body.itens ?? [],
      });
      return NextResponse.json({ ok: true, ...result });
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 });
  } catch (err) {
    console.error('[cmv-real/importar-saldo]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro' },
      { status: 500 },
    );
  }
}
