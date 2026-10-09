'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckSquare,
  Download,
  FileText,
  Loader2,
  MessagesSquare,
  Search,
  Square,
} from 'lucide-react';
import ToolProtection from '@/components/auth/ToolProtection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SystemTool } from '@/types/admin';
import { cn } from '@/lib/utils';
import { ConversationMedia } from '../../_components/ConversationMedia';
import {
  buildGroupedList,
  CATEGORIA_DOT,
  CATEGORIA_LABELS,
  CATEGORIAS_COM_ENTREGADOR,
  flattenGroups,
  isGrupoComplaint,
  itemDisplayName,
  organizeReviewComplaints,
  periodLabel,
  ptDate,
  ptDateTime,
  type AtaFilter,
  type ComplaintConversation,
  type ComplaintReviewData,
  type ComplaintReviewItem,
  type ReviewCanalFilter,
} from '../../_lib/complaints-review';

function EtiquetaDot({ categoria }: { categoria: string | null | undefined }) {
  if (!categoria) return null;
  const label = CATEGORIA_LABELS[categoria] ?? categoria;
  const dot = CATEGORIA_DOT[categoria] ?? 'bg-muted-foreground';
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
      <span className={cn('size-1.5 rounded-full shrink-0', dot)} aria-hidden />
      {label}
    </span>
  );
}

