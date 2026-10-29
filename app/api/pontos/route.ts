import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRhPermission } from '@/lib/rh-auth';
import { P } from '@/lib/rh-permissions';
import { SystemTool } from '@/types/admin';
import {
  classificarDia,
  divergenciaSecullum,
  STATUS_DIA_LABEL,
  statusSecullumBruto,
  type StatusDiaPonto,
} from '@/lib/pontos/classificarDia';
import { calendarYmd } from '@/lib/pontos/escala-dia';
import { vigenciasParaData } from '@/lib/pontos/escala-vigencia';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { ctx, error } = await requireRhPermission(P.EMPLOYEES_VIEW, SystemTool.PONTOS);
    if (error) return error;

    const { searchParams } = req.nextUrl;
    const lojaParam = searchParams.get('loja');
    const dataParam = searchParams.get('data');

    const dataSelecionada = dataParam
      ? new Date(`${dataParam}T00:00:00.000Z`)
      : (() => {
          const d = new Date();
          d.setUTCHours(0, 0, 0, 0);
          return d;
        })();
    const dataFim = new Date(dataSelecionada.getTime() + 24 * 60 * 60 * 1000);
    const ymd = calendarYmd(dataSelecionada);

    const funcionarioWhere = {
      userId: ctx.userId,
      ativo: true,
      numeroFolha: { not: null },
      ...(lojaParam ? { lojaId: lojaParam } : {}),
    };

    const [funcionarios, registros, pendencias] = await Promise.all([
      prisma.rhFuncionario.findMany({
        where: funcionarioWhere,
        select: {
          id: true,
          nome: true,
          lojaId: true,
          numeroFolha: true,
          dataAdmissao: true,
          dataGozoFerias: true,
          diasFeriasGozados: true,
          statusFerias: true,
          loja: { select: { id: true, nome: true } },
        },
        orderBy: { nome: 'asc' },
      }),
      prisma.pontoRegistro.findMany({
        where: {
          data: { gte: dataSelecionada, lt: dataFim },
          funcionario: funcionarioWhere,
        },
        include: {
          funcionario: {
            select: {
              id: true,
              nome: true,
              lojaId: true,
              loja: { select: { id: true, nome: true } },
            },
          },
        },
      }),
      prisma.pontoPendencia.findMany({
        where: { resolvida: false },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          numeroFolhaOrigem: true,
          nomeSugerido: true,
          data: true,
          createdAt: true,
        },
      }),
    ]);

    const funcionarioIds = funcionarios.map((f) => f.id);

    const [vigencias, ocorrencias] = await Promise.all([
      funcionarioIds.length === 0
        ? Promise.resolve([])
        : prisma.rhEscalaVigencia.findMany({
            where: {
              funcionarioId: { in: funcionarioIds },
              vigenciaInicio: { lte: dataSelecionada },
              OR: [{ vigenciaFim: null }, { vigenciaFim: { gte: dataSelecionada } }],
            },
          }),
      funcionarioIds.length === 0
        ? Promise.resolve([])
        : prisma.rhOcorrencia.findMany({
            where: {
              funcionarioId: { in: funcionarioIds },
              ativo: true,
              OR: [
                {
                  data: { gte: dataSelecionada, lt: dataFim },
                },
                {
                  dataInicioAfastamento: { lte: dataSelecionada },
                  OR: [
                    { dataFimAfastamento: null },
                    { dataFimAfastamento: { gte: dataSelecionada } },
                  ],
                },
              ],
            },
          }),
    ]);

    const vigenciasPorFunc = new Map<string, typeof vigencias>();
    for (const v of vigencias) {
      const list = vigenciasPorFunc.get(v.funcionarioId) ?? [];
      list.push(v);
      vigenciasPorFunc.set(v.funcionarioId, list);
    }

    const ocorrenciasPorFunc = new Map<string, typeof ocorrencias>();
    for (const o of ocorrencias) {
      const list = ocorrenciasPorFunc.get(o.funcionarioId) ?? [];
      list.push(o);
      ocorrenciasPorFunc.set(o.funcionarioId, list);
    }

    const registroPorFunc = new Map(registros.map((r) => [r.funcionarioId, r]));

    const ultimaSync = await prisma.pontoRegistro.aggregate({
      where: {
        data: { gte: dataSelecionada, lt: dataFim },
        funcionario: funcionarioWhere,
      },
      _max: { updatedAt: true },
    });

    type Linha = {
      id: string;
      data: string;
      entrada1: string | null;
      saida1: string | null;
      entrada2: string | null;
      saida2: string | null;
      entrada3: string | null;
      saida3: string | null;
      compensado: boolean;
      neutro: boolean;
      folga: boolean;
      observacoes: string | null;
      temRegistroSecullum: boolean;
      classificacao: {
        status: StatusDiaPonto;
        motivo: string;
        label: string;
      };
      secullumLabel: string | null;
      diverge: boolean;
      funcionario: {
        id: string;
        nome: string;
        lojaId: string | null;
        loja: { id: string; nome: string } | null;
        numeroFolha: string | null;
      };
    };

    const linhas: Linha[] = [];
    const semEscala: Array<{ id: string; nome: string; numeroFolha: string | null }> = [];

    for (const f of funcionarios) {
      const reg = registroPorFunc.get(f.id) ?? null;
      const vigList = vigenciasPorFunc.get(f.id) ?? [];
      const vig = vigenciasParaData(vigList, ymd);
      const ocs = ocorrenciasPorFunc.get(f.id) ?? [];

      const result = classificarDia({
        data: dataSelecionada,
        dataAdmissao: f.dataAdmissao,
        batidas: reg,
        escalaVigente: vig
          ? {
              diasFolga: vig.diasFolga,
              domingoFolga: vig.domingoFolga,
              horarioEntrada: vig.horarioEntrada,
              horarioSaida: vig.horarioSaida,
              escala: vig.escala,
            }
          : null,
        ocorrencias: ocs,
        dataGozoFerias: f.dataGozoFerias,
        diasFeriasGozados: f.diasFeriasGozados,
        statusFerias: f.statusFerias,
      });

      if (result.status === 'FORA_VINCULO') continue;

      if (result.status === 'SEM_ESCALA') {
        semEscala.push({ id: f.id, nome: f.nome, numeroFolha: f.numeroFolha });
      }

      const flags = reg
        ? { folga: reg.folga, compensado: reg.compensado, neutro: reg.neutro }
        : null;

      linhas.push({
        id: reg?.id ?? `virtual-${f.id}-${ymd}`,
        data: dataSelecionada.toISOString(),
        entrada1: reg?.entrada1 ?? null,
        saida1: reg?.saida1 ?? null,
        entrada2: reg?.entrada2 ?? null,
        saida2: reg?.saida2 ?? null,
        entrada3: reg?.entrada3 ?? null,
        saida3: reg?.saida3 ?? null,
        compensado: reg?.compensado ?? false,
        neutro: reg?.neutro ?? false,
        folga: reg?.folga ?? false,
        observacoes: reg?.observacoes ?? null,
        temRegistroSecullum: Boolean(reg),
        classificacao: {
          status: result.status,
          motivo: result.motivo,
          label: STATUS_DIA_LABEL[result.status],
        },
        secullumLabel: flags ? statusSecullumBruto(flags) : null,
        diverge: divergenciaSecullum(result.status, flags),
        funcionario: {
          id: f.id,
          nome: f.nome,
          lojaId: f.lojaId,
          loja: f.loja,
          numeroFolha: f.numeroFolha,
        },
      });
    }

    const pendenciasGrupo = pendencias.reduce<Record<string, number>>((acc, p) => {
      acc[p.numeroFolhaOrigem] = (acc[p.numeroFolhaOrigem] ?? 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      registros: linhas,
      semEscala,
      pendencias: Object.entries(pendenciasGrupo).map(([nf, count]) => ({
        numeroFolhaOrigem: nf,
        count,
        nomeSugerido: pendencias.find((p) => p.numeroFolhaOrigem === nf)?.nomeSugerido ?? null,
      })),
      dataSelecionada: dataSelecionada.toISOString(),
      ultimaSincronizacao: ultimaSync._max.updatedAt?.toISOString() ?? null,
    });
  } catch (err) {
    console.error('[GET /api/pontos]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
