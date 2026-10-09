'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Download, Lock, RefreshCw, Unlock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CMV_STORE_LABELS } from '@/lib/nfe/ui-labels';
import { cn } from '@/lib/utils';

type Linha = {
  estoqueInsumoId: string;
  nome: string;
  secao: string;
  unidade: string;
  estoqueInicial: number;
  comprasQtd: number;
  comprasValor: number;
  transfEnviadaQtd: number;
  transfEnviadaValor: number;
  transfRecebidaQtd: number;
  transfRecebidaValor: number;
  desperdicioQtd: number;
  estoqueFinal: number;
  consumoQtd: number;
  consumoValor: number;
  comprasPorSemana: Record<string, { qtd: number; valor: number }>;
};

type Ajuste = {
  id: string;
  secao: string;
  descricao: string;
  valor: number;
  criadoEm: string;
};

const SECAO_LABEL: Record<string, string> = {
  MATERIA_PRIMA: 'Matéria-prima',
  EMBALAGEM: 'Embalagem',
  BEBIDA: 'Bebida',
  GERAL: 'Geral',
};

const REFEICAO_CAT_LABEL: Record<string, string> = {
  BOYS: 'Boys',
  LOJA: 'Loja',
  CENTRAL: 'Central',
  SEGURANCA: 'Segurança',
  SOCIO: 'Sócio',
  OUTROS: 'Outros',
};

const COL_TOOLTIPS: Record<string, string> = {
  Ini: 'Estoque inicial',
  Compras: 'Compras no mês',
  S1: 'Semana 1 (dias 1–7)',
  S2: 'Semana 2 (dias 8–14)',
  S3: 'Semana 3 (dias 15–21)',
  S4: 'Semana 4 (dias 22–28)',
  S5: 'Semana 5 (dias 29–fim)',
  'Transf. env.': 'Transferências enviadas',
  'Transf. rec.': 'Transferências recebidas',
  'Desp.': 'Desperdício',
  Final: 'Estoque final',
  Consumo: 'Consumo (quantidade)',
  'R$': 'Consumo (valor)',
};

function fmt(n: number, d = 2) {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function cellNum(
  n: number,
  opts?: { decimals?: number; tone?: 'destructive' | 'success' | 'foreground' }
) {
  const d = opts?.decimals ?? 1;
  const zero = n === 0 || Object.is(n, -0);
  if (zero) {
    return (
      <span className="tabular-nums text-muted-foreground">–</span>
    );
  }
  const tone = opts?.tone ?? 'foreground';
  return (
    <span
      className={cn(
        'tabular-nums',
        tone === 'destructive' && 'text-destructive',
        tone === 'success' && 'text-success',
        tone === 'foreground' && 'text-foreground'
      )}
    >
      {fmt(n, d)}
    </span>
  );
}

function HeadTip({ label }: { label: string }) {
  const tip = COL_TOOLTIPS[label];
  if (!tip) return <>{label}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">{tip}</TooltipContent>
    </Tooltip>
  );
}

