export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getEstoqueTenantContext } from '@/lib/estoque-tenant';
import { loadCatalogoEstoqueFromSession } from '@/lib/estoque/catalogo';
import {
  confirmarCatalogo,
  criarInsumoEConfig,
  lerCatalogoDoBuffer,
  listarAbas,
  previewCatalogo,
  type ConfirmCatalogoItem,
  type CmvRealSecao,
  type CmvRealUnidade,
} from '@/lib/nfe/importar-catalogo';

/**
 * POST /api/cmv-real/importar-catalogo
 * Usa o mesmo tenant/catálogo da aba Produtos do Estoque.
 */
export async function POST(req: NextRequest) {
  const ctx = await getEstoqueTenantContext();
  if (!ctx) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

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

      const linhas = lerCatalogoDoBuffer(buffer, aba);
      const preview = await previewCatalogo(ctx.tenantUserId, linhas);
      const meta = (preview as { _meta?: { tenantUserId: string; catalogoSize: number } })._meta;
      return NextResponse.json({
        ok: true,
        tenantUserId: meta?.tenantUserId ?? ctx.tenantUserId,
        catalogoEstoqueSize: meta?.catalogoSize ?? null,
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
      const result = await confirmarCatalogo(ctx.tenantUserId, body.itens ?? []);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === 'criar-insumo') {
      const criados: Array<{ nome: string; estoqueInsumoId: string }> = [];
      for (const c of body.criar ?? []) {
        const r = await criarInsumoEConfig(ctx.tenantUserId, c);
        criados.push({ nome: c.nome, estoqueInsumoId: r.estoqueInsumoId });
      }
      return NextResponse.json({ ok: true, criados });
    }

    if (body.action === 'debug-catalogo') {
      const cat = await loadCatalogoEstoqueFromSession();
      return NextResponse.json({
        ok: true,
        tenantUserId: cat?.tenantUserId,
        userIds: cat?.userIds,
        size: cat?.itens.length,
        amostra: cat?.itens.slice(0, 5).map((i) => ({
          nome: i.nome,
          kgPorUnidade: i.kgPorUnidade,
        })),
      });
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
