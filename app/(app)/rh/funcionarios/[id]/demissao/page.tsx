'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileDown,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AVISO_DIAS_CORRIDOS,
  DESCONTOS_RESCISAO,
  DIAS_SUGESTAO_EXPERIENCIA,
  EMPRESA_CONTRATANTE,
  LEMBRETE_INDENIZACAO_ADICIONAL,
  LEMBRETE_RH_CONTATO,
  RESCISAO_STATUS_LABELS,
  TIPO_AVISO_LABELS,
  TIPO_RESCISAO_LABELS,
  VENCIMENTOS_RESCISAO,
  type RescisaoCatalogItem,
  type UnidadeRescisaoItem,
} from '@/lib/rh/rescisao-config';
import {
  calcTempoDeCasa,
  deveDestacarIndenizacaoAdicional,
  diasDeCasa,
  formatYmdBr,
  sugerirDatasAviso,
  type RescisaoItemValor,
} from '@/lib/rh/rescisao';
import { precisaDatasAviso } from '@/lib/rh/rescisao-validation';

type TipoRescisaoKey = keyof typeof TIPO_RESCISAO_LABELS;
type TipoAvisoKey = keyof typeof TIPO_AVISO_LABELS;

type RescisaoDto = {
  id: string;
  funcionarioId: string;
  status: 'RASCUNHO' | 'FINALIZADA';
  empresa: string;
  codigoSnapshot: string | null;
  nomeSnapshot: string;
  dataAdmissaoSnapshot: string | null;
  salarioSnapshot: number;
  dataDesligamento: string;
  cumpreAviso: boolean | null;
  descontaAviso: boolean | null;
  inicioAviso: string | null;
  terminoAviso: string | null;
  possuiEstabilidade: boolean | null;
  tipoEstabilidade: string | null;
  foiTransferido: boolean | null;
  empresaOrigem: string | null;
  tipoRescisao: TipoRescisaoKey | null;
  tipoAviso: TipoAvisoKey | null;
  motivo: string | null;
  vencimentos: RescisaoItemValor[];
  descontos: RescisaoItemValor[];
};

type FuncionarioDto = {
  id: string;
  nome: string;
  ativo: boolean;
  numeroFolha?: string | null;
  dataAdmissao?: string | null;
  salarioBase?: number;
  cargo?: { id: string; nome: string } | null;
  loja?: { id: string; nome: string } | null;
};

type Permissions = { canEdit: boolean; canFinalize: boolean };

type FormState = {
  dataDesligamento: string;
  cumpreAviso: boolean | null;
  descontaAviso: boolean | null;
  inicioAviso: string | null;
  terminoAviso: string | null;
  possuiEstabilidade: boolean | null;
  tipoEstabilidade: string;
  foiTransferido: boolean | null;
  empresaOrigem: string;
  tipoRescisao: TipoRescisaoKey | null;
  tipoAviso: TipoAvisoKey | null;
  motivo: string;
  vencimentos: RescisaoItemValor[];
  descontos: RescisaoItemValor[];
};

const AUTOSAVE_MS = 800;

function moneyFmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

function mergeCatalogItems(
  catalog: RescisaoCatalogItem[],
  saved: RescisaoItemValor[] | undefined,
): RescisaoItemValor[] {
  const byChave = new Map((saved ?? []).map((i) => [i.chave, i]));
  const fromCatalog = catalog.map((c) => {
    const prev = byChave.get(c.chave);
    return {
      chave: c.chave,
      descricao: c.descricao,
      unidade: c.unidade,
      codigo: c.codigo ?? null,
      valor: prev?.valor ?? '',
    };
  });
  const extras = (saved ?? []).filter(
    (i) => i.chave.startsWith('extra_') || !catalog.some((c) => c.chave === i.chave),
  );
  return [...fromCatalog, ...extras];
}

