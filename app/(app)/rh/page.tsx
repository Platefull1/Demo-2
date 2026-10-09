'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLoja } from '@/contexts/LojaContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { RhLojaCombobox } from '@/components/rh/RhLojaCombobox';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Funcionario {
  id: string;
  nome: string;
  salarioBruto: number;
  composicaoSalarial?: {
    baseCalculoEncargos: number;
    valorAlimentacao: number;
    valorVT: number;
    bonificacaoAssiduidade: number;
  };
  escala: '6x1' | '5x2';
  ativo: boolean;
}

interface Stats {
  total: number;
  custoMensal: number;
  escala6x1: number;
  escala5x2: number;
}

interface AlertasResumo {
  totalCriticos: number;
  totalFeriasVencidas: number;
  totalExperienciaMes: number;
}

interface AniversarianteFuncionario {
  id: string;
  nome: string;
  diaMes: number;
  lojaNome: string | null;
  cargoNome: string | null;
}

interface AniversariosResumo {
  mesMes: { label: string; count: number; funcionarios: AniversarianteFuncionario[] };
  mesProximo: { label: string; count: number; funcionarios: AniversarianteFuncionario[] };
}

function kpiCellClass(index: number) {
  return cn(
    'p-4 md:p-6',
    (index === 0 || index === 2) && 'border-r border-border',
    (index === 0 || index === 1) && 'border-b border-border xl:border-b-0',
    index < 3 && 'xl:border-r'
  );
}

export default function RhDashboard() {
  const { lojas, lojaSelecionada, setLojaSelecionada, loading: lojaLoading } = useLoja();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [alertasResumo, setAlertasResumo] = useState<AlertasResumo | null>(null);
  const [ocorrenciasMes, setOcorrenciasMes] = useState<number | null>(null);
  const [aniversarios, setAniversarios] = useState<AniversariosResumo | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const params = new URLSearchParams({ ativo: 'true' });
        if (lojaSelecionada) params.set('lojaId', lojaSelecionada.id);
        const [funcsRes, custosRes] = await Promise.all([
          fetch(`/api/rh/funcionarios?${params}`),
          fetch('/api/rh/custos/consolidado'),
        ]);
        if (!funcsRes.ok) throw new Error('Falha ao carregar');
        const data: Funcionario[] = await funcsRes.json();
        const total = data.length;
        const escala6x1 = data.filter((f) => f.escala === '6x1').length;
        const escala5x2 = data.filter((f) => f.escala === '5x2').length;

        let custoMensal = 0;
        if (custosRes.ok) {
          const custosData = await custosRes.json();
          custoMensal = lojaSelecionada
            ? (custosData.lojas?.find(
                (l: { lojaId: string; totalCustoReal: number }) =>
                  l.lojaId === lojaSelecionada.id
              )?.totalCustoReal ?? 0)
            : (custosData.rede?.totalCustoReal ?? 0);
        }

        setStats({ total, custoMensal, escala6x1, escala5x2 });
      } catch {
        setStats({ total: 0, custoMensal: 0, escala6x1: 0, escala5x2: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [lojaSelecionada]);

  useEffect(() => {
    fetch('/api/rh/aniversarios')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAniversarios(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/rh/alertas')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setAlertasResumo(d.resumo))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const lojaParam = lojaSelecionada ? `?lojaId=${lojaSelecionada.id}` : '';
    fetch(`/api/rh/ocorrencias/resumo${lojaParam}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setOcorrenciasMes(d.totalMes))
      .catch(() => {});
  }, [lojaSelecionada]);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const kpis = [
    { label: 'Funcionários', value: String(stats?.total ?? 0) },
    { label: 'Custo mensal', value: fmt(stats?.custoMensal ?? 0) },
    { label: 'Escala 6x1', value: String(stats?.escala6x1 ?? 0) },
    { label: 'Escala 5x2', value: String(stats?.escala5x2 ?? 0) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description={
          lojaSelecionada
            ? `Gestão de pessoas · ${lojaSelecionada.nome}`
            : 'Gestão de pessoas · Todas as lojas'
        }
        actions={
          !lojaLoading ? (
            <RhLojaCombobox
              lojas={lojas}
              lojaSelecionada={lojaSelecionada}
              onSelect={setLojaSelecionada}
            />
          ) : (
            <Skeleton className="h-8 w-40" />
          )
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={kpiCellClass(i)}>
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-9 w-28" />
                </div>
              ))
            : kpis.map((kpi, i) => (
                <div key={kpi.label} className={kpiCellClass(i)}>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                    {kpi.value}
                  </p>
                </div>
              ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 md:p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground">Alertas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {alertasResumo
                  ? `${alertasResumo.totalExperienciaMes} experiências · ${alertasResumo.totalFeriasVencidas} férias vencidas`
                  : 'Experiências, férias e vencimentos'}
              </p>
            </div>
            <Link
              href="/rh/alertas"
              className="text-sm text-muted-foreground hover:text-foreground shrink-0"
            >
              Ver alertas
            </Link>
          </div>
          {alertasResumo && alertasResumo.totalCriticos > 0 ? (
            <p className="text-sm text-destructive tabular-nums">
              {alertasResumo.totalCriticos} crítico
              {alertasResumo.totalCriticos !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-sm text-foreground">Nenhum alerta crítico</p>
          )}
          {ocorrenciasMes !== null && (
            <p className="text-xs text-muted-foreground">
              {ocorrenciasMes} ocorrência{ocorrenciasMes !== 1 ? 's' : ''} este mês
            </p>
          )}
        </Card>

        <Card className="p-4 md:p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Aniversários</h2>
            <p className="text-sm text-muted-foreground mt-1">Mês atual e próximo</p>
          </div>
          {!aniversarios ? (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          ) : aniversarios.mesMes.count === 0 && aniversarios.mesProximo.count === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum aniversário próximo</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([aniversarios.mesMes, aniversarios.mesProximo] as const).map((bloco) => (
                <div key={bloco.label}>
                  <p className="text-xs text-muted-foreground mb-2">
                    {bloco.label}
                    {bloco.count > 0 ? (
                      <span className="ml-1.5 tabular-nums text-foreground">{bloco.count}</span>
                    ) : null}
                  </p>
                  {bloco.count === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum</p>
                  ) : (
                    <ul className="space-y-2">
                      {bloco.funcionarios.map((f) => (
                        <li key={f.id}>
                          <Link
                            href={`/rh/funcionarios/${f.id}`}
                            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
                          >
                            <span className="text-sm font-medium tabular-nums text-foreground w-6 shrink-0">
                              {f.diaMes.toString().padStart(2, '0')}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm text-foreground truncate">
                                {f.nome.split(' ')[0]} {f.nome.split(' ').slice(-1)[0]}
                              </span>
                              {f.lojaNome ? (
                                <span className="block text-xs text-muted-foreground truncate">
                                  {f.lojaNome}
                                </span>
                              ) : null}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
