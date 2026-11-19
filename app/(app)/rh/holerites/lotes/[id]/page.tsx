'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  Link2,
  Paperclip,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { AnimatedNumber } from '@/components/ui/animated-number';
import { useApp } from '@/contexts/app-context';
import {
  labelCompetencia,
  labelPayslipType,
} from '@/lib/shared/holerites/labels';
import type { PayslipType } from '@/lib/shared/holerites/types';
import {
  formatCentsBr,
  labelBatchStatus,
  labelUnmatchedMotivo,
} from '@/lib/holerites/ui-labels';
import { cn } from '@/lib/utils';

type LojaRef = { id: string; nome: string } | null;

type DraftRow = {
  id: string;
  funcionario: { id: string; nome: string; loja: LojaRef };
  pageCount: number;
  netAmountCents: number | null;
  retificacao: boolean;
  semContato: boolean;
  sourcePath: string | null;
  sourcePageIndexes: number[];
};

type Unmatched = {
  sourcePath: string;
  pageIndexes: number[];
  cpfDetectado: string | null;
  motivo: string;
  previewText: string;
};

type FuncOpt = {
  id: string;
  nome: string;
  ativo: boolean;
  loja: LojaRef;
};

type LotePayload = {
  lote: {
    id: string;
    competencia: string;
    type: PayslipType;
    status: string;
    errorMessage: string | null;
    notifyStatus: string | null;
  };
  drafts: DraftRow[];
  unmatchedPages: Unmatched[];
  ativosSemHolerite: Array<{ id: string; nome: string; loja: LojaRef }>;
  funcionariosOpcoes: FuncOpt[];
  permissoes: { canUpload: boolean; canPublish: boolean };
  resumo: {
    vinculados: number;
    semVinculo: number;
    ativosSemHolerite: number;
    retificacoes: number;
    semWhatsapp: number;
  };
};

function kpiBorder(index: number, total: number) {
  return cn(
    (index === 0 || index === 2) && total > 2 && 'border-r border-border',
    (index === 0 || index === 1) && total > 2 && 'border-b border-border xl:border-b-0',
    index < total - 1 && 'xl:border-r xl:border-border',
  );
}