function rescisaoToForm(r: RescisaoDto): FormState {
  return {
    dataDesligamento: r.dataDesligamento,
    cumpreAviso: r.cumpreAviso,
    descontaAviso: r.descontaAviso,
    inicioAviso: r.inicioAviso,
    terminoAviso: r.terminoAviso,
    possuiEstabilidade: r.possuiEstabilidade,
    tipoEstabilidade: r.tipoEstabilidade ?? '',
    foiTransferido: r.foiTransferido,
    empresaOrigem: r.empresaOrigem ?? '',
    tipoRescisao: r.tipoRescisao,
    tipoAviso: r.tipoAviso,
    motivo: r.motivo ?? '',
    vencimentos: mergeCatalogItems(VENCIMENTOS_RESCISAO, r.vencimentos),
    descontos: mergeCatalogItems(DESCONTOS_RESCISAO, r.descontos),
  };
}

function formToPayload(form: FormState) {
  return {
    dataDesligamento: form.dataDesligamento,
    cumpreAviso: form.cumpreAviso,
    descontaAviso: form.descontaAviso,
    inicioAviso: form.inicioAviso,
    terminoAviso: form.terminoAviso,
    possuiEstabilidade: form.possuiEstabilidade,
    tipoEstabilidade: form.tipoEstabilidade.trim() || null,
    foiTransferido: form.foiTransferido,
    empresaOrigem: form.empresaOrigem.trim() || null,
    tipoRescisao: form.tipoRescisao,
    tipoAviso: form.tipoAviso,
    motivo: form.motivo.trim() || null,
    vencimentos: form.vencimentos.map((i) => ({
      ...i,
      valor: i.valor === '' || i.valor == null ? null : i.valor,
    })),
    descontos: form.descontos.map((i) => ({
      ...i,
      valor: i.valor === '' || i.valor == null ? null : i.valor,
    })),
  };
}

function unidadePlaceholder(u: UnidadeRescisaoItem) {
  if (u === 'horas') return 'HH:MM';
  if (u === 'reais') return 'R$ 0,00';
  if (u === 'percentual') return '%';
  return '0';
}

function SimNao({
  value,
  onChange,
  disabled,
  name,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  name: string;
}) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label={name}>
      <Button
        type="button"
        size="sm"
        variant={value === true ? 'default' : 'outline'}
        disabled={disabled}
        aria-checked={value === true}
        role="radio"
        onClick={() => onChange(true)}
      >
        Sim
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === false ? 'default' : 'outline'}
        disabled={disabled}
        aria-checked={value === false}
        role="radio"
        onClick={() => onChange(false)}
      >
        Não
      </Button>
    </div>
  );
}

