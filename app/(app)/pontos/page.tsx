'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useLoja } from '@/contexts/LojaContext';
import { DataTable } from '@/components/layout/DataTable';
import { ModuleTabs, moduleTabClass } from '@/components/layout/ModuleTabs';
import { PageHeader } from '@/components/layout/PageHeader';
import { RhLojaCombobox } from '@/components/rh/RhLojaCombobox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { labelPeriodoFechamentoPonto } from '@/lib/ponto-periodo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  RefreshCw,
  MoreHorizontal,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegistroPonto {
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
  funcionario: {
    id: string;
    nome: string;
    lojaId: string | null;
    loja: { id: string; nome: string } | null;
  };
}

interface PendenciaResumo {
  numeroFolhaOrigem: string;
  count: number;
  nomeSugerido: string | null;
  datas?: string[];
}

interface FechamentoLinha {
  id: string;
  funcionarioId: string;
  funcionario: { id: string; nome: string; loja: { nome: string } | null };
  ex60: string | null;
  ex100: string | null;
  en60: string | null;
  en100: string | null;
  atraso: string | null;
  faltas: string | null;
  faltaDsr: string | null;
  valeTransporte: string | null;
  descDiversos: string | null;
  descRefeicao: string | null;
  descCompras: string | null;
  status: string; // pendente | aprovado | rejeitado
  observacao: string | null;
  origemErro: string | null;
}

interface FechamentoMensal {
  id: string;
  mes: number;
  ano: number;
  status: string;
  linhas: FechamentoLinha[];
  funcionariosSemPis?: Array<{ id: string; nome: string }>;
}

type Aba = 'registros' | 'pendencias' | 'relatorio';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STALE_SYNC_MS = 60 * 60 * 1000;

const PUNCH_COLUMNS = [
  { key: 'entrada1', short: 'E1', full: 'Entrada 1' },
  { key: 'saida1', short: 'S1', full: 'Saída 1' },
  { key: 'entrada2', short: 'E2', full: 'Entrada 2' },
  { key: 'saida2', short: 'S2', full: 'Saída 2' },
  { key: 'entrada3', short: 'E3', full: 'Entrada 3' },
  { key: 'saida3', short: 'S3', full: 'Saída 3' },
] as const;

function shiftIsoDate(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function Horario({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">–</span>;
  return <span className="tabular-nums text-foreground">{value}</span>;
}

function PunchHeader({ short, full }: { short: string; full: string }) {
  return (
    <>
      <span className="hidden lg:inline">{full}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="lg:hidden cursor-default">{short}</span>
        </TooltipTrigger>
        <TooltipContent>{full}</TooltipContent>
      </Tooltip>
    </>
  );
}

function StatusRegistro({ registro }: { registro: RegistroPonto }) {
  const flags = [
    registro.folga ? 'Folga' : null,
    registro.compensado ? 'Compensado' : null,
    registro.neutro ? 'Neutro' : null,
  ].filter((label): label is string => Boolean(label));

  if (flags.length === 0) return <span className="text-muted-foreground">–</span>;

  return (
    <div className="flex flex-wrap gap-1">
      {flags.map((label) => (
        <Badge key={label} variant="outline" className="font-normal text-muted-foreground">
          {label}
        </Badge>
      ))}
    </div>
  );
}

function SyncStatus({
  ultimaSincronizacao,
  dataSelecionada,
  hoje,
}: {
  ultimaSincronizacao: string | null;
  dataSelecionada: string;
  hoje: string;
}) {
  if (!ultimaSincronizacao) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-warning">
        <span className="size-2 shrink-0 rounded-full bg-warning" />
        Nenhuma batida recebida hoje
      </span>
    );
  }

  const at = new Date(ultimaSincronizacao);
  const hhmm = at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const stale = dataSelecionada === hoje && Date.now() - at.getTime() > STALE_SYNC_MS;

  if (stale) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1.5 text-xs text-warning cursor-default">
            <span className="size-2 shrink-0 rounded-full bg-warning" />
            Batidas podem estar atrasadas
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          O Secullum envia as batidas quando o computador do escritório está ligado.
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-2 shrink-0 rounded-full bg-primary" />
      Secullum · última batida recebida às {hhmm}
    </span>
  );
}

