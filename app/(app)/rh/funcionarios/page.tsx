'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { type ColumnDef } from '@tanstack/react-table';
import { useLoja } from '@/contexts/LojaContext';
import { Search, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { RhLojaCombobox } from '@/components/rh/RhLojaCombobox';
import { DataTable } from '@/components/layout/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Cargo {
  id: string;
  nome: string;
  ratPct: number;
}

interface Funcionario {
  id: string;
  nome: string;
  cpf?: string | null;
  email?: string | null;
  dataNascimento?: string | null;
  ativo: boolean;
  cargoId?: string | null;
  cargo?: { id: string; nome: string; ratPct: number } | null;
  lojaId?: string | null;
  loja?: { id: string; nome: string } | null;
  salarioBruto: number;
  composicaoSalarial?: {
    salarioBase: number;
    adicionalResponsabilidade: number;
    bonificacaoAssiduidade: number;
    valorAlimentacao: number;
    valorVT: number;
    baseCalculoEncargos: number;
    totalBruto: number;
  };
  escala: '6x1' | '5x2';
  turno: 'manhã' | 'tarde' | 'noite' | 'integral';
}

function cadastroIncompleto(f: Funcionario): boolean {
  return !f.cpf || !f.dataNascimento || !f.cargoId || !f.lojaId || !f.salarioBruto;
}