export default function CmvRealFechamentoPage() {
  const now = new Date();
  const [storeSlug, setStoreSlug] = useState('ahu');
  const [competencia, setCompetencia] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [ajustes, setAjustes] = useState<Ajuste[]>([]);
  const [pendencias, setPendencias] = useState<string[]>([]);
  const [status, setStatus] = useState('ABERTO');
  const [vendaMes, setVendaMes] = useState('');
  const [vendaMesOrigem, setVendaMesOrigem] = useState<string | null>(null);
  const [vendaMesSaipos, setVendaMesSaipos] = useState<number | null>(null);
  const [syncingRefeicoes, setSyncingRefeicoes] = useState(false);
  const [refeicoes, setRefeicoes] = useState<
    Array<{
      id: string;
      data: string;
      categoria: string;
      consumidor: string | null;
      valorItens: number;
      ignorada: boolean;
      origem: string;
    }>
  >([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [totais, setTotais] = useState<{
    consumoValor: number;
    consumoMp?: number;
    ajustesValor: number;
    vendaMes: number | null;
    pctCmvMpBruto?: number | null;
    custoRefeicoes?: number;
    consumoMpLiquido?: number | null;
    refeicoesPorCategoria?: Array<{
      categoria: string;
      quantidade: number;
      valorItens: number;
      custo: number;
    }>;
  } | null>(null);
  const [canFechar, setCanFechar] = useState(false);
  const [canReabrir, setCanReabrir] = useState(false);
  const [lojaTravada, setLojaTravada] = useState(false);
  const [allowed, setAllowed] = useState<string[]>([]);
  const [adjSecao, setAdjSecao] = useState('MATERIA_PRIMA');
  const [adjDesc, setAdjDesc] = useState('');
  const [adjValor, setAdjValor] = useState('');
  const [contagens, setContagens] = useState<
    Array<{
      id: string;
      lojaNome: string | null;
      storeSlug: string | null;
      lojaNaoIdentificada: boolean;
      itensCount: number;
      updatedAt: string;
    }>
  >([]);
  const [contagemEscolhida, setContagemEscolhida] = useState('');
  const [storeOverrideContagem, setStoreOverrideContagem] = useState('');

  const lojasOpts = allowed.length > 0 ? allowed : Object.keys(CMV_STORE_LABELS);

  const load = useCallback(async () => {
    setLoading(true);
    setMsg(null);
    try {
      const [res, resC] = await Promise.all([
        fetch(
          `/api/cmv-real/fechamento?storeSlug=${storeSlug}&competencia=${competencia}`,
          { cache: 'no-store' }
        ),
        fetch('/api/cmv-real/contagens', { cache: 'no-store' }),
      ]);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro');
      setLinhas(data.linhas || []);
      setAjustes(data.fechamento?.ajustes || []);
      setPendencias(data.pendencias || []);
      setStatus(data.fechamento?.status || 'ABERTO');
      setVendaMes(
        data.fechamento?.vendaMes != null ? String(data.fechamento.vendaMes) : ''
      );
      setVendaMesOrigem(data.fechamento?.vendaMesOrigem ?? null);
      setRefeicoes(data.refeicoesSaipos || []);
      setTotais(data.totais);
      setCanFechar(data.canFechar === true);
      setCanReabrir(data.canReabrir === true);
      setLojaTravada(data.lojaTravada === true);
      setAllowed(data.allowedStoreSlugs || []);
      if (resC.ok) {
        const dc = await resC.json();
        setContagens(dc.contagens || []);
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    } finally {
      setLoading(false);
    }
  }, [storeSlug, competencia]);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (body: Record<string, unknown>) => {
    const res = await fetch('/api/cmv-real/fechamento', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeSlug, competencia, ...body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha');
    return data;
  };

  const salvarVenda = async () => {
    try {
      await patch({
        action: 'set_venda',
        vendaMes:
          vendaMes === '' ? null : Number(String(vendaMes).replace(',', '.')),
      });
      setMsg('Venda/mês salva');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const syncRefeicoes = async () => {
    setSyncingRefeicoes(true);
    setMsg(null);
    try {
      const res = await fetch(
        `/api/cmv-real/refeicoes/sync?loja=${storeSlug}&competencia=${competencia}`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no sync');
      setVendaMesSaipos(
        typeof data.vendaMesSaipos === 'number' ? data.vendaMesSaipos : null
      );
      setMsg(
        `Refeições: ${data.upserted} upsert(s). Venda Saipos calculada: ${fmtMoney(data.vendaMesSaipos ?? 0)}`
      );
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro no sync');
    } finally {
      setSyncingRefeicoes(false);
    }
  };

  const usarVendaSaipos = async () => {
    if (vendaMesSaipos == null) return;
    const ok = window.confirm(
      `Substituir a venda do mês pelo valor da Saipos (${fmtMoney(vendaMesSaipos)})?`
    );
    if (!ok) return;
    try {
      await patch({ action: 'usar_venda_saipos', vendaMesSaipos });
      setMsg('Venda do mês atualizada com o valor da Saipos');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const setRefeicaoIgnorada = async (id: string, ignorada: boolean) => {
    try {
      const res = await fetch('/api/cmv-real/refeicoes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_ignorada',
          storeSlug,
          competencia,
          id,
          ignorada,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const addAjuste = async () => {
    try {
      await patch({
        action: 'add_ajuste',
        secao: adjSecao,
        descricao: adjDesc,
        valor: Number(String(adjValor).replace(',', '.')),
      });
      setAdjDesc('');
      setAdjValor('');
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const aplicarContagem = async () => {
    if (!contagemEscolhida) return;
    const c = contagens.find((x) => x.id === contagemEscolhida);
    const slug = c?.lojaNaoIdentificada
      ? storeOverrideContagem
      : c?.storeSlug || storeSlug;
    if (!slug) {
      setMsg('Escolha a loja da contagem não identificada');
      return;
    }
    try {
      const res = await fetch('/api/cmv-real/contagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contagemId: contagemEscolhida,
          storeSlug: slug,
          competencia,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha');
      setMsg(`Contagem aplicada: ${data.gravados} itens`);
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro');
    }
  };

  const porSecao = useMemo(() => {
    const m = new Map<string, Linha[]>();
    for (const l of linhas) {
      const arr = m.get(l.secao) || [];
      arr.push(l);
      m.set(l.secao, arr);
    }
    return m;
  }, [linhas]);

  const aberto = status === 'ABERTO';

  const kpiVenda =
    totais?.vendaMes != null
      ? totais.vendaMes
      : vendaMes !== ''
        ? Number(String(vendaMes).replace(',', '.'))
        : null;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={storeSlug}
              disabled={lojaTravada && lojasOpts.length <= 1}
              onValueChange={setStoreSlug}
            >
              <SelectTrigger className="h-8 w-[140px] text-sm">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent>
                {lojasOpts.map((s) => (
                  <SelectItem key={s} value={s}>
                    {CMV_STORE_LABELS[s] || s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="month"
              value={competencia}
              onChange={(e) => setCompetencia(e.target.value)}
              className="h-8 w-[150px] text-sm"
            />
            <Badge
              variant="secondary"
              className={cn(
                'border-transparent font-normal',
                aberto
                  ? 'bg-warning/15 text-warning'
                  : 'bg-success/15 text-success'
              )}
            >
              {aberto ? 'Aberto' : 'Fechado'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={`/api/cmv-real/fechamento?storeSlug=${storeSlug}&competencia=${competencia}&export=xlsx`}
              >
                <Download className="size-4" />
                Exportar XLSX
              </a>
            </Button>
            {canFechar && aberto && (
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  void patch({ action: 'fechar' })
                    .then(load)
                    .catch((e) => setMsg(e.message))
                }
              >
                <Lock className="size-4" />
                Fechar mês
              </Button>
            )}
            {canReabrir && !aberto && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  void patch({ action: 'reabrir' })
                    .then(load)
                    .catch((e) => setMsg(e.message))
                }
              >
                <Unlock className="size-4" />
                Reabrir
              </Button>
            )}
          </div>
        </div>

        {pendencias.length > 0 && (
          <Alert variant="warning" className="py-3 px-4">
            <AlertTitle className="text-sm text-warning">
              Pendências (não bloqueiam)
            </AlertTitle>
            <AlertDescription className="text-xs space-y-0.5 mt-1">
              {pendencias.map((p, i) => (
                <p key={i}>• {p}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {msg ? (
          <p className="text-sm text-warning" role="alert">
            {msg}
          </p>
        ) : null}

        {/* KPIs — só valores já presentes */}
        {totais && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: 'Venda',
                    value:
                      kpiVenda != null && !Number.isNaN(kpiVenda)
                        ? fmtMoney(kpiVenda)
                        : '–',
                  },
                  {
                    label: 'Consumo MP',
                    value: fmtMoney(totais.consumoMp ?? totais.consumoValor),
                  },
                  {
                    label: '% CMV MP bruto',
                    value:
                      totais.pctCmvMpBruto != null
                        ? `${(totais.pctCmvMpBruto * 100).toFixed(1)}%`
                        : '–',
                  },
                  {
                    label: 'Consumo MP líquido',
                    value:
                      totais.consumoMpLiquido != null
                        ? fmtMoney(totais.consumoMpLiquido)
                        : '–',
                  },
                ].map((k, i) => (
                  <div
                    key={k.label}
                    className={cn(
                      'px-4 py-4',
                      (i === 0 || i === 2) && 'border-r border-border',
                      (i === 0 || i === 1) && 'border-b border-border xl:border-b-0',
                      i < 3 && 'xl:border-r'
                    )}
                  >
                    <p className="text-sm text-muted-foreground">{k.label}</p>
                    <p className="text-3xl font-semibold tabular-nums text-foreground mt-1">
                      {k.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Forms */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-4 space-y-3">
            <div>
              <p className="text-base font-semibold text-foreground">
                Venda do mês
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manual e Saipos lado a lado — a Saipos só entra com confirmação.
                {vendaMesOrigem ? ` Origem atual: ${vendaMesOrigem}.` : ''}
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Valor manual (R$)</label>
              <div className="flex gap-2">
                <Input
                  value={vendaMes}
                  disabled={!aberto || !canFechar}
                  onChange={(e) => setVendaMes(e.target.value)}
                  placeholder="0,00"
                  className="h-9 flex-1"
                />
                {canFechar && aberto && (
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 shrink-0"
                    onClick={() => void salvarVenda()}
                  >
                    Salvar
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <p className="text-sm text-muted-foreground">
                Saipos:{' '}
                <span className="tabular-nums text-foreground font-medium">
                  {vendaMesSaipos != null ? fmtMoney(vendaMesSaipos) : '— (sincronize)'}
                </span>
              </p>
              {canFechar && aberto && vendaMesSaipos != null && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => void usarVendaSaipos()}
                >
                  Usar valor da Saipos
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-4 space-y-3">
            <div>
              <p className="text-base font-semibold text-foreground">
                Ajustes manuais
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Começam vazios a cada mês — nunca são copiados do anterior.
              </p>
            </div>
            {ajustes.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum ajuste</p>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-8">Seção</TableHead>
                      <TableHead className="h-8">Descrição</TableHead>
                      <TableHead className="h-8 text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ajustes.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="py-1.5 text-xs text-muted-foreground">
                          {SECAO_LABEL[a.secao] || a.secao}
                        </TableCell>
                        <TableCell className="py-1.5 text-xs text-foreground">
                          {a.descricao}
                        </TableCell>
                        <TableCell className="py-1.5 text-xs text-right tabular-nums text-foreground">
                          {fmtMoney(a.valor)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {canFechar && aberto && (
              <div className="space-y-2 pt-1">
                <Select value={adjSecao} onValueChange={setAdjSecao}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MATERIA_PRIMA">Matéria-prima</SelectItem>
                    <SelectItem value="EMBALAGEM">Embalagem</SelectItem>
                    <SelectItem value="BEBIDA">Bebida</SelectItem>
                    <SelectItem value="GERAL">Geral</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Descrição"
                  value={adjDesc}
                  onChange={(e) => setAdjDesc(e.target.value)}
                  className="h-9"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Valor"
                    value={adjValor}
                    onChange={(e) => setAdjValor(e.target.value)}
                    className="h-9 flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="h-9 shrink-0"
                    onClick={() => void addAjuste()}
                  >
                    Adicionar ajuste
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Refeições internas (Saipos) */}
        <div className="rounded-md border border-border bg-card p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-foreground">
                Refeições internas
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Jantas / sócio da API de Dados Saipos. Custo = valor dos itens × %CMV MP bruto.
                {totais?.custoRefeicoes != null
                  ? ` Custo total: ${fmtMoney(totais.custoRefeicoes)}.`
                  : ''}
              </p>
            </div>
            {canFechar && aberto && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 shrink-0"
                disabled={syncingRefeicoes}
                onClick={() => void syncRefeicoes()}
              >
                <RefreshCw
                  className={cn('size-4', syncingRefeicoes && 'animate-spin')}
                />
                {syncingRefeicoes ? 'Sincronizando…' : 'Sincronizar Saipos'}
              </Button>
            )}
          </div>

          {(totais?.refeicoesPorCategoria?.length ?? 0) === 0 &&
          refeicoes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhuma refeição nesta competência
              <span className="block text-xs mt-1">
                Sincronize a Saipos para importar jantas e sócio.
              </span>
            </p>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-8 w-8" />
                    <TableHead className="h-8">Categoria</TableHead>
                    <TableHead className="h-8 text-right">Qtd</TableHead>
                    <TableHead className="h-8 text-right">Valor itens</TableHead>
                    <TableHead className="h-8 text-right">Custo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(totais?.refeicoesPorCategoria || []).map((cat) => {
                    const open = expandedCat === cat.categoria;
                    const detalhes = refeicoes.filter(
                      (r) => r.categoria === cat.categoria
                    );
                    return (
                      <Fragment key={cat.categoria}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            setExpandedCat(open ? null : cat.categoria)
                          }
                        >
                          <TableCell className="py-1.5 w-8">
                            {open ? (
                              <ChevronDown className="size-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-3.5 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell className="py-1.5 text-sm text-foreground">
                            {REFEICAO_CAT_LABEL[cat.categoria] || cat.categoria}
                          </TableCell>
                          <TableCell className="py-1.5 text-sm text-right tabular-nums text-foreground">
                            {cat.quantidade}
                          </TableCell>
                          <TableCell className="py-1.5 text-sm text-right tabular-nums text-foreground">
                            {fmtMoney(cat.valorItens)}
                          </TableCell>
                          <TableCell className="py-1.5 text-sm text-right tabular-nums text-foreground">
                            {fmtMoney(cat.custo)}
                          </TableCell>
                        </TableRow>
                        {open &&
                          detalhes.map((r) => (
                            <TableRow
                              key={r.id}
                              className={cn(
                                'bg-muted/30',
                                r.ignorada && 'opacity-50'
                              )}
                            >
                              <TableCell className="py-1" />
                              <TableCell className="py-1 text-xs text-muted-foreground" colSpan={2}>
                                {r.data}
                                {r.consumidor ? ` · ${r.consumidor}` : ''}
                                {r.origem === 'MANUAL' ? ' · manual' : ''}
                                {r.ignorada ? ' · ignorada' : ''}
                              </TableCell>
                              <TableCell className="py-1 text-xs text-right tabular-nums text-foreground">
                                {fmtMoney(r.valorItens)}
                              </TableCell>
                              <TableCell className="py-1 text-right">
                                {canFechar && aberto && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      void setRefeicaoIgnorada(r.id, !r.ignorada);
                                    }}
                                  >
                                    {r.ignorada ? 'Restaurar' : 'Ignorar'}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {canFechar && aberto && (
          <div className="rounded-md border border-border bg-card p-4 space-y-3">
            <div>
              <p className="text-base font-semibold text-foreground">
                Estoque final
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Aplique uma contagem concluída como estoque final do mês.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Contagem</label>
              <Select
                value={contagemEscolhida || undefined}
                onValueChange={setContagemEscolhida}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Selecionar contagem concluída…" />
                </SelectTrigger>
                <SelectContent>
                  {contagens.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.lojaNaoIdentificada
                        ? `${c.lojaNome || 'sem nome'} (loja não identificada)`
                        : `${CMV_STORE_LABELS[c.storeSlug || ''] || c.storeSlug} — ${c.lojaNome}`}{' '}
                      · {c.itensCount} itens ·{' '}
                      {new Date(c.updatedAt).toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {contagens.find((c) => c.id === contagemEscolhida)
              ?.lojaNaoIdentificada && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Associar à loja
                </label>
                <Select
                  value={storeOverrideContagem || undefined}
                  onValueChange={setStoreOverrideContagem}
                >
                  <SelectTrigger className="h-9 text-sm border-warning/40">
                    <SelectValue placeholder="Associar à loja…" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CMV_STORE_LABELS).map(([s, lab]) => (
                      <SelectItem key={s} value={s}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button
              type="button"
              size="sm"
              disabled={!contagemEscolhida}
              onClick={() => void aplicarContagem()}
            >
              Aplicar estoque final
            </Button>
          </div>
        )}

        {loading ? (
          <div className="rounded-md border border-border overflow-hidden space-y-0">
            <Skeleton className="h-10 w-full rounded-none" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-none border-t border-border" />
            ))}
          </div>
        ) : (
          <div className="overflow-auto max-h-[70vh] rounded-md border border-border">
            <table className="text-xs min-w-[1100px] w-full border-collapse">
              <thead>
                <tr className="bg-card text-muted-foreground border-b border-border">
                  <th className="sticky top-0 left-0 z-30 bg-card text-left px-2 py-2 min-w-[160px] border-r border-border">
                    Produto
                  </th>
                  {(
                    [
                      'Ini',
                      'Compras',
                      'S1',
                      'S2',
                      'S3',
                      'S4',
                      'S5',
                      'Transf. env.',
                      'Transf. rec.',
                      'Desp.',
                      'Final',
                      'Consumo',
                      'R$',
                    ] as const
                  ).map((h) => (
                    <th
                      key={h}
                      className="sticky top-0 z-20 bg-card px-2 py-2 text-right whitespace-nowrap"
                    >
                      <HeadTip label={h} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...porSecao.entries()].map(([secao, items]) => (
                  <Fragment key={secao}>
                    <tr className="bg-muted">
                      <td
                        colSpan={14}
                        className="sticky left-0 z-10 bg-muted px-2 py-1.5 text-xs font-semibold text-foreground"
                      >
                        {SECAO_LABEL[secao] || secao}
                      </td>
                    </tr>
                    {items.map((l) => (
                      <tr
                        key={l.estoqueInsumoId}
                        className="border-t border-border hover:bg-muted/50"
                      >
                        <td className="sticky left-0 z-10 bg-background px-2 py-1.5 text-foreground border-r border-border max-w-[180px] truncate">
                          {l.nome}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.estoqueInicial)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.comprasQtd)}
                        </td>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <td key={s} className="px-2 py-1.5 text-right">
                            {cellNum(l.comprasPorSemana[String(s)]?.qtd ?? 0)}
                          </td>
                        ))}
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.transfEnviadaQtd, {
                            tone: 'destructive',
                          })}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.transfRecebidaQtd, { tone: 'success' })}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.desperdicioQtd)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.estoqueFinal)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.consumoQtd)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {cellNum(l.consumoValor, { decimals: 2 })}
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