function groupRegistros(registros: RegistroPonto[]) {
  const map = new Map<string, { id: string; nome: string; rows: RegistroPonto[] }>();
  for (const registro of registros) {
    const id = registro.funcionario.loja?.id ?? 'sem-loja';
    const nome = registro.funcionario.loja?.nome ?? 'Sem loja';
    const group = map.get(id);
    if (group) group.rows.push(registro);
    else map.set(id, { id, nome, rows: [registro] });
  }
  return [...map.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function registroColumns(showLoja: boolean): ColumnDef<RegistroPonto, unknown>[] {
  const punches: ColumnDef<RegistroPonto, unknown>[] = PUNCH_COLUMNS.map((col) => ({
    id: col.key,
    accessorFn: (row) => row[col.key] ?? '',
    header: () => <PunchHeader short={col.short} full={col.full} />,
    cell: ({ row }) => <Horario value={row.original[col.key]} />,
    meta: { headerClassName: 'whitespace-nowrap', cellClassName: 'whitespace-nowrap' },
  }));

  return [
    {
      id: 'funcionario',
      accessorFn: (row) => row.funcionario.nome,
      header: 'Funcionário',
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.funcionario.nome}</span>
      ),
    },
    ...(showLoja
      ? [
          {
            id: 'loja',
            accessorFn: (row: RegistroPonto) => row.funcionario.loja?.nome ?? '',
            header: 'Loja',
            cell: ({ row }: { row: { original: RegistroPonto } }) =>
              row.original.funcionario.loja?.nome ? (
                <span className="text-foreground">{row.original.funcionario.loja.nome}</span>
              ) : (
                <span className="text-muted-foreground">–</span>
              ),
          } satisfies ColumnDef<RegistroPonto, unknown>,
        ]
      : []),
    ...punches,
    {
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => <StatusRegistro registro={row.original} />,
    },
  ];
}

