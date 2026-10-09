'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  MessageSquareWarning,
  FileText,
  FileBarChart2,
  CheckSquare,
  Trash2,
  Settings2,
} from 'lucide-react';
import ToolProtection from '@/components/auth/ToolProtection';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SystemTool } from '@/types/admin';
import { periodLabel as periodLabelShared } from './_lib/complaints-review';

// ── Types ──────────────────────────────────────────────────────────────────

type EscopoLoja = 'POR_LOJA' | 'CONSOLIDADO' | 'AMBOS';
type Fonte = 'SAIPOS_DASHBOARD';
type TabId = 'agendados' | 'reclamacoes';

interface CatalogField {
  key: string;
  label: string;
  grupo: string;
  ordem: number;
}

interface UltimaExecucao {
  id: string;
  status: 'SUCESSO' | 'FALHA';
  executadoEm: string;
  erro: string | null;
}

interface ReportRow {
  id: string;
  nome: string;
  fonte: Fonte;
  horario: string;
  escopoLoja: EscopoLoja;
  destinoWhatsapp: string;
  sessionSlot: number | null;
  ativo: boolean;
  campos: { campoKey: string; ordem: number }[];
  ultimaExecucao: UltimaExecucao | null;
}

interface ComplaintRunRow {
  id: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  totalConversas: number | null;
  conversasProcessadas?: number | null;
  totalReclamacoes: number | null;
  ataStoragePath: string | null;
  executadoEm: string;
  erro: string | null;
  confirmadasCount?: number;
}


interface IfoodGroupRow {
  id: string;
  groupWhatsAppId: string;
  lojaSlug: string;
  lojaNome: string;
  sessionSlot: number;
  ativo: boolean;
  createdAt: string;
}

interface WppGroupOpt {
  id: string;
  name: string;
}

interface ReportForm {
  nome: string;
  fonte: Fonte;
  horario: string;
  escopoLoja: EscopoLoja;
  destinoWhatsapp: string;
  sessionSlot: number | null;
  ativo: boolean;
  /** Ordem de seleção preservada */
  campos: string[];
}

interface WhatsSessionOpt {
  slot: number;
  label: string;
  isConnected: boolean;
  connectedNumber: string | null;
}

const EMPTY_FORM: ReportForm = {
  nome: '',
  fonte: 'SAIPOS_DASHBOARD',
  horario: '23:30',
  escopoLoja: 'AMBOS',
  destinoWhatsapp: '',
  sessionSlot: null,
  ativo: true,
  campos: [],
};

const ESCOPO_LABELS: Record<EscopoLoja, string> = {
  POR_LOJA: 'Por loja',
  CONSOLIDADO: 'Consolidado',
  AMBOS: 'Ambos',
};

const GRUPO_LABELS: Record<string, string> = {
  geral: 'Geral',
  cupons: 'Cupons',
  ticket_medio: 'Ticket médio',
  canal: 'Canais',
};

const GRUPO_ORDER = ['geral', 'cupons', 'ticket_medio', 'canal'];

const inputCls =
  'w-full bg-background border border-input rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors';

const labelCls = 'text-xs font-medium text-muted-foreground mb-1.5 block';

const sectionCls = 'text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3';

// ── Helpers ────────────────────────────────────────────────────────────────

function ptDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

const periodLabel = periodLabelShared;