function ReviewPageContent() {
  const params = useParams();
  const runId = String(params?.runId || '');

  const [data, setData] = useState<ComplaintReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [canal, setCanal] = useState<ReviewCanalFilter>('todas');
  const [lojaFilter, setLojaFilter] = useState<string>('__all__');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('__all__');
  const [ataFilter, setAtaFilter] = useState<AtaFilter>('todas');
  const [search, setSearch] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  const [conversation, setConversation] = useState<ComplaintConversation | null>(
    null,
  );
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);

  const load = useCallback(async () => {
    if (!runId) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/reports/complaints/${runId}/review`, {
        cache: 'no-store',
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível carregar a revisão.');
        setData(null);
        return;
      }
      setData(json as ComplaintReviewData);
    } catch {
      setMsg('Falha de rede ao carregar revisão.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [runId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setCanal('todas');
    setLojaFilter('__all__');
    setCategoriaFilter('__all__');
    setAtaFilter('todas');
    setSearch('');
    setSelectedId(null);
  }, [data?.id]);

  const organized = useMemo(
    () => (data ? organizeReviewComplaints(data.complaints, data.lojas ?? []) : null),
    [data],
  );

  const categoriasPresentes = useMemo(() => {
    if (!data) return [] as string[];
    const presentes = new Set<string>();
    for (const c of data.complaints) {
      if (c.categoria) presentes.add(c.categoria);
    }
    return Object.keys(CATEGORIA_LABELS).filter((k) => presentes.has(k));
  }, [data]);

  const groups = useMemo(() => {
    if (!organized) return [];
    return buildGroupedList(
      organized,
      canal,
      lojaFilter === '__all__' ? null : lojaFilter,
      categoriaFilter === '__all__' ? null : categoriaFilter,
      ataFilter,
      search,
    );
  }, [organized, canal, lojaFilter, categoriaFilter, ataFilter, search]);

  const flatVisible = useMemo(() => flattenGroups(groups), [groups]);
  const visibleIds = useMemo(() => flatVisible.map((c) => c.id), [flatVisible]);

  const selected = useMemo(
    () => data?.complaints.find((c) => c.id === selectedId) ?? null,
    [data, selectedId],
  );

  useEffect(() => {
    if (selectedId && !flatVisible.some((c) => c.id === selectedId)) {
      setSelectedId(flatVisible[0]?.id ?? null);
    }
  }, [flatVisible, selectedId]);

  const toggleConfirm = async (complaintId: string, next: boolean) => {
    if (!data) return;
    setTogglingId(complaintId);
    try {
      const res = await fetch(
        `/api/reports/complaints/complaints/${complaintId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ confirmadoPorHumano: next }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível salvar.');
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        const complaints = prev.complaints.map((c) =>
          c.id === complaintId ? { ...c, confirmadoPorHumano: next } : c,
        );
        return {
          ...prev,
          complaints,
          confirmadasCount: complaints.filter((c) => c.confirmadoPorHumano)
            .length,
        };
      });
    } catch {
      setMsg('Falha de rede ao salvar.');
    } finally {
      setTogglingId(null);
    }
  };

  const batchConfirm = async (ids: string[], next: boolean) => {
    if (!data || ids.length === 0) return;
    const targets = data.complaints.filter(
      (c) => ids.includes(c.id) && c.confirmadoPorHumano !== next,
    );
    for (const c of targets) {
      await toggleConfirm(c.id, next);
    }
  };

  const updateLoja = async (complaintId: string, lojaId: string | null) => {
    if (!data) return;
    try {
      const res = await fetch(
        `/api/reports/complaints/complaints/${complaintId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lojaId,
            lojaIdentificada: Boolean(lojaId),
            entregadorId: null,
          }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível salvar a loja.');
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          complaints: prev.complaints.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  lojaId,
                  lojaIdentificada: Boolean(lojaId),
                  entregadorId: null,
                }
              : c,
          ),
        };
      });
    } catch {
      setMsg('Falha de rede ao salvar a loja.');
    }
  };

  const updateCategoria = async (
    complaintId: string,
    categoria: string | null,
  ) => {
    if (!data) return;
    const clearsEntregador =
      !categoria || !CATEGORIAS_COM_ENTREGADOR.includes(categoria);
    try {
      const res = await fetch(
        `/api/reports/complaints/complaints/${complaintId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoria,
            ...(clearsEntregador ? { entregadorId: null } : {}),
          }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível salvar a etiqueta.');
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          complaints: prev.complaints.map((c) =>
            c.id === complaintId
              ? {
                  ...c,
                  categoria,
                  ...(clearsEntregador ? { entregadorId: null } : {}),
                }
              : c,
          ),
        };
      });
    } catch {
      setMsg('Falha de rede ao salvar a etiqueta.');
    }
  };

  const updateEntregador = async (
    complaintId: string,
    entregadorId: string | null,
  ) => {
    if (!data) return;
    try {
      const res = await fetch(
        `/api/reports/complaints/complaints/${complaintId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entregadorId }),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível salvar o entregador.');
        return;
      }
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          complaints: prev.complaints.map((c) =>
            c.id === complaintId ? { ...c, entregadorId } : c,
          ),
        };
      });
    } catch {
      setMsg('Falha de rede ao salvar o entregador.');
    }
  };

  const generateAta = async () => {
    if (!data) return;
    setGeneratingId(data.id);
    try {
      const res = await fetch(`/api/reports/complaints/${data.id}/document`, {
        method: 'POST',
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível gerar a ata.');
        return;
      }
      setData((prev) => (prev ? { ...prev, hasAta: true } : prev));
      setMsg('Ata gerada com sucesso. Use “Baixar ata” para obter o arquivo.');
    } catch {
      setMsg('Falha de rede ao gerar a ata.');
    } finally {
      setGeneratingId(null);
    }
  };

  const downloadAta = async () => {
    if (!data) return;
    setDownloadingId(data.id);
    try {
      const res = await fetch(`/api/reports/complaints/${data.id}/document`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        setMsg(json.error || 'Não foi possível baixar a ata.');
        return;
      }
      const filename =
        typeof json.filename === 'string' && json.filename.trim()
          ? json.filename.trim()
          : 'ata reuniao.docx';
      const blobRes = await fetch(json.url as string);
      if (!blobRes.ok) {
        setMsg('Não foi possível baixar o arquivo da ata.');
        return;
      }
      const blob = await blobRes.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setMsg('Falha de rede ao baixar a ata.');
    } finally {
      setDownloadingId(null);
    }
  };

  const openConversation = async (contactId: string) => {
    if (!data) return;
    setConversation(null);
    setLoadingConversation(true);
    setConversationOpen(true);
    try {
      const res = await fetch(
        `/api/reports/complaints/${data.id}/conversation?contactId=${encodeURIComponent(contactId)}`,
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(json.error || 'Não foi possível carregar a conversa.');
        setConversationOpen(false);
        return;
      }
      setConversation(json as ComplaintConversation);
    } catch {
      setMsg('Falha de rede ao carregar a conversa.');
      setConversationOpen(false);
    } finally {
      setLoadingConversation(false);
    }
  };

  const selectItem = (id: string) => {
    setSelectedId(id);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
      setDetailSheetOpen(true);
    }
  };

  const onListKeyDown = (e: ReactKeyboardEvent) => {
    if (!flatVisible.length) return;
    const idx = flatVisible.findIndex((c) => c.id === selectedId);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = flatVisible[Math.min(idx + 1, flatVisible.length - 1)] ?? flatVisible[0];
      selectItem(next.id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = flatVisible[Math.max(idx - 1, 0)] ?? flatVisible[0];
      selectItem(prev.id);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      if (selectedId) {
        e.preventDefault();
        const item = flatVisible.find((c) => c.id === selectedId);
        if (item) void toggleConfirm(item.id, !item.confirmadoPorHumano);
      }
    }
  };

  const canalTabs: { id: ReviewCanalFilter; label: string; count: number }[] =
    organized
      ? [
          { id: 'todas', label: 'Todas', count: organized.counts.total },
          { id: 'conversas', label: 'Conversas', count: organized.counts.conversas },
          { id: 'grupos', label: 'Grupos', count: organized.counts.grupos },
          { id: 'semLoja', label: 'Sem loja', count: organized.counts.semLoja },
        ]
      : [];

  const lojaOptions =
    canal === 'grupos'
      ? organized?.gruposPorLoja.map((g) => g.lojaKey) ?? []
      : canal === 'conversas'
        ? organized?.conversasPorLoja.map((g) => g.lojaKey) ?? []
        : organized?.lojaNames ?? [];

  const progressPct =
    data && data.complaints.length > 0
      ? Math.round((data.confirmadasCount / data.complaints.length) * 100)
      : 0;

  const detailPanel = (item: ComplaintReviewItem | null) => {
    if (!item || !data) {
      return (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-sm text-muted-foreground text-center">
            Selecione uma conversa para revisar
          </p>
        </div>
      );
    }
    const isGrupo = isGrupoComplaint(item);
    const lojaPendente = !item.lojaId || item.lojaIdentificada === false;
    const showEntregador = Boolean(
      item.categoria && CATEGORIAS_COM_ENTREGADOR.includes(item.categoria),
    );
    const riders = item.lojaId
      ? data.ridersPorLoja[item.lojaId] ?? []
      : [];

    return (
      <div className="h-full overflow-y-auto p-4 md:p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            {itemDisplayName(item)}
          </h2>
          {item.contactPhone && (
            <p className="text-sm text-muted-foreground">{item.contactPhone}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {[item.sessionLabel, isGrupo ? item.origemLabel || 'Grupo iFood' : 'Cliente']
              .filter(Boolean)
              .join(' · ')}
            {' · '}
            {ptDate(item.dataOcorrencia)}
            {item.numeroPedido ? ` · Pedido ${item.numeroPedido}` : ''}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
          <label
            htmlFor={`ata-${item.id}`}
            className="text-sm font-medium text-foreground"
          >
            Incluir na ata
          </label>
          <Switch
            id={`ata-${item.id}`}
            checked={item.confirmadoPorHumano}
            disabled={togglingId === item.id}
            onCheckedChange={(v) => void toggleConfirm(item.id, v)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Loja</label>
            <Select
              value={item.lojaId ?? '__none__'}
              onValueChange={(v) =>
                void updateLoja(item.id, v === '__none__' ? null : v)
              }
            >
              <SelectTrigger
                className={cn(
                  'h-9 text-sm',
                  lojaPendente && 'border-warning/50',
                )}
              >
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Selecione a loja —</SelectItem>
                {(data.lojas ?? []).map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Etiqueta</label>
            <Select
              value={item.categoria ?? '__none__'}
              onValueChange={(v) =>
                void updateCategoria(item.id, v === '__none__' ? null : v)
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Sem etiqueta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Sem etiqueta —</SelectItem>
                {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {showEntregador && (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Entregador</label>
              {!item.lojaId ? (
                <p className="text-xs text-warning py-2">
                  Selecione a loja para listar os entregadores
                </p>
              ) : (
                <Select
                  value={item.entregadorId ?? '__none__'}
                  onValueChange={(v) =>
                    void updateEntregador(item.id, v === '__none__' ? null : v)
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Não identificado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Não identificado —</SelectItem>
                    {riders.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1.5">Resumo</p>
          <p className="text-sm text-foreground whitespace-pre-wrap">{item.resumo}</p>
        </div>

        {item.evidencias.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {isGrupo ? 'Evidências (grupo iFood)' : 'Evidências (cliente)'}
            </p>
            {item.evidencias.map((ev) => (
              <blockquote
                key={ev.id}
                className="border-l-2 border-border pl-3 text-sm text-muted-foreground"
              >
                {ev.hasMedia ||
                ev.messageType === 'image' ||
                ev.messageType === 'sticker' ? (
                  <ConversationMedia
                    messageId={ev.id}
                    messageType={ev.messageType}
                  />
                ) : (
                  <p>
                    {ev.messageType !== 'text' && (
                      <span className="mr-1">[{ev.messageType}]</span>
                    )}
                    {ev.snippet}
                  </p>
                )}
              </blockquote>
            ))}
          </div>
        )}

        {!isGrupo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void openConversation(item.contactId)}
          >
            <MessagesSquare className="size-3.5" />
            Ver conversa completa
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 min-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="gap-1.5 -ml-2">
          <Link href="/relatorios?tab=reclamacoes">
            <ArrowLeft className="size-3.5" />
            Relatórios
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Revisão de reclamações"
        description={data ? periodLabel(data.periodStart) : 'Carregando…'}
        actions={
          data ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-[140px] space-y-1">
                <p className="text-xs text-muted-foreground tabular-nums">
                  {data.confirmadasCount} de {data.complaints.length} na ata
                </p>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={data.confirmadasCount < 1 || generatingId === data.id}
                onClick={() => void generateAta()}
              >
                {generatingId === data.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                {data.hasAta ? 'Regenerar ata' : 'Gerar ata'}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!data.hasAta || downloadingId === data.id}
                onClick={() => void downloadAta()}
              >
                {downloadingId === data.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Download className="size-3.5" />
                )}
                Baixar ata
              </Button>
            </div>
          ) : null
        }
      />

      {msg && (
        <p className="text-sm text-warning" role="alert">
          {msg}
        </p>
      )}

      {!loading && data && organized && (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ToggleGroup
            type="single"
            value={canal}
            onValueChange={(v) => {
              if (!v) return;
              setCanal(v as ReviewCanalFilter);
              if (v === 'semLoja') setLojaFilter('__all__');
            }}
            size="sm"
            className="w-full lg:w-fit flex-wrap"
          >
            {canalTabs.map((t) => (
              <ToggleGroupItem key={t.id} value={t.id} className="text-xs px-2.5">
                {t.label}
                <span className="tabular-nums opacity-80">{t.count}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="relative w-full sm:w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome, telefone, pedido"
                className="h-8 pl-8 text-sm"
              />
            </div>
            {canal !== 'semLoja' && lojaOptions.length > 0 && (
              <Select value={lojaFilter} onValueChange={setLojaFilter}>
                <SelectTrigger className="h-8 w-[140px] text-sm">
                  <SelectValue placeholder="Loja" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas as lojas</SelectItem>
                  {lojaOptions.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {categoriasPresentes.length > 0 && (
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="h-8 w-[140px] text-sm">
                  <SelectValue placeholder="Etiqueta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todas etiquetas</SelectItem>
                  {categoriasPresentes.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORIA_LABELS[cat] ?? cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select
              value={ataFilter}
              onValueChange={(v) => setAtaFilter(v as AtaFilter)}
            >
              <SelectTrigger className="h-8 w-[120px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="na_ata">Na ata</SelectItem>
                <SelectItem value="fora">Fora da ata</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="size-6 text-muted-foreground animate-spin" />
        </div>
      ) : !data || !organized ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          {msg || 'Revisão não encontrada.'}
        </p>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-0 border border-border rounded-xl overflow-hidden bg-card">
          {/* Lista */}
          <div
            className="flex flex-col border-r border-border min-h-[50vh] md:min-h-[calc(100vh-16rem)]"
            tabIndex={0}
            onKeyDown={onListKeyDown}
          >
            <div className="flex-1 overflow-y-auto">
              {groups.length === 0 ? (
                <p className="text-sm text-muted-foreground p-6 text-center">
                  Nenhuma reclamação neste filtro.
                </p>
              ) : (
                groups.map((g) => (
                  <div key={g.lojaKey}>
                    <div className="sticky top-0 z-[1] bg-muted/95 backdrop-blur px-3 py-1.5 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {g.lojaKey}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {g.items.length}
                      </span>
                    </div>
                    <ul>
                      {g.items.map((c) => {
                        const lojaPendente =
                          g.lojaKey === 'Sem loja' ||
                          !c.lojaId ||
                          c.lojaIdentificada === false;
                        const active = c.id === selectedId;
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => selectItem(c.id)}
                              className={cn(
                                'w-full text-left px-3 py-2.5 border-b border-border transition-colors',
                                active
                                  ? 'bg-accent border-l-2 border-l-primary'
                                  : 'hover:bg-muted/50 border-l-2 border-l-transparent',
                              )}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  role="checkbox"
                                  aria-checked={c.confirmadoPorHumano}
                                  aria-label={
                                    c.confirmadoPorHumano
                                      ? 'Remover da ata'
                                      : 'Incluir na ata'
                                  }
                                  tabIndex={0}
                                  className="mt-0.5 shrink-0 text-primary cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    void toggleConfirm(
                                      c.id,
                                      !c.confirmadoPorHumano,
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      void toggleConfirm(
                                        c.id,
                                        !c.confirmadoPorHumano,
                                      );
                                    }
                                  }}
                                >
                                  {togglingId === c.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                  ) : c.confirmadoPorHumano ? (
                                    <CheckSquare className="size-4" />
                                  ) : (
                                    <Square className="size-4 text-muted-foreground" />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium text-foreground truncate">
                                      {itemDisplayName(c)}
                                    </span>
                                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                                      {ptDate(c.dataOcorrencia)}
                                    </span>
                                    <EtiquetaDot categoria={c.categoria} />
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {c.resumo}
                                  </p>
                                  {lojaPendente && g.lojaKey === 'Sem loja' && (
                                    <p className="text-xs text-warning">
                                      Atribuir loja
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="shrink-0 border-t border-border bg-card px-3 py-2 space-y-1.5">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  disabled={visibleIds.length === 0}
                  onClick={() => void batchConfirm(visibleIds, true)}
                >
                  <CheckSquare className="size-3.5" />
                  Incluir todos desta visão
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  disabled={visibleIds.length === 0}
                  onClick={() => void batchConfirm(visibleIds, false)}
                >
                  <Square className="size-3.5" />
                  Remover desta visão
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ↑↓ navega · Espaço alterna na ata
              </p>
            </div>
          </div>

          {/* Detalhe desktop */}
          <div className="hidden md:block min-h-[calc(100vh-16rem)] bg-background">
            {detailPanel(selected)}
          </div>
        </div>
      )}

      {/* Detalhe mobile */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent
          side="bottom"
          className="h-[85vh] p-0 overflow-hidden md:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Detalhe da reclamação</SheetTitle>
          </SheetHeader>
          {detailPanel(selected)}
        </SheetContent>
      </Sheet>

      {/* Conversa completa */}
      <Sheet open={conversationOpen} onOpenChange={setConversationOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg p-0 flex flex-col"
        >
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-base">
              {conversation?.clientLabel || 'Conversa completa'}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {loadingConversation ? (
              <div className="flex justify-center py-16">
                <Loader2 className="size-5 text-muted-foreground animate-spin" />
              </div>
            ) : conversation?.messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma mensagem neste período.
              </p>
            ) : (
              <div className="space-y-3">
                {conversation?.truncated && (
                  <p className="text-xs text-warning">
                    Conversa longa: mostrando as primeiras 500 mensagens do
                    período.
                  </p>
                )}
                {conversation?.messages.map((m) => {
                  const isClient = m.speaker === 'CLIENTE';
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'rounded-lg border px-3 py-2',
                        isClient
                          ? 'border-border bg-muted/40'
                          : 'border-border bg-card',
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase text-muted-foreground">
                          {m.speaker}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ptDateTime(m.timestamp)}
                        </span>
                      </div>
                      {m.messageType === 'image' ||
                      m.messageType === 'sticker' ||
                      m.hasMedia ? (
                        <>
                          <ConversationMedia
                            messageId={m.id}
                            messageType={m.messageType}
                          />
                          {m.snippet &&
                            !/^\[.+\]$/.test(m.snippet) &&
                            !m.snippet.startsWith('/9j/') && (
                              <p className="text-sm text-foreground whitespace-pre-wrap break-words mt-1.5">
                                {m.snippet}
                              </p>
                            )}
                        </>
                      ) : (
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                          {m.snippet === `[${m.messageType}]` ? '' : m.snippet}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ReclamacoesReviewPage() {
  return (
    <ToolProtection
      tool={SystemTool.AGENDAMENTO_RELATORIOS}
      toolName="Central de Relatórios"
    >
      <div className="px-6 py-6 md:px-8">
        <ReviewPageContent />
      </div>
    </ToolProtection>
  );
}
