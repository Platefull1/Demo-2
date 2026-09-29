export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { loadCatalogoEstoqueForUserId } from '@/lib/estoque/catalogo';
import {
  confirmarCatalogo,
  criarInsumoEConfig,
  lerCatalogoDoBuffer,
  listarAbas,
  previewCatalogoComCatalogo,
  type ConfirmCatalogoItem,
  type CmvRealSecao,
  type CmvRealUnidade,
} from '@/lib/nfe/importar-catalogo';
import { requireCmvRealTenantFromSession } from '@/lib/nfe/tenant';

/**
 * POST /api/cmv-real/importar-catalogo
 * Sempre no tenant dono (getCmvRealTenant).
 */
export async function POST(req: NextRequest) {
  const tenant = await requireCmvRealTenantFromSession();
  if (tenant instanceof NextResponse) return tenant;

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
        return NextResponse.json({ abas: listarAbas(buffer) });
      }

      const aba = String(form.get('aba') || '');
      if (!aba) return NextResponse.json({ error: 'aba obrigatória' }, { status: 400 });

      const catalogo = await loadCatalogoEstoqueForUserId(tenant.tenantUserId);
      if (!catalogo) {
        return NextResponse.json({ error: 'Catálogo Estoque indisponível' }, { status: 500 });
      }

      const linhas = lerCatalogoDoBuffer(buffer, aba);
      const preview = previewCatalogoComCatalogo(linhas, catalogo.itens);
      return NextResponse.json({
        ok: true,
        tenantUserId: tenant.tenantUserId,
        defaultStoreSlug: tenant.defaultStoreSlug,
        lojaVinculo: tenant.lojaVinculo,
        catalogoEstoqueSize: catalogo.itens.length,
        total: preview.length,
        casados: preview.filter((p) => p.status === 'casado').length,
        sugeridos: preview.filter((p) => p.status === 'sugerido').length,
        naoEncontrados: preview.filter((p) => p.status === 'nao_encontrado').length,
        itens: preview,
      });
    }

    const body = (await req.json()) as {
      action?: string;
      itens?: ConfirmCatalogoItem[];
      criar?: Array<{
        nome: string;
        secao: CmvRealSecao;
        unidade: CmvRealUnidade;
        ordem: number;
      }>;
    };

    if (body.action === 'confirmar') {
      const result = await confirmarCatalogo(tenant.tenantUserId, body.itens ?? []);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === 'criar-insumo') {
      const criados: Array<{ nome: string; estoqueInsumoId: string }> = [];
      for (const c of body.criar ?? []) {
        const r = await criarInsumoEConfig(tenant.tenantUserId, c);
        criados.push({ nome: c.nome, estoqueInsumoId: r.estoqueInsumoId });
      }
      return NextResponse.json({ ok: true, criados });
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 });
  } catch (err) {
    console.error('[cmv-real/importar-catalogo]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro na importação' },
      { status: 500 },
    );
  }
}