function statusBadge(status: string) {
  if (status === 'CONCLUIDO')
    return 'text-success bg-success/10 border-success/20';
  if (status === 'ERRO')
    return 'text-destructive bg-destructive/10 border-destructive/20';
  if (status === 'EM_ANDAMENTO')
    return 'text-foreground bg-muted border-border';
  return 'text-warning bg-warning/10 border-warning/20';
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl shadow-lg my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Página ─────────────────────────────────────────────────────────────────

function RelatoriosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<TabId>(() =>
    searchParams.get('tab') === 'reclamacoes' ? 'reclamacoes' : 'agendados',
  );
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [complaintRuns, setComplaintRuns] = useState<ComplaintRunRow[]>([]);
  const [catalog, setCatalog] = useState<CatalogField[]>([]);
  const [sessions, setSessions] = useState<WhatsSessionOpt[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ifoodGroups, setIfoodGroups] = useState<IfoodGroupRow[]>([]);
  const [loadingIfoodGroups, setLoadingIfoodGroups] = useState(false);
  const [showAddIfoodGroup, setShowAddIfoodGroup] = useState(false);
  const [ifoodFormSlot, setIfoodFormSlot] = useState<number | null>(null);
  const [ifoodFormGroupId, setIfoodFormGroupId] = useState('');
  const [ifoodFormLojaNome, setIfoodFormLojaNome] = useState('');
  const [ifoodFormLojaSlug, setIfoodFormLojaSlug] = useState('');
  const [wppGroupsForSlot, setWppGroupsForSlot] = useState<WppGroupOpt[]>([]);
  const [loadingWppGroups, setLoadingWppGroups] = useState(false);
  const [savingIfoodGroup, setSavingIfoodGroup] = useState(false);
  const [deletingIfoodGroupId, setDeletingIfoodGroupId] = useState<string | null>(null);
  const [reclassifying, setReclassifying] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ReportRow | null>(null);
  const [form, setForm] = useState<ReportForm>(EMPTY_FORM);

  const catalogByGrupo = useMemo(() => {
    const map = new Map<string, CatalogField[]>();
    for (const c of catalog) {
      const list = map.get(c.grupo) ?? [];
      list.push(c);
      map.set(c.grupo, list);
    }
    const ordered = GRUPO_ORDER.filter((g) => map.has(g));
    for (const g of map.keys()) {
      if (!ordered.includes(g)) ordered.push(g);
    }
    return ordered.map((grupo) => ({
      grupo,
      label: GRUPO_LABELS[grupo] ?? grupo,
      campos: (map.get(grupo) ?? []).sort((a, b) => a.ordem - b.ordem),
    }));
  }, [catalog]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [resReports, resCatalog, resSessions] = await Promise.all([
        fetch('/api/admin/reports'),
        fetch('/api/admin/reports/catalog'),
        fetch('/api/whatsapp-sessions?scope=tenant'),
      ]);
      if (resReports.ok) {
        const data = await resReports.json();
        setReports(Array.isArray(data) ? data : []);
      }
      if (resCatalog.ok) {
        const data = await resCatalog.json();
        setCatalog(Array.isArray(data) ? data : []);
      }
      if (resSessions.ok) {
        const data = await resSessions.json();
        setSessions(Array.isArray(data.sessions) ? data.sessions : []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const fetchComplaintRuns = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoadingComplaints(true);
    try {
      const res = await fetch('/api/reports/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaintRuns(Array.isArray(data) ? data : []);
      }
    } catch {
      // silent
    } finally {
      if (!opts?.silent) setLoadingComplaints(false);
    }
  }, []);

  const fetchIfoodGroups = useCallback(async () => {
    setLoadingIfoodGroups(true);
    try {
      const res = await fetch('/api/reports/complaints/ifood-groups');
      if (res.ok) {
        const data = await res.json();
        setIfoodGroups(Array.isArray(data.groups) ? data.groups : []);
      }
    } catch {
      // silent
    } finally {
      setLoadingIfoodGroups(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'reclamacoes') {
      fetchComplaintRuns();
      fetchIfoodGroups();
    }
  }, [tab, fetchComplaintRuns, fetchIfoodGroups]);

  useEffect(() => {
    if (!showAddIfoodGroup || !ifoodFormSlot) {
      setWppGroupsForSlot([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingWppGroups(true);
      setIfoodFormGroupId('');
      try {
        const res = await fetch(`/api/whatsapp-sessions/slot/${ifoodFormSlot}/groups?scope=tenant`);
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const raw = Array.isArray(data.groups) ? data.groups : [];
        setWppGroupsForSlot(
          raw.map((g: { id?: string; name?: string }) => ({
            id: String(g.id || ''),
            name: String(g.name || g.id || 'Grupo'),
          })).filter((g: WppGroupOpt) => g.id),
        );
      } catch {
        if (!cancelled) setWppGroupsForSlot([]);
      } finally {
        if (!cancelled) setLoadingWppGroups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [showAddIfoodGroup, ifoodFormSlot]);

  async function saveIfoodGroup() {
    if (!ifoodFormSlot || !ifoodFormGroupId || !ifoodFormLojaNome.trim()) {
      alert('Selecione sessão, grupo e informe o nome da loja.');
      return;
    }
    setSavingIfoodGroup(true);
    try {
      const res = await fetch('/api/reports/complaints/ifood-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionSlot: ifoodFormSlot,
          groupWhatsAppId: ifoodFormGroupId,
          lojaNome: ifoodFormLojaNome.trim(),
          lojaSlug: ifoodFormLojaSlug.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Falha ao salvar grupo.');
        return;
      }
      setShowAddIfoodGroup(false);
      setIfoodFormGroupId('');
      setIfoodFormLojaNome('');
      setIfoodFormLojaSlug('');
      await fetchIfoodGroups();
    } catch {
      alert('Falha de rede ao salvar grupo.');
    } finally {
      setSavingIfoodGroup(false);
    }
  }

  async function deleteIfoodGroup(id: string) {
    if (!confirm('Remover este grupo da captura de reclamações iFood?')) return;
    setDeletingIfoodGroupId(id);
    try {
      const res = await fetch(`/api/reports/complaints/ifood-groups/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Falha ao remover.');
        return;
      }
      await fetchIfoodGroups();
    } catch {
      alert('Falha de rede ao remover.');
    } finally {
      setDeletingIfoodGroupId(null);
    }
  }

  useEffect(() => {
    if (tab !== 'reclamacoes') return;
    const live = complaintRuns.some(
      (r) => r.status === 'PROCESSANDO' || r.status === 'EM_ANDAMENTO',
    );
    if (!live) return;
    const ms = complaintRuns.some((r) => r.status === 'PROCESSANDO') ? 2500 : 15000;
    const id = window.setInterval(() => fetchComplaintRuns({ silent: true }), ms);
    return () => window.clearInterval(id);
  }, [tab, complaintRuns, fetchComplaintRuns]);

  async function handleDownloadAta(runId: string) {
    setDownloadingId(runId);
    try {
      const res = await fetch(`/api/reports/complaints/${runId}/document`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        alert(data.error || 'Não foi possível baixar a ata.');
        return;
      }
      const filename =
        typeof data.filename === 'string' && data.filename.trim()
          ? data.filename.trim()
          : 'ata reuniao.docx';
      const blobRes = await fetch(data.url);
      if (!blobRes.ok) {
        alert('Não foi possível baixar o arquivo da ata.');
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
      alert('Falha de rede ao baixar a ata.');
    } finally {
      setDownloadingId(null);
    }
  }

  function openReview(runId: string) {
    router.push(`/relatorios/reclamacoes/${runId}`);
  }

  async function handleReclassify() {
    if (reclassifying) return;
    setReclassifying(true);
    try {
      const res = await fetch('/api/reports/complaints/reclassify', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Não foi possível reclassificar.');
        return;
      }
      alert(data.mensagem || 'Reclassificação concluída.');
    } catch {
      alert('Falha de rede ao reclassificar.');
    } finally {
      setReclassifying(false);
    }
  }

  async function handleGenerateAta(runId: string) {
    setGeneratingId(runId);
    try {
      const res = await fetch(`/api/reports/complaints/${runId}/document`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || 'Não foi possível gerar a ata.');
        return;
      }
      setComplaintRuns((runs) =>
        runs.map((r) =>
          r.id === runId ? { ...r, ataStoragePath: data.ataStoragePath ?? 'generated' } : r,
        ),
      );
      alert('Ata gerada com sucesso. Use "Baixar ata" para obter o arquivo.');
    } catch {
      alert('Falha de rede ao gerar a ata.');
    } finally {
      setGeneratingId(null);
    }
  }

  async function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
    try {
      const res = await fetch('/api/whatsapp-sessions?scope=tenant');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sessions)) setSessions(data.sessions);
      }
    } catch {
      // keep list already carregada
    }
  }

  function openEdit(r: ReportRow) {
    setEditing(r);
    setForm({
      nome: r.nome,
      fonte: r.fonte,
      horario: r.horario,
      escopoLoja: r.escopoLoja,
      destinoWhatsapp: r.destinoWhatsapp,
      sessionSlot: r.sessionSlot ?? null,
      ativo: r.ativo,
      campos: [...r.campos]
        .sort((a, b) => a.ordem - b.ordem)
        .map((c) => c.campoKey),
    });
    setError(null);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
  }

  function setField<K extends keyof ReportForm>(key: K, value: ReportForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCampo(key: string) {
    setForm((f) => {
      if (f.campos.includes(key)) {
        return { ...f, campos: f.campos.filter((k) => k !== key) };
      }
      return { ...f, campos: [...f.campos, key] };
    });
  }

  function validate(): string | null {
    if (!form.nome.trim()) return 'O nome é obrigatório.';
    if (!/^\d{2}:\d{2}$/.test(form.horario)) return 'Horário inválido. Use HH:mm.';
    if (!form.destinoWhatsapp.trim()) return 'Informe o destino WhatsApp (ID do grupo/contato).';
    if (!form.sessionSlot) return 'Escolha a sessão WhatsApp que envia este relatório.';
    if (form.campos.length === 0) return 'Selecione ao menos um campo do catálogo.';
    return null;
  }

  async function handleSave() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        nome: form.nome.trim(),
        horario: form.horario,
        escopoLoja: form.escopoLoja,
        destinoWhatsapp: form.destinoWhatsapp.trim(),
        sessionSlot: form.sessionSlot,
        ativo: form.ativo,
        campos: form.campos,
      };

      const res = await fetch(
        editing ? `/api/admin/reports/${editing.id}` : '/api/admin/reports',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Erro ao salvar relatório.');
        return;
      }

      closeModal();
      fetchAll();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(r: ReportRow) {
    setTogglingId(r.id);
    try {
      const res = await fetch(`/api/admin/reports/${r.id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, ...updated } : x)));
      }
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="w-full px-6 py-6 md:px-8 space-y-6">
      <PageHeader
        title="Central de Relatórios"
        description="Relatórios Saipos agendados e atas mensais de reclamações"
        actions={
          tab === 'agendados' ? (
            <Button type="button" size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Novo relatório
            </Button>
          ) : null
        }
      />

      <ToggleGroup
        type="single"
        value={tab}
        onValueChange={(v) => {
          if (v) setTab(v as TabId);
        }}
        size="sm"
        className="w-fit"
      >
        <ToggleGroupItem value="agendados" className="text-xs px-3">
          Agendados (Saipos)
        </ToggleGroupItem>
        <ToggleGroupItem value="reclamacoes" className="text-xs px-3 gap-1.5">
          <MessageSquareWarning className="size-3.5" />
          Reclamações
        </ToggleGroupItem>
      </ToggleGroup>

        {tab === 'reclamacoes' ? (
          <div className="space-y-6">
            {/* Configuração grupos iFood */}
            <div className="bg-card border border-border rounded-2xl p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                    Grupos iFood (por loja)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                    Grupos WhatsApp onde os atendentes registram reclamações de pedidos iFood
                    (foto + legenda). Só esses grupos são capturados — não qualquer grupo da sessão.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddIfoodGroup((v) => !v);
                    if (!ifoodFormSlot && sessions[0]) setIfoodFormSlot(sessions[0].slot);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-warning border border-primary/30 hover:bg-primary/25"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar grupo
                </button>
              </div>

              {showAddIfoodGroup && (
                <div className="mb-4 rounded-xl border border-border bg-background p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Sessão WhatsApp</label>
                      <select
                        className={inputCls}
                        value={ifoodFormSlot ?? ''}
                        onChange={(e) =>
                          setIfoodFormSlot(e.target.value ? Number(e.target.value) : null)
                        }
                      >
                        <option value="">Selecione…</option>
                        {sessions.map((s) => (
                          <option key={s.slot} value={s.slot}>
                            {s.label || `Sessão ${s.slot}`}
                            {s.isConnected ? '' : ' (offline)'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Grupo</label>
                      <select
                        className={inputCls}
                        value={ifoodFormGroupId}
                        disabled={!ifoodFormSlot || loadingWppGroups}
                        onChange={(e) => setIfoodFormGroupId(e.target.value)}
                      >
                        <option value="">
                          {loadingWppGroups
                            ? 'Carregando grupos…'
                            : !ifoodFormSlot
                              ? 'Escolha a sessão'
                              : wppGroupsForSlot.length === 0
                                ? 'Nenhum grupo nesta sessão'
                                : 'Selecione o grupo…'}
                        </option>
                        {wppGroupsForSlot.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Nome da loja</label>
                      <input
                        className={inputCls}
                        placeholder="ex: AHU, Pilarzinho…"
                        value={ifoodFormLojaNome}
                        onChange={(e) => setIfoodFormLojaNome(e.target.value)}
                        list="ifood-lojas-sugeridas"
                      />
                      <datalist id="ifood-lojas-sugeridas">
                        <option value="AHU" />
                        <option value="Pilarzinho" />
                        <option value="Portão" />
                        <option value="Uberaba" />
                      </datalist>
                    </div>
                    <div>
                      <label className={labelCls}>Slug (opcional)</label>
                      <input
                        className={inputCls}
                        placeholder="ex: ahu, pilarzinho…"
                        value={ifoodFormLojaSlug}
                        onChange={(e) => setIfoodFormLojaSlug(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddIfoodGroup(false)}
                      className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={savingIfoodGroup}
                      onClick={() => void saveIfoodGroup()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground disabled:opacity-50"
                    >
                      {savingIfoodGroup ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : null}
                      Salvar
                    </button>
                  </div>
                </div>
              )}

              {loadingIfoodGroups ? (
                <div className="flex py-4 justify-center">
                  <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                </div>
              ) : ifoodGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum grupo cadastrado ainda.</p>
              ) : (
                <ul className="space-y-2">
                  {ifoodGroups.map((g) => {
                    const session = sessions.find((s) => s.slot === g.sessionSlot);
                    return (
                      <li
                        key={g.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-foreground font-medium">
                            {g.lojaNome}
                            <span className="text-xs text-muted-foreground font-normal ml-2">
                              ({g.lojaSlug})
                            </span>
                            {!g.ativo && (
                              <span className="ml-2 text-xs text-destructive">inativo</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {session?.label || `Sessão ${g.sessionSlot}`} · {g.groupWhatsAppId}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={deletingIfoodGroupId === g.id}
                          onClick={() => void deleteIfoodGroup(g.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-red-300/90 border border-destructive/20 hover:bg-destructive/10 disabled:opacity-50"
                        >
                          {deletingIfoodGroupId === g.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          Remover
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Reclassificação retroativa */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={reclassifying}
                onClick={handleReclassify}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Classifica por categoria e loja as reclamações que ainda não foram classificadas"
              >
                {reclassifying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Settings2 className="w-3.5 h-3.5" />
                )}
                {reclassifying ? 'Reclassificando…' : 'Reclassificar histórico'}
              </button>
            </div>

            {loadingComplaints ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          ) : complaintRuns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <MessageSquareWarning className="w-8 h-8 text-warning/50" />
              <p className="text-foreground font-medium">Nenhuma revisão de reclamações ainda</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Após a classificação mensal, revise as reclamações detectadas, marque quais
                entram na ata e gere o documento manualmente.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Período
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Reclamações
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Executado em
                      </th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaintRuns.map((run) => {
                      const canReview =
                        run.status === 'CONCLUIDO' ||
                        run.status === 'EM_ANDAMENTO' ||
                        run.status === 'PROCESSANDO';
                      const hasComplaints = (run.totalReclamacoes ?? 0) > 0;
                      const confirmadas = run.confirmadasCount ?? 0;
                      const canGenerate = canReview && hasComplaints && confirmadas > 0;
                      const hasAta = Boolean(run.ataStoragePath);

                      return (
                      <tr key={run.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3.5 font-medium text-foreground">
                          {periodLabel(run.periodStart)}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {run.totalReclamacoes ?? 0}
                          <span className="text-xs text-muted-foreground ml-1">
                            {run.status === 'EM_ANDAMENTO' || run.status === 'PROCESSANDO'
                              ? 'reclamações até agora'
                              : `/ ${run.totalConversas ?? '—'} conversas`}
                          </span>
                          {confirmadas > 0 && (
                            <span className="block text-xs text-success mt-0.5">
                              {confirmadas} na ata
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex w-fit px-2 py-0.5 rounded-lg text-xs border ${statusBadge(run.status)}`}
                            >
                              {run.status}
                            </span>
                            {run.status === 'PROCESSANDO' && (
                              <span className="text-xs text-warning/90">
                                {run.conversasProcessadas ?? 0} de {run.totalConversas ?? '—'}{' '}
                                conversas processadas
                              </span>
                            )}
                            {run.status === 'EM_ANDAMENTO' && (
                              <span className="text-xs text-muted-foreground">
                                Acumulando ao longo do mês — revise quando quiser
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {ptDateTime(run.executadoEm)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {run.status === 'PROCESSANDO' && !hasComplaints && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground border border-border opacity-60">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Aguardando término
                              </span>
                            )}
                            {canReview && hasComplaints && (
                              <button
                                type="button"
                                onClick={() => openReview(run.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-foreground border border-border hover:border-primary/30 transition-colors"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                                Revisar
                              </button>
                            )}
                            {canReview && hasComplaints && (
                              <button
                                type="button"
                                disabled={!canGenerate || generatingId === run.id}
                                title={
                                  canGenerate
                                    ? hasAta
                                      ? 'Regenerar ata com as marcações atuais'
                                      : 'Gerar ata com reclamações marcadas'
                                    : 'Marque ao menos uma reclamação na revisão'
                                }
                                onClick={() => handleGenerateAta(run.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/15 text-warning border border-primary/30 hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              >
                                {generatingId === run.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <FileText className="w-3.5 h-3.5" />
                                )}
                                {hasAta ? 'Regenerar ata' : 'Gerar ata'}
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={!hasAta || downloadingId === run.id}
                              onClick={() => handleDownloadAta(run.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              {downloadingId === run.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              Baixar ata
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center">
              <FileBarChart2 className="w-8 h-8 text-warning/50" />
            </div>
            <div>
              <p className="text-foreground font-medium">Nenhum relatório cadastrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crie o primeiro relatório agendado do Saipos
              </p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo relatório
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Fonte
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Escopo
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Ativo
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Última execução
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr
                      key={r.id}
                      className={`border-b border-border last:border-0 ${
                        !r.ativo ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-foreground">{r.nome}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {r.campos.length} campo{r.campos.length === 1 ? '' : 's'}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-lg bg-muted text-xs border border-border">
                          {r.fonte === 'SAIPOS_DASHBOARD' ? 'Saipos' : r.fonte}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          {r.horario}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {ESCOPO_LABELS[r.escopoLoja] ?? r.escopoLoja}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggle(r)}
                          disabled={togglingId === r.id}
                          title={r.ativo ? 'Desativar' : 'Ativar'}
                          className="inline-flex items-center gap-1.5 text-xs disabled:opacity-40"
                        >
                          {togglingId === r.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : r.ativo ? (
                            <ToggleRight className="w-5 h-5 text-success" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className={r.ativo ? 'text-success' : 'text-muted-foreground'}>
                            {r.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        {r.ultimaExecucao ? (
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium ${
                                r.ultimaExecucao.status === 'SUCESSO'
                                  ? 'text-success'
                                  : 'text-destructive'
                              }`}
                            >
                              {r.ultimaExecucao.status === 'SUCESSO' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              {r.ultimaExecucao.status === 'SUCESSO' ? 'Sucesso' : 'Falha'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {ptDateTime(r.ultimaExecucao.executadoEm)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Nunca executado</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => openEdit(r)}
                          title="Editar"
                          className="inline-flex w-8 h-8 rounded-lg items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Modal criar/editar */}
      {showModal && (
        <Modal
          title={editing ? 'Editar relatório' : 'Novo relatório'}
          onClose={closeModal}
        >
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              <p className={sectionCls}>Configuração</p>

              <div>
                <label className={labelCls}>
                  Nome <span className="text-destructive">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  value={form.nome}
                  onChange={(e) => setField('nome', e.target.value)}
                  placeholder="Ex: Relatório diário Saipos"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Fonte</label>
                  <select value={form.fonte} disabled className={`${inputCls} opacity-70 cursor-not-allowed`}>
                    <option value="SAIPOS_DASHBOARD">Saipos Dashboard</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Única fonte disponível por enquanto
                  </p>
                </div>

                <div>
                  <label className={labelCls}>
                    Horário <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.horario}
                    onChange={(e) => setField('horario', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Escopo de loja <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={form.escopoLoja}
                    onChange={(e) => setField('escopoLoja', e.target.value as EscopoLoja)}
                    className={inputCls}
                  >
                    <option value="POR_LOJA">Por loja</option>
                    <option value="CONSOLIDADO">Consolidado</option>
                    <option value="AMBOS">Ambos</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Ativo</label>
                  <button
                    type="button"
                    onClick={() => setField('ativo', !form.ativo)}
                    className="flex items-center gap-2.5 mt-1 select-none"
                  >
                    <span
                      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
                        form.ativo ? 'bg-primary' : 'bg-muted'
                      }`}
                      role="switch"
                      aria-checked={form.ativo}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: form.ativo ? '18px' : '2px' }}
                      />
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {form.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelCls}>
                  Enviar via <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.sessionSlot ?? ''}
                  onChange={(e) =>
                    setField('sessionSlot', e.target.value ? Number(e.target.value) : null)
                  }
                  className={inputCls}
                >
                  <option value="">Selecione a sessão</option>
                  {sessions.map((s) => (
                    <option key={s.slot} value={s.slot}>
                      {s.label}
                      {s.connectedNumber ? ` · ${s.connectedNumber}` : ''}
                      {s.isConnected ? '' : ' (desconectada)'}
                    </option>
                  ))}
                </select>
                {form.sessionSlot &&
                  sessions.find((s) => s.slot === form.sessionSlot) &&
                  !sessions.find((s) => s.slot === form.sessionSlot)?.isConnected && (
                    <p className="text-xs text-warning mt-1.5">
                      Esta sessão está desconectada. Reconecte em Conexões para o envio funcionar.
                    </p>
                  )}
                {sessions.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Nenhuma sessão cadastrada. Conecte um número em Conexões.
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Destino WhatsApp <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.destinoWhatsapp}
                  onChange={(e) => setField('destinoWhatsapp', e.target.value)}
                  placeholder="ID do grupo ou contato (ex: 120363...@g.us)"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Campos do catálogo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className={sectionCls + ' mb-0'}>Campos do relatório</p>
                <span className="text-xs text-muted-foreground">
                  {form.campos.length} selecionado{form.campos.length === 1 ? '' : 's'}
                </span>
              </div>

              {catalog.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Catálogo vazio. Rode o seed do SaiposFieldCatalog.
                </p>
              ) : (
                <div className="space-y-5">
                  {catalogByGrupo.map(({ grupo, label, campos }) => (
                    <div key={grupo}>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {campos.map((c) => {
                          const checked = form.campos.includes(c.key);
                          return (
                            <label
                              key={c.key}
                              className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${
                                checked
                                  ? 'bg-primary/10 border-primary/40'
                                  : 'bg-background border-border hover:border-muted-foreground/30'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleCampo(c.key)}
                                className="mt-0.5 accent-primary"
                              />
                              <span className="text-sm text-foreground leading-snug">
                                {c.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-border">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar relatório'}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}

export default function RelatoriosPage() {
  return (
    <ToolProtection
      tool={SystemTool.AGENDAMENTO_RELATORIOS}
      toolName="Central de Relatórios"
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        }
      >
        <RelatoriosContent />
      </Suspense>
    </ToolProtection>
  );
}