function ConfirmModal({
  funcionario,
  permanent,
  onConfirm,
  onCancel,
  loading,
}: {
  funcionario: Funcionario;
  permanent: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full space-y-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="size-5 text-destructive shrink-0" />
          <h3 className="text-base font-semibold text-foreground">
            {permanent ? 'Excluir permanentemente' : 'Desativar funcionário'}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {permanent ? 'Você está prestes a excluir ' : 'Tem certeza que deseja desativar '}
          <span className="text-foreground font-medium">{funcionario.nome}</span>
          {permanent ? ' do sistema.' : '?'}
        </p>
        {permanent && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            Esta ação é irreversível. Todos os dados do funcionário serão apagados
            permanentemente.
          </p>
        )}
        {!permanent && (
          <p className="text-xs text-muted-foreground">Esta ação pode ser revertida posteriormente.</p>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading
              ? permanent
                ? 'Excluindo...'
                : 'Desativando...'
              : permanent
                ? 'Excluir'
                : 'Desativar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

const TURNO_LABELS: Record<string, string> = {
  manhã: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
  integral: 'Integral',
};

export default function FuncionariosPage() {
  const router = useRouter();
  const { lojas, lojaSelecionada, setLojaSelecionada } = useLoja();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [filterEscala, setFilterEscala] = useState('');
  const [filterTurno, setFilterTurno] = useState('');
  const [filterAtivo, setFilterAtivo] = useState('true');
  const [deleteTarget, setDeleteTarget] = useState<Funcionario | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fmt = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const fetchFuncionarios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lojaSelecionada) params.set('lojaId', lojaSelecionada.id);
      if (filterCargo) params.set('cargoId', filterCargo);
      if (filterEscala) params.set('escala', filterEscala);
      if (filterTurno) params.set('turno', filterTurno);
      if (filterAtivo) params.set('ativo', filterAtivo);
      const res = await fetch(`/api/rh/funcionarios?${params}`);
      if (!res.ok) throw new Error('Falha ao carregar');
      setFuncionarios(await res.json());
    } catch {
      setFuncionarios([]);
    } finally {
      setLoading(false);
    }
  }, [lojaSelecionada, filterCargo, filterEscala, filterTurno, filterAtivo]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  useEffect(() => {
    fetch('/api/rh/cargos')
      .then((r) => r.json())
      .then(setCargos)
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const permanent = !deleteTarget.ativo;
    try {
      const url = permanent
        ? `/api/rh/funcionarios/${deleteTarget.id}?permanent=true`
        : `/api/rh/funcionarios/${deleteTarget.id}`;
      await fetch(url, { method: 'DELETE' });
      setDeleteTarget(null);
      fetchFuncionarios();
    } catch {
      /* silently fail */
    } finally {
      setDeleteLoading(false);
    }
  };

  const searchTerm = search.trim().toLowerCase();
  const cpfSearch = searchTerm.replace(/\D/g, '');
  const funcionariosFiltrados = searchTerm
    ? funcionarios.filter(
        (f) =>
          f.nome.toLowerCase().includes(searchTerm) ||
          (cpfSearch.length > 0 && (f.cpf ?? '').replace(/\D/g, '').includes(cpfSearch))
      )
    : funcionarios;

  const description = loading
    ? 'Carregando…'
    : searchTerm
      ? `${funcionariosFiltrados.length} de ${funcionarios.length} resultado${funcionarios.length !== 1 ? 's' : ''}`
      : `${funcionarios.length} resultado${funcionarios.length !== 1 ? 's' : ''}`;

  const columns = useMemo<ColumnDef<Funcionario, unknown>[]>(
    () => [
      {
        accessorKey: 'nome',
        header: 'Nome',
        cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground truncate">{f.nome}</span>
                {cadastroIncompleto(f) && (
                  <span
                    title="Cadastro incompleto"
                    className="shrink-0 size-4 rounded-full bg-destructive/15 border border-destructive/40 inline-flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-destructive leading-none">!</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    f.ativo ? 'bg-success' : 'bg-muted-foreground'
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {f.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'cargo',
        header: 'Cargo',
        cell: ({ row }) => (
          <span className="text-sm text-foreground">{row.original.cargo?.nome ?? '—'}</span>
        ),
      },
      {
        id: 'loja',
        header: 'Loja',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.loja?.nome ?? '—'}</span>
        ),
      },
      {
        id: 'turno',
        header: 'Turno',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {TURNO_LABELS[row.original.turno] ?? row.original.turno}
          </span>
        ),
      },
      {
        accessorKey: 'salarioBruto',
        header: 'Salário bruto',
        meta: { headerClassName: 'text-right', cellClassName: 'text-right' },
        cell: ({ row }) => {
          const f = row.original;
          return (
            <span
              className="text-sm tabular-nums text-foreground"
              title={
                f.composicaoSalarial
                  ? `Base: ${fmt(f.composicaoSalarial.salarioBase)} | Resp.: ${fmt(f.composicaoSalarial.adicionalResponsabilidade)} | Assid.: ${fmt(f.composicaoSalarial.bonificacaoAssiduidade)} | VR: ${fmt(f.composicaoSalarial.valorAlimentacao)} | VT: ${fmt(f.composicaoSalarial.valorVT)}`
                  : undefined
              }
            >
              {fmt(f.salarioBruto)}
            </span>
          );
        },
      },
      {
        accessorKey: 'escala',
        header: 'Escala',
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-foreground">{row.original.escala}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        meta: { headerClassName: 'w-12', cellClassName: 'w-12' },
        cell: ({ row }) => {
          const f = row.original;
          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              title={f.ativo ? 'Desativar funcionário' : 'Excluir permanentemente'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteTarget(f);
              }}
            >
              <Trash2 className="size-3.5 text-muted-foreground" />
            </Button>
          );
        },
      },
    ],
    []
  );

  const clearFilters = () => {
    setSearch('');
    setFilterCargo('');
    setFilterEscala('');
    setFilterTurno('');
    setFilterAtivo('true');
  };

  return (
    <div className="space-y-6">
      {deleteTarget && (
        <ConfirmModal
          funcionario={deleteTarget}
          permanent={!deleteTarget.ativo}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      <PageHeader
        title="Funcionários"
        description={description}
        actions={
          <Button onClick={() => router.push('/rh/funcionarios/novo')}>
            <Plus className="size-4" />
            Novo funcionário
          </Button>
        }
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
        <RhLojaCombobox
          lojas={lojas}
          lojaSelecionada={lojaSelecionada}
          onSelect={setLojaSelecionada}
        />
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou CPF..."
            className="h-8 pl-8"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <Select
          value={filterCargo || '__all__'}
          onValueChange={(v) => setFilterCargo(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os cargos</SelectItem>
            {cargos.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterEscala || '__all__'}
          onValueChange={(v) => setFilterEscala(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder="Escala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todas as escalas</SelectItem>
            <SelectItem value="6x1">6x1</SelectItem>
            <SelectItem value="5x2">5x2</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filterTurno || '__all__'}
          onValueChange={(v) => setFilterTurno(v === '__all__' ? '' : v)}
        >
          <SelectTrigger className="h-8 w-[130px]">
            <SelectValue placeholder="Turno" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Todos os turnos</SelectItem>
            <SelectItem value="manhã">Manhã</SelectItem>
            <SelectItem value="tarde">Tarde</SelectItem>
            <SelectItem value="noite">Noite</SelectItem>
            <SelectItem value="integral">Integral</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAtivo || '__all__'} onValueChange={(v) => setFilterAtivo(v === '__all__' ? '' : v)}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Ativos</SelectItem>
            <SelectItem value="false">Inativos</SelectItem>
            <SelectItem value="__all__">Todos</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" size="sm" className="h-8" onClick={clearFilters}>
          Limpar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={funcionariosFiltrados}
        loading={loading}
        getRowHref={(row) => `/rh/funcionarios/${row.id}`}
        emptyState={
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-foreground">Nenhum funcionário encontrado</p>
            <p className="text-xs text-muted-foreground">
              Ajuste os filtros ou cadastre um novo
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push('/rh/funcionarios/novo')}
            >
              <Plus className="size-3.5" />
              Cadastrar funcionário
            </Button>
          </div>
        }
      />
    </div>
  );
}
