export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionDbUser } from '@/lib/rh-api-auth';
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
 *
 * action=listar-abas | preview | confirmar | criar-insumo
 * Auth: sessão (getSessionDbUser).
 */
export async function POST(req: NextRequest) {
  const user = await getSessionDbUser();
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

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
      const preview = await previewCatalogo(user.id, linhas);
      return NextResponse.json({
        ok: true,
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
      const result = await confirmarCatalogo(user.id, body.itens ?? []);
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === 'criar-insumo') {
      const criados: Array<{ nome: string; estoqueInsumoId: string }> = [];
      for (const c of body.criar ?? []) {
        const r = await criarInsumoEConfig(user.id, c);
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
