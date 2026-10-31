'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { saoPauloYmd, formatOcorrenciaDateTime } from '@/lib/ocorrencias-period';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TODAS_CATEGORIAS,
  categoriaLabel,
} from '@/lib/ocorrencias-categorias';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AtrasosMensaisDialog } from './AtrasosMensaisDialog';
import { OcorrenciasAtasTab } from './OcorrenciasAtasTab';

interface Loja { id: string; nome: string; }
interface Motoboy { id: string; nome: string; }

interface Ocorrencia {
  id: string;
  numeroPedidoSaipos: string;
  numeroPedidoExterno: string | null;
  canalExterno: 'IFOOD' | 'DELIVERY_DIRETO' | null;
  categorias: string[];
  descricao: string;
  criadoPorUserId: string;
  criadoPorNome: string;
  createdAt: string;
  temFoto: boolean;
  fotoUrl: string | null;
  fotoUrls: string[];
  loja: { id: string; nome: string };
  motoboy: { id: string; name: string } | null;
  destaqueAta: boolean;
}

interface ContadorLoja { lojaId: string; lojaNome: string; total: number; }
interface ContadorCategoria { categoria: string; total: number; }

interface ListaResponse {
  ocorrencias: Ocorrencia[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  contadoresPorLoja: ContadorLoja[];
  contadoresPorCategoria: ContadorCategoria[];
}

function canalLabel(canal: string | null) {
  if (canal === 'IFOOD') return 'iFood';
  if (canal === 'DELIVERY_DIRETO') return 'Delivery Direto';
  return null;
}

function formatDT(iso: string) {
  return formatOcorrenciaDateTime(iso);
}

function mesAtualYmd() {
  const { year, month } = saoPauloYmd();
  const last = new Date(year, month, 0).getDate();
  const mm = String(month).padStart(2, '0');
  return {
    inicio: `${year}-${mm}-01`,
    fim: `${year}-${mm}-${String(last).padStart(2, '0')}`,
  };
}

function kpiBorder(index: number, total: number) {
  const last = index === total - 1;
  return cn(
    index % 2 === 0 && !last && 'border-r border-border',
    index < 2 && total > 2 && 'border-b border-border xl:border-b-0',
    !last && 'xl:border-r',
    last && 'xl:border-r-0',
  );
}

export default function OcorrenciasClient({
  canRegister = false,
}: {
  canRegister?: boolean;
}) {
  const padrao = mesAtualYmd();
  const [inicio, setInicio] = useState(padrao.inicio);
  const [fim, setFim] = useState(padrao.fim);
  const [lojaFiltro, setLojaFiltro] = useState('');
  const [motoboyFiltro, setMotoboyFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [categoriasFiltro, setCategoriasFiltro] = useState<string[]>([]);
  const [soDestaques, setSoDestaques] = useState(false);
  const [aba, setAba] = useState<'ocorrencias' | 'atas'>('ocorrencias');
  const [atrasosOpen, setAtrasosOpen] = useState(false);
  const [atrasosAno, setAtrasosAno] = useState<number | undefined>();
  const [atrasosMes, setAtrasosMes] = useState<number | undefined>();
  const [page, setPage] = useState(1);

  const [dados, setDados] = useState<ListaResponse | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [lojas, setLojas] = useState<Loja[]>([]);
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);

  const [detalhe, setDetalhe] = useState<Ocorrencia | null>(null);
  const [fotoUrls, setFotoUrls] = useState<string[]>([]);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [carregandoFoto, setCarregandoFoto] = useState(false);

  useEffect(() => {
    fetch('/api/ocorrencias/opcoes')
      .then((r) => r.json())
      .then((d) => {
        setLojas(d.lojas || []);
        setMotoboys(d.motoboys || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const url = lojaFiltro
      ? `/api/ocorrencias/opcoes?lojaId=${lojaFiltro}`
      : '/api/ocorrencias/opcoes';
    fetch(url)
      .then((r) => r.json())
      .then((d) => setMotoboys(d.motoboys || []))
      .catch(() => {});
  }, [lojaFiltro]);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const params = new URLSearchParams({
      inicio,
      fim,
      page: String(page),
    });
    if (lojaFiltro) params.set('lojaId', lojaFiltro);
    if (motoboyFiltro) params.set('motoboyId', motoboyFiltro);
    if (busca) params.set('busca', busca);
    if (categoriasFiltro.length > 0) {
      params.set('categorias', categoriasFiltro.join(','));
    }
    if (soDestaques) params.set('destaqueAta', 'true');

    try {
      const res = await fetch(`/api/ocorrencias?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar');
      setDados(await res.json());
    } catch {
      setErro('Não foi possível carregar as ocorrências.');
    } finally {
      setCarregando(false);
    }
  }, [inicio, fim, lojaFiltro, motoboyFiltro, busca, categoriasFiltro, soDestaques, page]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function limparFiltros() {
    const atual = mesAtualYmd();
    setLojaFiltro('');
    setMotoboyFiltro('');
    setBusca('');
    setCategoriasFiltro([]);
    setSoDestaques(false);
    setInicio(atual.inicio);
    setFim(atual.fim);
    setPage(1);
  }

  function abrirAtrasos(ano?: number, mes?: number) {
    if (ano && mes) {
      setAtrasosAno(ano);
      setAtrasosMes(mes);
    } else {
      const d = saoPauloYmd(new Date(`${inicio}T12:00:00-03:00`));
      setAtrasosAno(d.year);
      setAtrasosMes(d.month);
    }
    setAtrasosOpen(true);
  }

  async function toggleDestaque(oc: Ocorrencia, next: boolean) {
    setDados((prev) =>
      prev
        ? {
            ...prev,
            ocorrencias: prev.ocorrencias.map((o) =>
              o.id === oc.id ? { ...o, destaqueAta: next } : o,
            ),
          }
        : prev,
    );
    setDetalhe((d) => (d && d.id === oc.id ? { ...d, destaqueAta: next } : d));
    try {
      const res = await fetch(`/api/ocorrencias/${oc.id}/destaque`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destaqueAta: next }),
      });
      if (!res.ok) throw new Error('fail');
    } catch {
      setDados((prev) =>
        prev
          ? {
              ...prev,
              ocorrencias: prev.ocorrencias.map((o) =>
                o.id === oc.id ? { ...o, destaqueAta: !next } : o,
              ),
            }
          : prev,
      );
      setDetalhe((d) => (d && d.id === oc.id ? { ...d, destaqueAta: !next } : d));
    }
  }

  async function abrirDetalhe(oc: Ocorrencia) {
    setDetalhe(oc);
    setFotoAtiva(0);
    const iniciais = oc.fotoUrls?.length
      ? oc.fotoUrls
      : oc.fotoUrl
        ? [oc.fotoUrl]
        : [];
    setFotoUrls(iniciais);
    if (iniciais.length > 0 || !oc.temFoto) {
      setCarregandoFoto(false);
      return;
    }
    setCarregandoFoto(true);
    try {
      const res = await fetch(`/api/ocorrencias/${oc.id}/foto`);
      if (res.ok) {
        const data = await res.json();
        const urls: string[] = data.urls?.length
          ? data.urls
          : data.url
            ? [data.url]
            : [];
        setFotoUrls(urls);
      }
    } catch {
      // foto fica indisponível
    }
    setCarregandoFoto(false);
  }

  const temFiltros = Boolean(
    lojaFiltro || motoboyFiltro || busca || categoriasFiltro.length > 0 || soDestaques,
  );
  const totaisCategoria = Object.fromEntries(
    (dados?.contadoresPorCategoria ?? []).map((c) => [c.categoria, c.total]),
  );
  const kpiCategorias = TODAS_CATEGORIAS.map((categoria) => ({
    key: categoria,
    label: categoriaLabel(categoria),
    value: totaisCategoria[categoria] ?? 0,
  }));
  const kpiCells = dados
    ? [
        { key: 'total', label: 'Total no período', value: dados.total },
        ...dados.contadoresPorLoja.map((c) => ({
          key: c.lojaId,
          label: c.lojaNome,
          value: c.total,
        })),
      ]
    : [];

  return (
    <div className="px-6 py-6 md:px-8 space-y-6">
      <PageHeader
        title="Central de Ocorrências"
        description="Ocorrências registradas pelos funcionários das lojas"
        actions={
          canRegister ? (
            <Button asChild>
              <Link href="/ocorrencias/nova">Registrar ocorrência</Link>
            </Button>
          ) : undefined
        }
      />

      <ToggleGroup
        type="single"
        value={aba}
        onValueChange={(v) => {
          if (v) setAba(v as 'ocorrencias' | 'atas');
        }}
        size="sm"
        className="w-fit"
      >
        <ToggleGroupItem value="ocorrencias" className="text-xs px-3">
          Ocorrências
        </ToggleGroupItem>
        <ToggleGroupItem value="atas" className="text-xs px-3">
          Atas
        </ToggleGroupItem>
      </ToggleGroup>

      {aba === 'atas' ? (
        <OcorrenciasAtasTab onEditarAtrasos={(ano, mes) => abrirAtrasos(ano, mes)} />
      ) : null}

      {aba === 'ocorrencias' && dados && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-0 rounded-xl border border-border overflow-hidden bg-card">
            {kpiCells.map((c, i) => (
              <div key={c.key} className={cn('p-4', kpiBorder(i, kpiCells.length))}>
                <p className="text-sm text-muted-foreground truncate">{c.label}</p>
                <p className="text-3xl font-semibold tabular-nums text-foreground mt-1">
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-0 rounded-xl border border-border overflow-hidden bg-card">
              {kpiCategorias.map((c, i) => (
                <Tooltip key={c.key}>
                  <TooltipTrigger asChild>
                    <div className={cn('p-4', kpiBorder(i, kpiCategorias.length))}>
                      <p className="text-sm text-muted-foreground truncate">{c.label}</p>
                      <p className="text-3xl font-semibold tabular-nums text-foreground mt-1">
                        {c.value}
                      </p>
                      {c.key === 'PEDIDO_ATRASADO' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 h-7 text-xs"
                          onClick={() => abrirAtrasos()}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Uma ocorrência com 2 categorias conta em ambas
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      )}

      {aba === 'ocorrencias' && (
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="date"
          value={inicio}
          onChange={(e) => {
            setInicio(e.target.value);
            setPage(1);
          }}
          className="w-auto"
        />
        <span className="text-muted-foreground text-sm">até</span>
        <Input
          type="date"
          value={fim}
          onChange={(e) => {
            setFim(e.target.value);
            setPage(1);
          }}
          className="w-auto"
        />

        <Select
          value={lojaFiltro}
          onValueChange={(v) => {
            setLojaFiltro(v === 'todas' ? '' : v);
            setMotoboyFiltro('');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todas as lojas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as lojas</SelectItem>
            {lojas.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={motoboyFiltro}
          onValueChange={(v) => {
            setMotoboyFiltro(v === 'todos' ? '' : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos os motoboys" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {motoboys.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 w-44 justify-between font-normal">
              <span className="truncate">
                {categoriasFiltro.length === 0
                  ? 'Categorias'
                  : `${categoriasFiltro.length} categoria${categoriasFiltro.length > 1 ? 's' : ''}`}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-1" align="start">
            {TODAS_CATEGORIAS.map((c) => {
              const sel = categoriasFiltro.includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCategoriasFiltro((prev) =>
                      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                    );
                    setPage(1);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                    sel ? 'bg-accent text-foreground' : 'text-foreground hover:bg-muted',
                  )}
                >
                  <Check
                    className={cn(
                      'h-3.5 w-3.5 text-muted-foreground',
                      sel ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {categoriaLabel(c)}
                </button>
              );
            })}
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Buscar por nº pedido…"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />

        <Button
          type="button"
          variant={soDestaques ? 'default' : 'outline'}
          size="sm"
          className="h-10"
          onClick={() => {
            setSoDestaques((v) => !v);
            setPage(1);
          }}
        >
          Só destacadas
        </Button>

        {temFiltros && (
          <Button variant="ghost" size="sm" onClick={limparFiltros} className="gap-1">
            <X className="h-3.5 w-3.5" /> Limpar
          </Button>
        )}
      </div>
      )}

      {aba === 'ocorrencias' && (carregando ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      ) : erro ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {erro}
        </div>
      ) : dados && dados.ocorrencias.length === 0 ? (
        <div className="py-12">
          <p className="text-sm text-muted-foreground">Nenhuma ocorrência neste período</p>
          {temFiltros && (
            <p className="text-xs text-muted-foreground mt-1">Tente remover os filtros</p>
          )}
        </div>
      ) : dados ? (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-xs w-10">Destaque</TableHead>
                <TableHead className="text-xs">Data/Hora</TableHead>
                <TableHead className="text-xs">Loja</TableHead>
                <TableHead className="text-xs">Pedido Saipos</TableHead>
                <TableHead className="text-xs">Pedido Externo</TableHead>
                <TableHead className="text-xs">Categorias</TableHead>
                <TableHead className="text-xs">Motoboy</TableHead>
                <TableHead className="text-xs">Quem registrou</TableHead>
                <TableHead className="text-xs">Foto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.ocorrencias.map((oc) => (
                <TableRow
                  key={oc.id}
                  className="cursor-pointer hover:bg-muted/50 border-border"
                  onClick={() => abrirDetalhe(oc)}
                >
                  <TableCell className="py-2">
                    <button
                      type="button"
                      aria-label={oc.destaqueAta ? 'Remover destaque' : 'Destacar na ata'}
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        void toggleDestaque(oc, !oc.destaqueAta);
                      }}
                    >
                      <Star
                        className={cn(
                          'size-4',
                          oc.destaqueAta && 'fill-foreground text-foreground',
                        )}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground tabular-nums whitespace-nowrap py-2">
                    {formatDT(oc.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm py-2">{oc.loja.nome}</TableCell>
                  <TableCell className="text-sm tabular-nums text-foreground py-2">
                    {oc.numeroPedidoSaipos}
                  </TableCell>
                  <TableCell className="py-2">
                    {oc.numeroPedidoExterno ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm tabular-nums text-foreground">
                          {oc.numeroPedidoExterno}
                        </span>
                        {oc.canalExterno && (
                          <Badge variant="secondary" className="text-xs">
                            {canalLabel(oc.canalExterno)}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-wrap gap-1">
                      {(oc.categorias ?? []).map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-xs">
                          {categoriaLabel(cat)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm py-2">
                    {oc.motoboy?.name || (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm py-2 max-w-[160px] truncate">
                    {oc.criadoPorNome}
                  </TableCell>
                  <TableCell className="py-2">
                    {oc.fotoUrl ? (
                      <div className="relative h-8 w-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={oc.fotoUrl}
                          alt=""
                          className="h-8 w-8 rounded object-cover border border-border"
                        />
                        {(oc.fotoUrls?.length ?? 0) > 1 && (
                          <span className="absolute -bottom-1 -right-1 min-w-4 h-4 px-0.5 rounded bg-card border border-border text-[10px] leading-4 text-foreground tabular-nums text-center">
                            {oc.fotoUrls.length}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {dados.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {dados.total} ocorrências · pág. {dados.page}/{dados.totalPages}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={dados.page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={dados.page >= dados.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null)}

      <Sheet
        open={!!detalhe}
        onOpenChange={(open) => {
          if (!open) setDetalhe(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card border-border">
          {detalhe && (
            <>
              <SheetHeader className="mb-4">
                <SheetTitle className="text-base font-semibold">
                  Ocorrência — {detalhe.loja.nome}
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {formatDT(detalhe.createdAt)}
                </p>
              </SheetHeader>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2 mb-4">
                <label htmlFor="destaque-ata" className="text-sm text-foreground">
                  Destacar na ata
                </label>
                <Switch
                  id="destaque-ata"
                  checked={detalhe.destaqueAta}
                  onCheckedChange={(v) => void toggleDestaque(detalhe, v)}
                />
              </div>

              <div className="space-y-4">
                {detalhe.temFoto || carregandoFoto || fotoUrls.length > 0 ? (
                  <div className="space-y-2">
                    <div className="rounded-xl overflow-hidden border border-border bg-muted min-h-[180px] flex items-center justify-center">
                      {carregandoFoto ? (
                        <Skeleton className="w-full h-64" />
                      ) : fotoUrls[fotoAtiva] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={fotoUrls[fotoAtiva]}
                          alt={`Foto ${fotoAtiva + 1} da ocorrência`}
                          className="w-full object-contain max-h-[70vh]"
                        />
                      ) : (
                        <p className="text-xs text-muted-foreground p-4">Foto indisponível</p>
                      )}
                    </div>
                    {fotoUrls.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {fotoUrls.map((url, i) => (
                          <button
                            key={`${url}-${i}`}
                            type="button"
                            onClick={() => setFotoAtiva(i)}
                            className={cn(
                              'h-14 w-14 shrink-0 rounded-lg overflow-hidden border',
                              i === fotoAtiva ? 'border-primary' : 'border-border',
                            )}
                            aria-label={`Ver foto ${i + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem foto</p>
                )}

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">Pedido Saipos</dt>
                    <dd className="tabular-nums text-foreground">{detalhe.numeroPedidoSaipos}</dd>
                  </div>
                  {detalhe.numeroPedidoExterno && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">Pedido externo</dt>
                      <dd className="flex items-center gap-1.5">
                        <span className="tabular-nums text-foreground">
                          {detalhe.numeroPedidoExterno}
                        </span>
                        {detalhe.canalExterno && (
                          <Badge variant="secondary" className="text-xs">
                            {canalLabel(detalhe.canalExterno)}
                          </Badge>
                        )}
                      </dd>
                    </div>
                  )}
                  {detalhe.motoboy && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground shrink-0">Motoboy</dt>
                      <dd className="text-foreground">{detalhe.motoboy.name}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground shrink-0">Quem registrou</dt>
                    <dd className="text-foreground">{detalhe.criadoPorNome}</dd>
                  </div>
                </dl>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Categorias</p>
                  <div className="flex flex-wrap gap-1">
                    {(detalhe.categorias ?? []).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs">
                        {categoriaLabel(cat)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Descrição</p>
                  {detalhe.descricao?.trim() ? (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted rounded-lg px-3 py-2">
                      {detalhe.descricao}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem descrição</p>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AtrasosMensaisDialog
        open={atrasosOpen}
        onOpenChange={setAtrasosOpen}
        anoInicial={atrasosAno}
        mesInicial={atrasosMes}
        onSaved={() => {
          void carregarDados();
        }}
      />
    </div>
  );
}