function mesLabel(mes: number, ano: number) {
  return new Date(ano, mes - 1, 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
}

const STATUS_LINHA: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

const STATUS_FECHAMENTO: Record<string, string> = {
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  concluido: 'Concluído',
};

function statusBadgeClass(status: string) {
  if (status === 'aprovado' || status === 'concluido') {
    return 'border-transparent bg-success/15 text-success';
  }
  if (status === 'rejeitado') {
    return 'border-transparent bg-destructive/15 text-destructive';
  }
  return 'border-transparent bg-warning/15 text-warning';
}

const FECHAMENTO_FIELDS: { key: keyof LinhaEditada; header: string; placeholder: string }[] = [
  { key: 'ex60', header: 'Ex 60%', placeholder: '00:00' },
  { key: 'ex100', header: 'Ex 100%', placeholder: '00:00' },
  { key: 'en60', header: 'EN 60%', placeholder: '00:00' },
  { key: 'en100', header: 'EN 100%', placeholder: '00:00' },
  { key: 'atraso', header: 'Atraso', placeholder: '00:00' },
  { key: 'faltas', header: 'Faltas', placeholder: '00:00' },
  { key: 'faltaDsr', header: 'Falta DSR', placeholder: '00:00' },
  { key: 'valeTransporte', header: 'VT (R$)', placeholder: '0,00' },
  { key: 'descDiversos', header: 'Desc. diversos', placeholder: '0,00' },
  { key: 'descRefeicao', header: 'Desc. refeição', placeholder: '0,00' },
  { key: 'descCompras', header: 'Desc. compras', placeholder: '0,00' },
];

// ─── Tabela de Registros (Fase 6) ───────────────────────────────────────────

function formatUtcDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function pendenciaColumns(): ColumnDef<PendenciaResumo, unknown>[] {
  return [
    {
      id: 'folha',
      accessorFn: (row) => row.numeroFolhaOrigem,
      header: 'Folha',
      cell: ({ row }) => (
        <span className="font-medium text-foreground tabular-nums">
          {row.original.numeroFolhaOrigem}
        </span>
      ),
    },
    {
      id: 'nome',
      accessorFn: (row) => row.nomeSugerido ?? '',
      header: 'Nome',
      cell: ({ row }) =>
        row.original.nomeSugerido ? (
          <span className="text-foreground">{row.original.nomeSugerido}</span>
        ) : (
          <span className="text-muted-foreground">–</span>
        ),
    },
    {
      id: 'data',
      header: 'Data',
      enableSorting: false,
      cell: ({ row }) => {
        const datas = row.original.datas ?? [];
        if (datas.length === 0) return <span className="text-muted-foreground">–</span>;
        return (
          <div className="flex max-w-[240px] flex-wrap gap-x-2 gap-y-0.5">
            {datas.map((iso, index) => (
              <span key={`${iso}-${index}`} className="tabular-nums text-foreground">
                {formatUtcDate(iso)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: 'registros',
      accessorFn: (row) => row.count,
      header: 'Registros',
      meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
      cell: ({ row }) => (
        <span className="tabular-nums text-foreground">{row.original.count}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      meta: { headerClassName: 'w-10', cellClassName: 'w-10' },
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Mais opções"
            >
              <MoreHorizontal className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/rh/mapeamento-ponto">Mapear</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

function TabelaPendencias({
  pendencias,
  loading,
}: {
  pendencias: PendenciaResumo[];
  loading: boolean;
}) {
  const columns = useMemo(() => pendenciaColumns(), []);

  return (
    <div className="space-y-4">
      {pendencias.length > 0 && (
        <Alert variant="warning" className="py-3 px-4">
          <AlertDescription className="text-sm text-foreground">
            As matrículas abaixo foram recebidas do Secullum mas não correspondem a nenhum
            funcionário cadastrado. Acesse o mapeamento para vinculá-las.
          </AlertDescription>
        </Alert>
      )}
      <DataTable
        columns={columns}
        data={pendencias}
        loading={loading && pendencias.length === 0}
        pageSize={50}
        emptyState={
          <div>
            <p className="text-sm text-foreground">Nenhuma pendência em aberto</p>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as matrículas recebidas estão vinculadas a funcionários.
            </p>
          </div>
        }
      />
    </div>
  );
}

function TabelaRegistros({
  registros,
  showLoja,
  loading,
}: {
  registros: RegistroPonto[];
  showLoja: boolean;
  loading: boolean;
}) {
  const columns = useMemo(() => registroColumns(showLoja), [showLoja]);
  const ordered = useMemo(() => {
    const groups = groupRegistros(registros);
    return groups.flatMap((g) => g.rows);
  }, [registros]);

  const groupBy = useMemo(
    () => ({
      getGroupKey: (row: RegistroPonto) =>
        row.funcionario.loja?.id ?? 'sem-loja',
      renderGroupHeader: ({
        rows,
      }: {
        groupKey: string;
        rows: RegistroPonto[];
      }) => {
        const nome = rows[0]?.funcionario.loja?.nome ?? 'Sem loja';
        const n = rows.length;
        return (
          <span>
            {nome}
            <span className="ml-2 font-normal text-muted-foreground tabular-nums">
              {n} funcionário{n !== 1 ? 's' : ''}
            </span>
          </span>
        );
      },
    }),
    []
  );

  if (loading) {
    return <DataTable columns={columns} data={[]} loading />;
  }

  return (
    <DataTable
      columns={columns}
      data={ordered}
      pageSize={200}
      groupBy={groupBy}
      emptyState={
        <div>
          <p className="text-sm text-foreground">Nenhum registro de ponto</p>
          <p className="text-xs text-muted-foreground mt-1">
            Nenhum dado recebido do Secullum para esta seleção.
          </p>
        </div>
      }
    />
  );
}

// ─── Linha editável do Fechamento (Fase 9) ───────────────────────────────────

interface LinhaEditada {
  ex60: string;
  ex100: string;
  en60: string;
  en100: string;
  atraso: string;
  faltas: string;
  faltaDsr: string;
  valeTransporte: string;
  descDiversos: string;
  descRefeicao: string;
  descCompras: string;
}

function initEdits(linha: FechamentoLinha): LinhaEditada {
  return {
    ex60: linha.ex60 ?? '',
    ex100: linha.ex100 ?? '',
    en60: linha.en60 ?? '',
    en100: linha.en100 ?? '',
    atraso: linha.atraso ?? '',
    faltas: linha.faltas ?? '',
    faltaDsr: linha.faltaDsr ?? '',
    valeTransporte: linha.valeTransporte ?? '',
    descDiversos: linha.descDiversos ?? '',
    descRefeicao: linha.descRefeicao ?? '',
    descCompras: linha.descCompras ?? '',
  };
}

function FechamentoLinhaRow({
  linha,
  fechamentoId,
  onUpdated,
}: {
  linha: FechamentoLinha;
  fechamentoId: string;
  onUpdated: (updated: FechamentoLinha) => void;
}) {
  const [edits, setEdits] = useState<LinhaEditada>(() => initEdits(linha));
  const [saving, setSaving] = useState(false);
  const [rejeitandoObs, setRejeitandoObs] = useState(false);
  const [obsText, setObsText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setField = (field: keyof LinhaEditada, value: string) => {
    const next = { ...edits, [field]: value };
    setEdits(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => patchLinha(next, undefined), 800);
  };

  const patchLinha = async (data: Partial<LinhaEditada>, statusOverride?: string, obs?: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pontos/fechamento/${fechamentoId}/linhas/${linha.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          ...(statusOverride !== undefined ? { status: statusOverride } : {}),
          ...(obs !== undefined ? { observacao: obs } : {}),
        }),
      });
      if (res.ok) {
        const updated: FechamentoLinha = await res.json();
        onUpdated(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAprovar = () => patchLinha(edits, 'aprovado');
  const handleRejeitar = () => {
    if (!obsText.trim()) return;
    patchLinha(edits, 'rejeitado', obsText.trim());
    setRejeitandoObs(false);
    setObsText('');
  };

  const fieldInput = (field: keyof LinhaEditada, placeholder = '') => (
    <Input
      className="h-8 w-[4.75rem] px-2 text-xs tabular-nums"
      value={edits[field]}
      placeholder={placeholder}
      onChange={(e) => setField(field, e.target.value)}
    />
  );

  return (
    <>
      <TableRow className={linha.origemErro ? 'bg-destructive/5' : undefined}>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{linha.funcionario.nome}</span>
            {linha.funcionario.loja && (
              <span className="text-xs text-muted-foreground">{linha.funcionario.loja.nome}</span>
            )}
            {linha.origemErro && (
              <span className="text-xs text-destructive truncate max-w-[180px]" title={linha.origemErro}>
                {linha.origemErro}
              </span>
            )}
          </div>
        </TableCell>
        {FECHAMENTO_FIELDS.map((field) => (
          <TableCell key={field.key}>{fieldInput(field.key, field.placeholder)}</TableCell>
        ))}
        <TableCell>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn('font-normal', statusBadgeClass(linha.status))}>
              {STATUS_LINHA[linha.status] ?? linha.status}
            </Badge>
            {saving && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
          </div>
          {linha.observacao && (
            <p className="text-xs text-muted-foreground mt-1 max-w-[140px] truncate" title={linha.observacao}>
              {linha.observacao}
            </p>
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Mais opções"
                disabled={saving}
              >
                <MoreHorizontal className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={linha.status === 'aprovado' || saving}
                onSelect={handleAprovar}
              >
                Aprovar
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={linha.status === 'rejeitado' || saving}
                className="text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  setRejeitandoObs(true);
                }}
              >
                Rejeitar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
      <Dialog open={rejeitandoObs} onOpenChange={setRejeitandoObs}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar lançamento</DialogTitle>
            <DialogDescription>Motivo da rejeição (obrigatório).</DialogDescription>
          </DialogHeader>
          <Input
            value={obsText}
            onChange={(e) => setObsText(e.target.value)}
            placeholder="Ex.: PIS inválido, erro no cálculo..."
            autoFocus
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejeitandoObs(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRejeitar}
              disabled={!obsText.trim()}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Tabela do Relatório com drag-to-scroll horizontal ───────────────────────

function TabelaRelatorioScroll({
  linhas,
  fechamentoId,
  onLinhaUpdated,
}: {
  linhas: FechamentoLinha[];
  fechamentoId: string;
  onLinhaUpdated: (updated: FechamentoLinha) => void;
}) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Funcionário</TableHead>
            {FECHAMENTO_FIELDS.map((field) => (
              <TableHead key={field.key} className="whitespace-nowrap">
                {field.header}
              </TableHead>
            ))}
            <TableHead>Status</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {linhas.map((linha) => (
            <FechamentoLinhaRow
              key={linha.id}
              linha={linha}
              fechamentoId={fechamentoId}
              onUpdated={onLinhaUpdated}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Aba Relatório (Fase 9) ──────────────────────────────────────────────────

function AbaRelatorio() {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const [mes, setMes] = useState(mesAtual);
  const [ano, setAno] = useState(anoAtual);
  const [gerando, setGerando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [fechamento, setFechamento] = useState<FechamentoMensal | null>(null);
  const [loadingFechamento, setLoadingFechamento] = useState(false);
  const [erroGerar, setErroGerar] = useState<string | null>(null);

  const fetchFechamento = useCallback(async (m: number, a: number) => {
    setLoadingFechamento(true);
    setErroGerar(null);
    try {
      const res = await fetch(`/api/pontos/fechamento?mes=${m}&ano=${a}`);
      if (res.ok) {
        const data = await res.json();
        setFechamento(data.fechamento ?? null);
      } else {
        setFechamento(null);
      }
    } finally {
      setLoadingFechamento(false);
    }
  }, []);

  useEffect(() => {
    fetchFechamento(mes, ano);
  }, [mes, ano, fetchFechamento]);

  const handleGerar = async () => {
    setGerando(true);
    setErroGerar(null);
    try {
      const res = await fetch('/api/pontos/fechamento/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mes, ano }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErroGerar(data.error ?? 'Erro ao gerar fechamento.');
        return;
      }
      await fetchFechamento(mes, ano);
    } finally {
      setGerando(false);
    }
  };

  const handleExportar = async () => {
    if (!fechamento) return;
    const pendentes = fechamento.linhas.filter((l) => l.status === 'pendente').length;
    if (pendentes > 0) {
      const ok = window.confirm(
        `${pendentes} de ${fechamento.linhas.length} funcionário(s) ainda não foram revisados.\nDeseja continuar e gerar a planilha mesmo assim?`,
      );
      if (!ok) return;
    }
    setExportando(true);
    try {
      const res = await fetch(`/api/pontos/fechamento/${fechamento.id}/exportar`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error ?? 'Erro ao exportar planilha.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fechamento-${String(mes).padStart(2, '0')}-${ano}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      // Recarrega para atualizar status concluido
      await fetchFechamento(mes, ano);
    } finally {
      setExportando(false);
    }
  };

  const onLinhaUpdated = (updated: FechamentoLinha) => {
    setFechamento((prev) =>
      prev
        ? { ...prev, linhas: prev.linhas.map((l) => (l.id === updated.id ? updated : l)) }
        : prev,
    );
  };

  const semPis = fechamento?.funcionariosSemPis ?? [];

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const anos = Array.from({ length: 4 }, (_, i) => anoAtual - 1 + i);

  const aprovados = fechamento?.linhas.filter((l) => l.status === 'aprovado').length ?? 0;
  const pendentesLinha = fechamento?.linhas.filter((l) => l.status === 'pendente').length ?? 0;
  const rejeitados = fechamento?.linhas.filter((l) => l.status === 'rejeitado').length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(mes)} onValueChange={(value) => setMes(Number(value))}>
            <SelectTrigger className="h-8 w-[140px] text-sm" aria-label="Mês">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map((nome, index) => (
                <SelectItem key={nome} value={String(index + 1)}>
                  {nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(ano)} onValueChange={(value) => setAno(Number(value))}>
            <SelectTrigger className="h-8 w-[96px] text-sm" aria-label="Ano">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anos.map((valor) => (
                <SelectItem key={valor} value={String(valor)}>
                  {valor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fechamento && (
            <Badge
              variant="secondary"
              className={cn('font-normal', statusBadgeClass(fechamento.status))}
            >
              {STATUS_FECHAMENTO[fechamento.status] ?? fechamento.status}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {fechamento && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportar}
              disabled={exportando}
            >
              {exportando ? (
                <Loader2 className="animate-spin text-muted-foreground" />
              ) : (
                <Download className="text-muted-foreground" />
              )}
              Baixar planilha
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleGerar}
            disabled={gerando || loadingFechamento}
          >
            {gerando && <Loader2 className="animate-spin" />}
            {fechamento ? 'Regerar fechamento' : 'Gerar fechamento'}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Período do ponto: {labelPeriodoFechamentoPonto(mes, ano)}
      </p>

      {erroGerar && (
        <Alert variant="destructive" className="py-3 px-4">
          <AlertDescription className="text-sm">{erroGerar}</AlertDescription>
        </Alert>
      )}

      {semPis.length > 0 && (
        <Alert variant="warning" className="py-3 px-4">
          <AlertTitle className="text-sm">
            {semPis.length} funcionário(s) sem PIS do Secullum
          </AlertTitle>
          <AlertDescription className="text-xs text-muted-foreground">
            {semPis.map((f) => f.nome).join(', ')}. Eles aparecerão automaticamente após
            registrarem o primeiro ponto.
          </AlertDescription>
        </Alert>
      )}

      {loadingFechamento && !fechamento && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {!loadingFechamento && !fechamento && !gerando && (
        <div className="py-12">
          <p className="text-sm text-foreground">Nenhum fechamento para {mesLabel(mes, ano)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Período: {labelPeriodoFechamentoPonto(mes, ano)}. Gere o fechamento para consultar o
            Secullum.
          </p>
        </div>
      )}

      {fechamento && fechamento.linhas.length === 0 && (
        <div className="py-12">
          <p className="text-sm text-foreground">Nenhum funcionário neste fechamento</p>
        </div>
      )}

      {fechamento && fechamento.linhas.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-sm font-semibold text-foreground">{mesLabel(mes, ano)}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {fechamento.linhas.length} funcionário(s)
            </span>
            <span className="text-xs text-success tabular-nums">{aprovados} aprovados</span>
            <span className="text-xs text-warning tabular-nums">{pendentesLinha} pendentes</span>
            {rejeitados > 0 && (
              <span className="text-xs text-destructive tabular-nums">{rejeitados} rejeitados</span>
            )}
          </div>
          <TabelaRelatorioScroll
            linhas={fechamento.linhas}
            fechamentoId={fechamento.id}
            onLinhaUpdated={onLinhaUpdated}
          />
        </div>
      )}
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function PontosPage() {
  const { lojas, lojaSelecionada } = useLoja();

  const [aba, setAba] = useState<Aba>('registros');
  const [lojaId, setLojaId] = useState<string>('');
  const [data, setData] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [pendencias, setPendencias] = useState<PendenciaResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [ultimaSincronizacao, setUltimaSincronizacao] = useState<string | null>(null);

  const fetchPontos = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ data });
      if (lojaId) params.set('loja', lojaId);
      const res = await fetch(`/api/pontos?${params}`);
      if (res.ok) {
        const d = await res.json();
        setRegistros(d.registros ?? []);
        setPendencias(d.pendencias ?? []);
        setUltimaSincronizacao(
          typeof d.ultimaSincronizacao === 'string' ? d.ultimaSincronizacao : null
        );
        setLastUpdated(new Date());
      }
    } catch {
      /* silently fail */
    } finally {
      if (!silent) setLoading(false);
    }
  }, [data, lojaId]);

  // Carga inicial
  useEffect(() => {
    fetchPontos();
  }, [fetchPontos]);

  // Poll a cada 60 segundos (aba registros ou pendências)
  useEffect(() => {
    if (aba === 'relatorio') return;
    const id = setInterval(() => fetchPontos(true), 60_000);
    return () => clearInterval(id);
  }, [aba, fetchPontos]);

  useEffect(() => {
    if (lojaSelecionada && !lojaId) setLojaId(lojaSelecionada.id);
  }, [lojaSelecionada, lojaId]);

  const hoje = new Date().toISOString().split('T')[0];
  const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const lojaFiltro = lojas.find((l) => l.id === lojaId) ?? null;
  const abas: { id: Aba; label: string; count: number | null }[] = [
    { id: 'registros', label: 'Registros', count: null },
    { id: 'pendencias', label: 'Pendências', count: pendencias.length },
    { id: 'relatorio', label: 'Relatório', count: null },
  ];

  return (
    <div className="w-full px-6 py-6 md:px-8 space-y-6">
      <PageHeader
        title="Pontos"
        description={aba !== 'relatorio' ? dataFormatada : undefined}
        actions={
          <>
            {lastUpdated && (
              <SyncStatus
                ultimaSincronizacao={ultimaSincronizacao}
                dataSelecionada={data}
                hoje={hoje}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fetchPontos()}
              disabled={loading || aba === 'relatorio'}
            >
              <RefreshCw className={cn('text-muted-foreground', loading && 'animate-spin')} />
              Atualizar
            </Button>
          </>
        }
      />

      <div className="flex flex-col border-b border-border lg:flex-row lg:items-end lg:justify-between">
        {aba !== 'relatorio' && (
          <div className="flex flex-wrap items-center gap-2 pb-3">
            <RhLojaCombobox
              lojas={lojas}
              lojaSelecionada={lojaFiltro}
              onSelect={(loja) => setLojaId(loja?.id ?? '')}
            />
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Dia anterior"
                onClick={() => setData((current) => shiftIsoDate(current, -1))}
              >
                <ChevronLeft />
              </Button>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="h-8 w-[148px] text-sm"
                aria-label="Data"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Próximo dia"
                onClick={() => setData((current) => shiftIsoDate(current, 1))}
              >
                <ChevronRight />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setData(hoje)}
                disabled={data === hoje}
              >
                Hoje
              </Button>
            </div>
          </div>
        )}

        <ModuleTabs borderless className="lg:ml-auto">
          {abas.map((t) => {
            const active = aba === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setAba(t.id)}
                className={moduleTabClass(active)}
              >
                {t.label}
                {t.count !== null && (
                  <span
                    className={cn(
                      'ml-1.5 inline-flex min-w-5 items-center justify-center rounded-md px-1.5 text-xs tabular-nums',
                      t.count > 0 ? 'bg-warning/15 text-warning' : 'text-muted-foreground'
                    )}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </ModuleTabs>
      </div>

      {aba === 'relatorio' ? (
        <AbaRelatorio />
      ) : aba === 'registros' ? (
        <TabelaRegistros registros={registros} showLoja={!lojaId} loading={loading} />
      ) : (
        <TabelaPendencias pendencias={pendencias} loading={loading} />
      )}
    </div>
  );
}