function FuncionarioCombobox({
  options,
  value,
  onChange,
  disabled,
}: {
  options: FuncOpt[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selected
              ? `${selected.nome}${selected.ativo ? '' : ' (desligado)'}`
              : 'Escolher funcionário'}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-80" align="start">
        <Command>
          <CommandInput placeholder="Buscar funcionário…" />
          <CommandList>
            <CommandEmpty>Nenhum funcionário</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.id}
                  value={`${o.nome} ${o.loja?.nome ?? ''}`}
                  onSelect={() => {
                    onChange(o.id);
                    setOpen(false);
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm truncate">
                      {o.nome}
                      {!o.ativo ? (
                        <span className="text-muted-foreground"> · desligado</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {o.loja?.nome ?? 'Sem loja'}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ConferenciaLotePage() {
  const params = useParams<{ id: string }>();
  const batchId = params.id;
  const router = useRouter();
  const { addToast } = useApp();

  const [data, setData] = useState<LotePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lojaFiltro, setLojaFiltro] = useState<string>('all');
  const [ativosOpen, setAtivosOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [preview, setPreview] = useState<{
    title: string;
    url?: string;
    blobUrl?: string;
  } | null>(null);

  const [trocar, setTrocar] = useState<{ payslipId: string; funcionarioId: string } | null>(
    null,
  );
  const [vincular, setVincular] = useState<{
    item: Unmatched;
    funcionarioId: string;
  } | null>(null);
  const [anexar, setAnexar] = useState<Unmatched | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}`, {
        cache: 'no-store',
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Falha ao carregar');
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError('Erro de comunicação');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    void load();
  }, [load]);

  const readOnly = data?.lote.status === 'PUBLISHED';
  const canUpload = data?.permissoes.canUpload ?? false;
  const canPublish = data?.permissoes.canPublish ?? false;

  const lojas = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of data?.drafts ?? []) {
      if (d.funcionario.loja) map.set(d.funcionario.loja.id, d.funcionario.loja.nome);
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
  }, [data?.drafts]);

  const draftsFiltrados = useMemo(() => {
    const list = data?.drafts ?? [];
    if (lojaFiltro === 'all') return list;
    return list.filter((d) => d.funcionario.loja?.id === lojaFiltro);
  }, [data?.drafts, lojaFiltro]);

  const findDraftAnterior = (item: Unmatched): DraftRow | null => {
    if (!data) return null;
    const start = Math.min(...item.pageIndexes);
    return (
      data.drafts.find((d) => {
        if (d.sourcePath !== item.sourcePath) return false;
        const pages = d.sourcePageIndexes ?? [];
        if (!pages.length) return false;
        return Math.max(...pages) + 1 === start;
      }) ?? null
    );
  };

  const openPreviewPayslip = async (payslipId: string, title: string) => {
    try {
      const res = await fetch(
        `/api/rh/holerites/lotes/${batchId}/preview?payslipId=${payslipId}`,
      );
      const json = await res.json();
      if (!res.ok) {
        addToast(json.error ?? 'Falha na prévia', 'error');
        return;
      }
      setPreview({ title, url: json.signedUrl });
    } catch {
      addToast('Falha na prévia', 'error');
    }
  };

  const openPreviewPages = async (
    sourcePath: string,
    pages: number[],
    title: string,
  ) => {
    try {
      const qs = new URLSearchParams({
        sourcePath,
        pages: pages.join(','),
      });
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}/preview?${qs}`);
      if (!res.ok) {
        addToast('Falha na prévia', 'error');
        return;
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPreview({ title, blobUrl });
    } catch {
      addToast('Falha na prévia', 'error');
    }
  };

  useEffect(() => {
    return () => {
      if (preview?.blobUrl) URL.revokeObjectURL(preview.blobUrl);
    };
  }, [preview?.blobUrl]);

  const patchVinculo = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}/vinculos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast(json.error ?? 'Falha na ação', 'error');
        return false;
      }
      await load();
      return true;
    } catch {
      addToast('Erro de comunicação', 'error');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const handleReprocessar = async () => {
    if (!canUpload) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}/processar`, {
        method: 'POST',
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast(json.error ?? 'Falha ao reprocessar', 'error');
        return;
      }
      addToast('Lote reprocessado', 'success');
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleCancelar = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}`, {
        method: 'DELETE',
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast(json.error ?? 'Falha ao cancelar', 'error');
        return;
      }
      addToast('Lote cancelado', 'success');
      router.push('/rh/holerites/lotes/novo');
    } finally {
      setBusy(false);
      setCancelOpen(false);
    }
  };

  const handlePublicar = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/rh/holerites/lotes/${batchId}/publicar`, {
        method: 'POST',
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast(json.error ?? 'Falha ao publicar', 'error');
        return;
      }
      addToast(
        `Publicados ${json.published}. Avisos: ${json.notified}. Sem WhatsApp: ${json.semContato}.`,
        'success',
      );
      setPublishOpen(false);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleReenviar = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/rh/holerites/lotes/${batchId}/reenviar-avisos`,
        { method: 'POST' },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        addToast(json.error ?? 'Falha ao reenviar', 'error');
        return;
      }
      addToast('Avisos reenviados', 'success');
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert>
        <AlertDescription>{error ?? 'Lote não encontrado'}</AlertDescription>
      </Alert>
    );
  }

  const { lote, resumo } = data;
  const unmatchedBloqueia = (data.unmatchedPages?.length ?? 0) > 0;
  const title = `Holerites – ${labelCompetencia(lote.competencia)} – ${labelPayslipType(lote.type)}`;

  const kpis = [
    { label: 'Vinculados', value: resumo.vinculados },
    { label: 'Sem vínculo', value: resumo.semVinculo },
    { label: 'Ativos sem holerite', value: resumo.ativosSemHolerite },
    { label: 'Retificações', value: resumo.retificacoes },
    { label: 'Sem WhatsApp válido', value: resumo.semWhatsapp },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader
          title={title}
          actions={
            <>
              <Badge variant="outline">{labelBatchStatus(lote.status)}</Badge>
              {!readOnly && canUpload ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={handleReprocessar}
                >
                  <RefreshCw className="size-4" />
                  Reprocessar
                </Button>
              ) : null}
              {!readOnly && canUpload ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={busy}
                  onClick={() => setCancelOpen(true)}
                >
                  Cancelar lote
                </Button>
              ) : null}
              {!readOnly ? (
                unmatchedBloqueia || !canPublish ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button type="button" size="sm" disabled>
                          Publicar {resumo.vinculados} holerites
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!canPublish
                        ? 'Sem permissão para publicar'
                        : 'Resolva todas as páginas sem vínculo antes de publicar'}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    disabled={busy || resumo.vinculados === 0}
                    onClick={() => setPublishOpen(true)}
                  >
                    Publicar {resumo.vinculados} holerites
                  </Button>
                )
              ) : null}
            </>
          }
        />

        {lote.errorMessage ? (
          <Alert>
            <AlertDescription>{lote.errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {readOnly && lote.notifyStatus === 'failed' ? (
          <Alert>
            <AlertDescription className="flex flex-wrap items-center justify-between gap-3">
              <span>Avisos não enviados</span>
              {canPublish ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={handleReenviar}
                >
                  Reenviar avisos
                </Button>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="grid grid-cols-2 xl:grid-cols-5">
              {kpis.map((k, i) => (
                <div key={k.label} className={cn('p-5', kpiBorder(i, kpis.length))}>
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
                    <AnimatedNumber value={k.value} format="integer" />
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">
              Holerites vinculados
            </h2>
            <Select value={lojaFiltro} onValueChange={setLojaFiltro}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Loja" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as lojas</SelectItem>
                {lojas.map(([id, nome]) => (
                  <SelectItem key={id} value={id}>
                    {nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {draftsFiltrados.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Nenhum holerite vinculado neste lote.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Loja</TableHead>
                    <TableHead className="text-right">Páginas</TableHead>
                    <TableHead className="text-right">Líquido</TableHead>
                    <TableHead>Avisos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftsFiltrados.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="text-sm text-foreground">
                        {d.funcionario.nome}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {d.funcionario.loja?.nome ?? '—'}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {d.pageCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">
                        {formatCentsBr(d.netAmountCents)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {d.retificacao ? (
                            <Badge variant="outline">Retificação</Badge>
                          ) : null}
                          {d.semContato ? (
                            <Badge variant="outline">Sem WhatsApp</Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              openPreviewPayslip(d.id, d.funcionario.nome)
                            }
                          >
                            <Eye className="size-4" />
                            Prévia
                          </Button>
                          {!readOnly && canUpload ? (
                            <>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={busy}
                                onClick={() =>
                                  setTrocar({
                                    payslipId: d.id,
                                    funcionarioId: d.funcionario.id,
                                  })
                                }
                              >
                                Trocar funcionário
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={busy}
                                onClick={async () => {
                                  const ok = await patchVinculo({
                                    action: 'desvincular',
                                    payslipId: d.id,
                                  });
                                  if (ok) addToast('Holerite desvinculado', 'success');
                                }}
                              >
                                <Trash2 className="size-4" />
                                Desvincular
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </section>

        {!readOnly ? (
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">
              Páginas sem vínculo
            </h2>
            {data.unmatchedPages.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma página pendente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {data.unmatchedPages.map((item, idx) => {
                  const anterior = findDraftAnterior(item);
                  return (
                    <Card key={`${item.sourcePath}-${item.pageIndexes.join('-')}-${idx}`} className="bg-card border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {labelUnmatchedMotivo(item.motivo)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Páginas {(item.pageIndexes.map((p) => p + 1).join(', '))}
                            {item.cpfDetectado ? ` · CPF ${item.cpfDetectado}` : ''}
                          </p>
                          {item.previewText ? (
                            <p className="text-xs text-muted-foreground line-clamp-3">
                              {item.previewText}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openPreviewPages(
                                item.sourcePath,
                                item.pageIndexes,
                                `Páginas ${item.pageIndexes.map((p) => p + 1).join(', ')}`,
                              )
                            }
                          >
                            <Eye className="size-4" />
                            Ver página
                          </Button>
                          {canUpload ? (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={busy}
                                onClick={() =>
                                  setVincular({ item, funcionarioId: '' })
                                }
                              >
                                <Link2 className="size-4" />
                                Vincular a…
                              </Button>
                              {anterior ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={busy}
                                  onClick={() => setAnexar(item)}
                                >
                                  <Paperclip className="size-4" />
                                  Anexar ao holerite anterior
                                </Button>
                              ) : null}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={busy}
                                onClick={async () => {
                                  const ok = await patchVinculo({
                                    action: 'ignorar',
                                    sourcePath: item.sourcePath,
                                    pageIndexes: item.pageIndexes,
                                  });
                                  if (ok) addToast('Página ignorada', 'success');
                                }}
                              >
                                Ignorar página
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        <section className="space-y-2">
          <button
            type="button"
            className="flex items-center gap-2 text-base font-semibold text-foreground"
            onClick={() => setAtivosOpen((v) => !v)}
          >
            {ativosOpen ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )}
            Funcionários ativos sem holerite ({resumo.ativosSemHolerite})
          </button>
          {ativosOpen ? (
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                {data.ativosSemHolerite.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground">Nenhum.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Loja</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ativosSemHolerite.map((f) => (
                        <TableRow key={f.id}>
                          <TableCell className="text-sm">{f.nome}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {f.loja?.nome ?? '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ) : null}
        </section>

        {/* Dialogs */}
        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar lote?</DialogTitle>
              <DialogDescription>
                Os rascunhos e os arquivos de staging serão apagados. Esta ação não
                pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCancelOpen(false)}>
                Voltar
              </Button>
              <Button
                type="button"
                variant="destructive"
                loading={busy}
                onClick={handleCancelar}
              >
                Cancelar lote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={publishOpen} onOpenChange={setPublishOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publicar holerites</DialogTitle>
              <DialogDescription>
                Publicar {resumo.vinculados} holerites de{' '}
                {labelCompetencia(lote.competencia)} – {labelPayslipType(lote.type)}?{' '}
                {resumo.retificacoes} são retificações e vão substituir os atuais.{' '}
                {resumo.semWhatsapp} funcionários estão sem WhatsApp e não serão
                avisados. Os demais receberão uma mensagem no WhatsApp.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPublishOpen(false)}>
                Voltar
              </Button>
              <Button type="button" loading={busy} onClick={handlePublicar}>
                Publicar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!trocar}
          onOpenChange={(o) => {
            if (!o) setTrocar(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trocar funcionário</DialogTitle>
            </DialogHeader>
            {trocar ? (
              <FuncionarioCombobox
                options={data.funcionariosOpcoes}
                value={trocar.funcionarioId}
                onChange={(id) => setTrocar({ ...trocar, funcionarioId: id })}
              />
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTrocar(null)}>
                Cancelar
              </Button>
              <Button
                type="button"
                loading={busy}
                disabled={!trocar?.funcionarioId}
                onClick={async () => {
                  if (!trocar) return;
                  const ok = await patchVinculo({
                    action: 'trocar',
                    payslipId: trocar.payslipId,
                    funcionarioId: trocar.funcionarioId,
                  });
                  if (ok) {
                    addToast('Funcionário atualizado', 'success');
                    setTrocar(null);
                  }
                }}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!vincular}
          onOpenChange={(o) => {
            if (!o) setVincular(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vincular página</DialogTitle>
              <DialogDescription>
                {vincular
                  ? labelUnmatchedMotivo(vincular.item.motivo)
                  : null}
              </DialogDescription>
            </DialogHeader>
            {vincular ? (
              <FuncionarioCombobox
                options={data.funcionariosOpcoes}
                value={vincular.funcionarioId}
                onChange={(id) => setVincular({ ...vincular, funcionarioId: id })}
              />
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVincular(null)}>
                Cancelar
              </Button>
              <Button
                type="button"
                loading={busy}
                disabled={!vincular?.funcionarioId}
                onClick={async () => {
                  if (!vincular) return;
                  const ok = await patchVinculo({
                    action: 'vincular',
                    sourcePath: vincular.item.sourcePath,
                    pageIndexes: vincular.item.pageIndexes,
                    funcionarioId: vincular.funcionarioId,
                  });
                  if (ok) {
                    addToast('Página vinculada', 'success');
                    setVincular(null);
                  }
                }}
              >
                Vincular
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!anexar}
          onOpenChange={(o) => {
            if (!o) setAnexar(null);
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Anexar ao holerite anterior</DialogTitle>
              <DialogDescription>
                {anexar
                  ? (() => {
                      const d = findDraftAnterior(anexar);
                      return d
                        ? `Esta página será adicionada ao holerite de ${d.funcionario.nome}. Confira a prévia antes.`
                        : 'Sem holerite adjacente.';
                    })()
                  : null}
              </DialogDescription>
            </DialogHeader>
            {anexar ? (
              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const d = findDraftAnterior(anexar);
                    if (d) openPreviewPayslip(d.id, d.funcionario.nome);
                  }}
                >
                  Prévia do holerite
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openPreviewPages(
                      anexar.sourcePath,
                      anexar.pageIndexes,
                      'Página a anexar',
                    )
                  }
                >
                  Prévia da página
                </Button>
              </div>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAnexar(null)}>
                Cancelar
              </Button>
              <Button
                type="button"
                loading={busy}
                onClick={async () => {
                  if (!anexar) return;
                  const ok = await patchVinculo({
                    action: 'anexar_anterior',
                    sourcePath: anexar.sourcePath,
                    pageIndexes: anexar.pageIndexes,
                  });
                  if (ok) {
                    addToast('Página anexada', 'success');
                    setAnexar(null);
                  }
                }}
              >
                Confirmar anexo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet
          open={!!preview}
          onOpenChange={(o) => {
            if (!o) {
              if (preview?.blobUrl) URL.revokeObjectURL(preview.blobUrl);
              setPreview(null);
            }
          }}
        >
          <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle>{preview?.title ?? 'Prévia'}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 min-h-0">
              {preview?.url || preview?.blobUrl ? (
                <iframe
                  title="Prévia do PDF"
                  src={preview.url ?? preview.blobUrl}
                  className="h-full w-full bg-background"
                />
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