function ChoiceList<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'flex items-start gap-3 rounded-md border border-border px-3 py-2 text-sm cursor-pointer',
            value === opt.value ? 'bg-accent border-l-2 border-l-primary' : 'hover:bg-muted/50',
            disabled && 'opacity-60 pointer-events-none',
          )}
        >
          <input
            type="radio"
            className="mt-1 accent-[var(--primary)]"
            checked={value === opt.value}
            disabled={disabled}
            onChange={() => onChange(opt.value)}
          />
          <span className="text-foreground">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function ItensTabela({
  titulo,
  items,
  onChange,
  onAdd,
  showCodigo,
  disabled,
}: {
  titulo: string;
  items: RescisaoItemValor[];
  onChange: (next: RescisaoItemValor[]) => void;
  onAdd: () => void;
  showCodigo?: boolean;
  disabled?: boolean;
}) {
  const update = (idx: number, patch: Partial<RescisaoItemValor>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {showCodigo ? (
                  <th className="py-2 pr-2 text-xs text-muted-foreground font-medium w-16">
                    Cód.
                  </th>
                ) : null}
                <th className="py-2 pr-2 text-xs text-muted-foreground font-medium">
                  Descrição
                </th>
                <th className="py-2 text-xs text-muted-foreground font-medium w-[140px] text-right">
                  Quantidade / Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const isExtra = item.chave.startsWith('extra_');
                return (
                  <tr key={item.chave} className="border-b border-border/60">
                    {showCodigo ? (
                      <td className="py-2 pr-2 align-middle">
                        {isExtra ? (
                          <Input
                            value={item.codigo ?? ''}
                            disabled={disabled}
                            placeholder="—"
                            className="h-8 w-16"
                            onChange={(e) =>
                              update(idx, { codigo: e.target.value || null })
                            }
                          />
                        ) : (
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {item.codigo ?? '—'}
                          </span>
                        )}
                      </td>
                    ) : null}
                    <td className="py-2 pr-2 align-middle">
                      {isExtra ? (
                        <Input
                          value={item.descricao}
                          disabled={disabled}
                          placeholder="Descrição"
                          className="h-8"
                          onChange={(e) => update(idx, { descricao: e.target.value })}
                        />
                      ) : (
                        <span className="text-foreground">{item.descricao}</span>
                      )}
                    </td>
                    <td className="py-2 align-middle">
                      <Input
                        value={item.valor == null ? '' : String(item.valor)}
                        disabled={disabled}
                        placeholder={unidadePlaceholder(item.unidade)}
                        className="h-8 text-right tabular-nums"
                        onChange={(e) => update(idx, { valor: e.target.value })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!disabled ? (
          <Button type="button" variant="outline" size="sm" onClick={onAdd}>
            <Plus className="size-4" />
            {showCodigo ? 'Adicionar outro desconto' : 'Adicionar outro vencimento'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function DemissaoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const funcionarioId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rescisao, setRescisao] = useState<RescisaoDto | null>(null);
  const [funcionario, setFuncionario] = useState<FuncionarioDto | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({
    canEdit: false,
    canFinalize: false,
  });
  const [form, setForm] = useState<FormState | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);
  const [confirmCancelar, setConfirmCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipAutosaveRef = useRef(true);
  const finalizandoRef = useRef(false);
  const formRef = useRef<FormState | null>(null);
  const rescisaoStatusRef = useRef<RescisaoDto['status'] | null>(null);
  formRef.current = form;
  rescisaoStatusRef.current = rescisao?.status ?? null;

  const readOnly = rescisao?.status === 'FINALIZADA' || !permissions.canEdit;

  const applyPayload = useCallback(
    (json: {
      rescisao: RescisaoDto | null;
      funcionario: FuncionarioDto;
      permissions: Permissions;
    }) => {
      setFuncionario(json.funcionario);
      setPermissions(json.permissions);
      setRescisao(json.rescisao);
      setDirty(false);
      setSaveState('idle');
      if (json.rescisao) {
        skipAutosaveRef.current = true;
        setForm(rescisaoToForm(json.rescisao));
      } else {
        setForm(null);
      }
    },
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao carregar');

      if (!json.rescisao && json.funcionario?.ativo && json.permissions?.canEdit) {
        const created = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao`, {
          method: 'POST',
        });
        const createdJson = await created.json();
        if (!created.ok && created.status !== 409) {
          throw new Error(createdJson.error || 'Falha ao criar rascunho');
        }
        applyPayload(createdJson);
        return;
      }

      if (json.rescisao?.status === 'RASCUNHO' && json.snapshotDesatualizado && json.permissions?.canEdit) {
        const patched = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        const patchedJson = await patched.json();
        if (!patched.ok) throw new Error(patchedJson.error || 'Falha ao atualizar snapshot');
        applyPayload(patchedJson);
        return;
      }

      applyPayload(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, [applyPayload, funcionarioId]);

  useEffect(() => {
    void load();
  }, [load]);

  const patchForm = useCallback((patch: Partial<FormState>) => {
    setDirty(true);
    setSaveState('idle');
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const saveDraft = useCallback(
    async (silent = false) => {
      const current = formRef.current;
      if (
        finalizandoRef.current ||
        !current ||
        rescisaoStatusRef.current !== 'RASCUNHO' ||
        !permissions.canEdit
      ) {
        return false;
      }
      setSaveState('saving');
      if (!silent) setSaveError(null);
      try {
        const res = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formToPayload(current)),
        });
        const json = await res.json();
        if (res.status === 409) {
          setToast('Esta rescisão já foi finalizada');
          await load();
          return false;
        }
        if (!res.ok) throw new Error(json.error || 'Falha ao salvar');
        if (finalizandoRef.current) return false;
        setRescisao(json.rescisao);
        setDirty(false);
        setSaveState('saved');
        return true;
      } catch (e) {
        if (finalizandoRef.current) return false;
        setSaveState('error');
        setSaveError(e instanceof Error ? e.message : 'Erro ao salvar');
        return false;
      }
    },
    [funcionarioId, load, permissions.canEdit],
  );

  useEffect(() => {
    if (!form || readOnly || finalizandoRef.current) return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      void saveDraft(true);
    }, AUTOSAVE_MS);
    return () => {
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
    };
  }, [form, readOnly, saveDraft]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty || readOnly || finalizandoRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty, readOnly]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const onCumpreOuDesconta = (field: 'cumpreAviso' | 'descontaAviso', value: boolean) => {
    setDirty(true);
    setSaveState('idle');
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      const precisa = precisaDatasAviso(
        field === 'cumpreAviso' ? value : next.cumpreAviso,
        field === 'descontaAviso' ? value : next.descontaAviso,
      );
      if (precisa && !next.inicioAviso) {
        const sug = sugerirDatasAviso(next.dataDesligamento);
        next.inicioAviso = sug.inicioAviso;
        next.terminoAviso = sug.terminoAviso;
      }
      return next;
    });
  };

  const tempoCasa = useMemo(() => {
    if (!form || !rescisao) return '—';
    return calcTempoDeCasa(rescisao.dataAdmissaoSnapshot, form.dataDesligamento);
  }, [form, rescisao]);

  const diasCasa = useMemo(() => {
    if (!form || !rescisao) return null;
    return diasDeCasa(rescisao.dataAdmissaoSnapshot, form.dataDesligamento);
  }, [form, rescisao]);

  const destaqueLembrete = useMemo(() => {
    if (!form) return false;
    return deveDestacarIndenizacaoAdicional(form.tipoRescisao, form.dataDesligamento);
  }, [form]);

  const semAdmissao = Boolean(rescisao && !rescisao.dataAdmissaoSnapshot);

  const handleFinalizar = async () => {
    const current = formRef.current;
    if (!current || !permissions.canFinalize) return;

    // Cancela debounce pendente — o body do finalizar já grava o estado atual
    if (autosaveRef.current) {
      clearTimeout(autosaveRef.current);
      autosaveRef.current = null;
    }
    finalizandoRef.current = true;
    skipAutosaveRef.current = true;
    setFinalizando(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao/finalizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToPayload(current)),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao finalizar');
      setConfirmFinalizar(false);
      setDirty(false);
      setSaveState('idle');
      setRescisao(json.rescisao);
      setForm(rescisaoToForm(json.rescisao));
      setFuncionario((f) => (f ? { ...f, ativo: false } : f));
      setToast('Rescisão finalizada');
    } catch (e) {
      finalizandoRef.current = false;
      setSaveError(e instanceof Error ? e.message : 'Erro ao finalizar');
    } finally {
      setFinalizando(false);
    }
  };

  const handleGerarPdf = async () => {
    setPdfLoading(true);
    setSaveError(null);
    try {
      // Garante rascunho salvo antes do PDF (se ainda editável)
      if (rescisaoStatusRef.current === 'RASCUNHO' && dirty && permissions.canEdit) {
        if (autosaveRef.current) {
          clearTimeout(autosaveRef.current);
          autosaveRef.current = null;
        }
        const ok = await saveDraft(false);
        if (!ok && rescisaoStatusRef.current === 'RASCUNHO') {
          throw new Error(saveError || 'Salve o rascunho antes de gerar o PDF');
        }
      }
      const res = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao/pdf`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Falha ao gerar PDF');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] ??
        'rescisao.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Erro ao gerar PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCancelar = async () => {
    setCancelando(true);
    try {
      const res = await fetch(`/api/rh/funcionarios/${funcionarioId}/rescisao`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Falha ao cancelar');
      router.push('/rh/funcionarios');
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Erro ao cancelar');
      setConfirmCancelar(false);
    } finally {
      setCancelando(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !funcionario) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" size="sm" onClick={() => router.push('/rh/funcionarios')}>
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Alert variant="destructive">
          <AlertTitle>Não foi possível abrir a demissão</AlertTitle>
          <AlertDescription>{error ?? 'Funcionário não encontrado'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!rescisao || !form) {
    return (
      <div className="space-y-4">
        <Button type="button" variant="outline" size="sm" onClick={() => router.push('/rh/funcionarios')}>
          <ArrowLeft className="size-4" />
          Voltar
        </Button>
        <Alert>
          <AlertTitle>Nenhuma rescisão encontrada</AlertTitle>
          <AlertDescription>
            Este funcionário não tem rascunho nem rescisão finalizada.
            {!permissions.canEdit
              ? ' Você não tem permissão para iniciar uma demissão.'
              : null}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const mostrarDatasAviso = precisaDatasAviso(form.cumpreAviso, form.descontaAviso);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {toast ? (
          <div className="fixed bottom-6 right-6 z-50 rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground shadow-lg">
            {toast}
          </div>
        ) : null}

        <PageHeader
          title="Solicitação rescisão contrato de trabalho"
          description={`${rescisao.nomeSnapshot} · ${EMPRESA_CONTRATANTE}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={rescisao.status === 'FINALIZADA' ? 'default' : 'outline'}>
                {RESCISAO_STATUS_LABELS[rescisao.status]}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (dirty && !readOnly) {
                    const ok = window.confirm(
                      'Há alterações não salvas. Deseja sair mesmo assim?',
                    );
                    if (!ok) return;
                  }
                  router.push('/rh/funcionarios');
                }}
              >
                <ArrowLeft className="size-4" />
                Voltar
              </Button>
            </div>
          }
        />

        {saveError ? (
          <Alert variant="destructive">
            <AlertDescription>{saveError}</AlertDescription>
          </Alert>
        ) : null}

        {/* 2.1 Dados do colaborador */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Dados do colaborador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {semAdmissao ? (
              <Alert variant="warning">
                <AlertTitle>Data de admissão ausente</AlertTitle>
                <AlertDescription>
                  Corrija o cadastro antes de finalizar.{' '}
                  <Link
                    href={`/rh/funcionarios/${funcionarioId}`}
                    className="underline text-foreground"
                  >
                    Editar cadastro
                  </Link>
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <Field label="Empresa" value={rescisao.empresa || EMPRESA_CONTRATANTE} />
              <Field label="Código" value={rescisao.codigoSnapshot || '—'} />
              <Field label="Colaborador" value={rescisao.nomeSnapshot} />
              <Field
                label="Admissão"
                value={formatYmdBr(rescisao.dataAdmissaoSnapshot)}
              />
              <Field label="Salário" value={moneyFmt(rescisao.salarioSnapshot)} />
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Data de desligamento</Label>
                <DatePicker
                  value={form.dataDesligamento}
                  onChange={(ymd) => {
                    if (!ymd || readOnly) return;
                    patchForm({ dataDesligamento: ymd });
                  }}
                  disabled={readOnly}
                />
              </div>
              <Field label="Loja" value={funcionario.loja?.nome ?? '—'} />
              <Field label="Cargo" value={funcionario.cargo?.nome ?? '—'} />
              <Field label="Tempo de casa" value={tempoCasa} />
            </div>
          </CardContent>
        </Card>

        {/* 2.2 Perguntas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Perguntas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-foreground">Vai cumprir aviso prévio?</p>
              <SimNao
                name="cumpreAviso"
                value={form.cumpreAviso}
                disabled={readOnly}
                onChange={(v) => onCumpreOuDesconta('cumpreAviso', v)}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-foreground">Será descontado aviso prévio?</p>
              <SimNao
                name="descontaAviso"
                value={form.descontaAviso}
                disabled={readOnly}
                onChange={(v) => onCumpreOuDesconta('descontaAviso', v)}
              />
            </div>
            {mostrarDatasAviso ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Início do aviso</Label>
                  <DatePicker
                    value={form.inicioAviso ?? undefined}
                    onChange={(ymd) => {
                      if (readOnly) return;
                      const inicio = ymd || null;
                      let termino = form.terminoAviso;
                      if (inicio && !termino) {
                        termino = sugerirDatasAviso(inicio).terminoAviso;
                      }
                      patchForm({ inicioAviso: inicio, terminoAviso: termino });
                    }}
                    disabled={readOnly}
                  />
                  <p className="text-xs text-muted-foreground">
                    Sugestão: desligamento + {AVISO_DIAS_CORRIDOS} dias corridos (editável)
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Término do aviso</Label>
                  <DatePicker
                    value={form.terminoAviso ?? undefined}
                    min={form.inicioAviso ?? undefined}
                    onChange={(ymd) => {
                      if (readOnly) return;
                      patchForm({ terminoAviso: ymd || null });
                    }}
                    disabled={readOnly}
                  />
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Empregado possui algum tipo de estabilidade no emprego?
              </p>
              <SimNao
                name="possuiEstabilidade"
                value={form.possuiEstabilidade}
                disabled={readOnly}
                onChange={(v) => patchForm({ possuiEstabilidade: v })}
              />
              {form.possuiEstabilidade ? (
                <Input
                  value={form.tipoEstabilidade}
                  disabled={readOnly}
                  placeholder="Tipo de estabilidade"
                  onChange={(e) => patchForm({ tipoEstabilidade: e.target.value })}
                />
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm text-foreground">
                Foi transferido de empresa ou grupo econômico?
              </p>
              <SimNao
                name="foiTransferido"
                value={form.foiTransferido}
                disabled={readOnly}
                onChange={(v) => patchForm({ foiTransferido: v })}
              />
              {form.foiTransferido ? (
                <Input
                  value={form.empresaOrigem}
                  disabled={readOnly}
                  placeholder="Empresa de origem da transferência"
                  onChange={(e) => patchForm({ empresaOrigem: e.target.value })}
                />
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* 2.3 / 2.4 Tipos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tipo de rescisão</CardTitle>
            </CardHeader>
            <CardContent>
              <ChoiceList
                disabled={readOnly}
                value={form.tipoRescisao}
                onChange={(v) => patchForm({ tipoRescisao: v })}
                options={(Object.keys(TIPO_RESCISAO_LABELS) as TipoRescisaoKey[]).map(
                  (value) => ({ value, label: TIPO_RESCISAO_LABELS[value] }),
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tipo de aviso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {diasCasa != null && diasCasa < DIAS_SUGESTAO_EXPERIENCIA ? (
                <Alert variant="info">
                  <AlertDescription>
                    Menos de {DIAS_SUGESTAO_EXPERIENCIA} dias de casa — considere{' '}
                    <span className="text-foreground">
                      Término de contrato de experiência
                    </span>
                    .
                  </AlertDescription>
                </Alert>
              ) : null}
              <ChoiceList
                disabled={readOnly}
                value={form.tipoAviso}
                onChange={(v) => patchForm({ tipoAviso: v })}
                options={(Object.keys(TIPO_AVISO_LABELS) as TipoAvisoKey[]).map((value) => ({
                  value,
                  label: TIPO_AVISO_LABELS[value],
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* 2.5 Motivo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Motivo da rescisão</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.motivo}
              disabled={readOnly}
              rows={4}
              placeholder="Descreva o motivo"
              onChange={(e) => patchForm({ motivo: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* 2.6 Vencimentos / Descontos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ItensTabela
            titulo="Vencimentos"
            items={form.vencimentos}
            disabled={readOnly}
            onChange={(vencimentos) => patchForm({ vencimentos })}
            onAdd={() =>
              patchForm({
                vencimentos: [
                  ...form.vencimentos,
                  {
                    chave: `extra_${Date.now()}`,
                    descricao: '',
                    unidade: 'reais',
                    valor: '',
                  },
                ],
              })
            }
          />
          <ItensTabela
            titulo="Descontos"
            items={form.descontos}
            showCodigo
            disabled={readOnly}
            onChange={(descontos) => patchForm({ descontos })}
            onAdd={() =>
              patchForm({
                descontos: [
                  ...form.descontos,
                  {
                    chave: `extra_${Date.now()}`,
                    descricao: '',
                    unidade: 'reais',
                    codigo: '',
                    valor: '',
                  },
                ],
              })
            }
          />
        </div>

        {/* 2.7 Lembrete */}
        <Alert variant={destaqueLembrete ? 'warning' : 'info'}>
          <AlertTitle>Lembrete</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{LEMBRETE_INDENIZACAO_ADICIONAL}</p>
            <p className="text-xs">{LEMBRETE_RH_CONTATO}</p>
          </AlertDescription>
        </Alert>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between border-t border-border pt-4">
          <div className="text-xs text-muted-foreground">
            {readOnly
              ? null
              : saveState === 'saving'
                ? 'Salvando…'
                : dirty
                  ? 'Alterações não salvas'
                  : saveState === 'saved'
                    ? 'Salvo'
                    : saveState === 'error'
                      ? 'Falha ao salvar'
                      : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {rescisao.status === 'RASCUNHO' && permissions.canEdit ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void saveDraft(false)}
                  loading={saveState === 'saving'}
                >
                  <Save className="size-4" />
                  Salvar rascunho
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setConfirmCancelar(true)}
                >
                  <Trash2 className="size-4" />
                  Cancelar rascunho
                </Button>
              </>
            ) : null}

            <Button
              type="button"
              variant="outline"
              loading={pdfLoading}
              onClick={() => void handleGerarPdf()}
            >
              <FileDown className="size-4" />
              Gerar PDF
            </Button>

            {rescisao.status === 'RASCUNHO' ? (
              permissions.canFinalize ? (
                <Button type="button" onClick={() => setConfirmFinalizar(true)}>
                  <CheckCircle2 className="size-4" />
                  Finalizar rescisão
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button type="button" disabled>
                        <CheckCircle2 className="size-4" />
                        Finalizar rescisão
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Sem permissão para desativar funcionários
                  </TooltipContent>
                </Tooltip>
              )
            ) : null}
          </div>
        </div>

        <AlertDialog open={confirmFinalizar} onOpenChange={setConfirmFinalizar}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Finalizar rescisão?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="text-foreground">Colaborador:</span>{' '}
                    {rescisao.nomeSnapshot}
                  </p>
                  <p>
                    <span className="text-foreground">Desligamento:</span>{' '}
                    {formatYmdBr(form.dataDesligamento)}
                  </p>
                  <p>
                    <span className="text-foreground">Tipo de rescisão:</span>{' '}
                    {form.tipoRescisao
                      ? TIPO_RESCISAO_LABELS[form.tipoRescisao]
                      : '—'}
                  </p>
                  <p>
                    <span className="text-foreground">Tipo de aviso:</span>{' '}
                    {form.tipoAviso ? TIPO_AVISO_LABELS[form.tipoAviso] : '—'}
                  </p>
                  <p className="text-xs">
                    Após confirmar, o funcionário será desligado e a rescisão não poderá
                    ser editada.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={finalizando}>Voltar</AlertDialogCancel>
              <AlertDialogAction
                disabled={finalizando}
                onClick={(e) => {
                  e.preventDefault();
                  void handleFinalizar();
                }}
              >
                {finalizando ? 'Finalizando…' : 'Confirmar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={confirmCancelar} onOpenChange={setConfirmCancelar}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar rascunho?</AlertDialogTitle>
              <AlertDialogDescription>
                O rascunho será excluído. Esta ação não desliga o funcionário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={cancelando}>Voltar</AlertDialogCancel>
              <AlertDialogAction
                disabled={cancelando}
                className={cn('bg-destructive text-white hover:bg-destructive/90')}
                onClick={(e) => {
                  e.preventDefault();
                  void handleCancelar();
                }}
              >
                {cancelando ? 'Excluindo…' : 'Excluir rascunho'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground tabular-nums">{value}</p>
    </div>
  );
}
