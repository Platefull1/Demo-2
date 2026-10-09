'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoja } from '@/contexts/LojaContext';
import { Plus, X, AlertTriangle } from 'lucide-react';
import {
  DadosPessoaisFields,
  ComposicaoSalarialForm,
  buildComposicaoPayload,
  buildDadosPessoaisPayload,
  type ComposicaoSalarialValues,
  type DadosPessoaisValues,
} from '@/components/rh/FuncionarioForm';
import { limparCPF } from '@/lib/validacoes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Cargo {
  id: string;
  nome: string;
  descricao?: string | null;
  ratPct: number;
}

interface Loja {
  id: string;
  nome: string;
  ativo: boolean;
}

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-5 pb-3 border-b border-border">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
    </div>
  );
}

export default function NovoFuncionarioPage() {
  const router = useRouter();
  const { lojas, lojaSelecionada } = useLoja();

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCargoModal, setShowCargoModal] = useState(false);
  const [showEmptyFieldsDialog, setShowEmptyFieldsDialog] = useState(false);
  const [emptyFieldsList, setEmptyFieldsList] = useState<string[]>([]);
  const [novoCargo, setNovoCargo] = useState('');
  const [novoCargoRat, setNovoCargoRat] = useState('2');
  const [savingCargo, setSavingCargo] = useState(false);

  const [folhaStatus, setFolhaStatus] = useState<'idle' | 'checking' | 'ok' | 'duplicate'>('idle');

  const checkNumeroFolha = useCallback(async (val: string) => {
    if (!val.trim()) { setFolhaStatus('idle'); return; }
    setFolhaStatus('checking');
    try {
      const res = await fetch(`/api/rh/funcionarios/verificar-numero-folha?numeroFolha=${encodeURIComponent(val.trim())}`);
      const data = await res.json();
      setFolhaStatus(data.disponivel ? 'ok' : 'duplicate');
    } catch { setFolhaStatus('idle'); }
  }, []);

  const [dadosPessoais, setDadosPessoais] = useState<DadosPessoaisValues>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    dataAdmissao: new Date().toISOString().split('T')[0],
    numeroFolha: '',
  });
  const [composicao, setComposicao] = useState<ComposicaoSalarialValues>({
    salarioBase: '',
    cargoResponsabilidade: false,
    valorAlimentacao: '',
    valorVT: '',
    bonificacaoAssiduidade: '',
  });
  const [cargoId, setCargoId] = useState('');
  const [lojaId, setLojaId] = useState(lojaSelecionada?.id ?? '');
  const [escala, setEscala] = useState<'6x1' | '5x2'>('6x1');
  const [turno, setTurno] = useState<'manhã' | 'tarde' | 'noite' | 'integral'>('manhã');
  const [horarioEntrada, setHorarioEntrada] = useState('08:00');
  const [horarioSaida, setHorarioSaida] = useState('17:00');
  const [horarioDigest, setHorarioDigest] = useState('08:00');
  const [diasFolga, setDiasFolga] = useState<string[]>([]);
  const [domingoFolga, setDomingoFolga] = useState<string>('1');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    fetch('/api/rh/cargos')
      .then((r) => r.json())
      .then(setCargos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lojaSelecionada && !lojaId) setLojaId(lojaSelecionada.id);
  }, [lojaSelecionada, lojaId]);

  useEffect(() => {
    const t = setTimeout(() => checkNumeroFolha(dadosPessoais.numeroFolha), 500);
    return () => clearTimeout(t);
  }, [dadosPessoais.numeroFolha, checkNumeroFolha]);

  const toggleDiaFolga = (dia: string) => {
    setDiasFolga((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const parseMoney = (v: string) => parseFloat(v.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;

  const checkEmptyFields = (): string[] => {
    const empty: string[] = [];
    if (!dadosPessoais.nome.trim()) empty.push('Nome completo');
    if (!limparCPF(dadosPessoais.cpf)) empty.push('CPF');
    if (!dadosPessoais.dataNascimento) empty.push('Data de nascimento');
    if (!dadosPessoais.dataAdmissao) empty.push('Data de admissão');
    if (!cargoId) empty.push('Cargo');
    if (!lojaId) empty.push('Loja');
    if (parseMoney(composicao.salarioBase) <= 0) empty.push('Salário base');
    return empty;
  };

  const doSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...buildDadosPessoaisPayload(dadosPessoais),
        ...buildComposicaoPayload(composicao),
        cargoId,
        lojaId,
        escala,
        turno,
        horarioEntrada,
        horarioSaida,
        horarioDigest,
        diasFolga,
        domingoFolga,
        observacoes: observacoes || null,
      };

      const res = await fetch('/api/rh/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setErrors({ submit: err.error ?? 'Erro ao cadastrar funcionário' });
        return;
      }

      router.push('/rh/funcionarios');
    } catch {
      setErrors({ submit: 'Erro de conexão. Tente novamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const empty = checkEmptyFields();
    if (empty.length > 0) {
      setEmptyFieldsList(empty);
      setShowEmptyFieldsDialog(true);
      return;
    }
    await doSubmit();
  };

  const handleConfirmContinue = async () => {
    setShowEmptyFieldsDialog(false);
    await doSubmit();
  };

  const handleSaveCargo = async () => {
    if (!novoCargo.trim()) return;
    setSavingCargo(true);
    try {
      const res = await fetch('/api/rh/cargos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoCargo.trim(), ratPct: parseFloat(novoCargoRat) || 2 }),
      });
      if (res.ok) {
        const created: Cargo = await res.json();
        setCargos((prev) => [...prev, created]);
        setCargoId(created.id);
        setShowCargoModal(false);
        setNovoCargo('');
        setNovoCargoRat('2');
      }
    } catch {
      /* silently fail */
    } finally {
      setSavingCargo(false);
    }
  };

  const inputCls =
    'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const labelCls = 'block text-xs text-muted-foreground mb-1.5';
  const chipSelected =
    'border-primary bg-accent text-accent-foreground';
  const chipIdle =
    'border-border text-muted-foreground hover:border-muted-foreground/40';

  return (
    <div className="space-y-6">
      {showEmptyFieldsDialog && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-warning shrink-0" />
              <h3 className="text-base font-semibold text-foreground">Campos vazios</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Ainda existem campos vazios. Gostaria de continuar mesmo assim?
            </p>
            <ul className="space-y-1.5">
              {emptyFieldsList.map((field) => (
                <li key={field} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-warning shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowEmptyFieldsDialog(false)}
              >
                Voltar e preencher
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={submitting}
                onClick={handleConfirmContinue}
              >
                {submitting ? 'Cadastrando...' : 'Continuar assim'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCargoModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">Novo cargo</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setShowCargoModal(false)}
              >
                <X className="size-4 text-muted-foreground" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Nome do cargo *</label>
                <Input
                  value={novoCargo}
                  onChange={(e) => setNovoCargo(e.target.value)}
                  placeholder="Ex: Pizzaiolo"
                />
              </div>
              <div>
                <label className={labelCls}>RAT % (risco de acidente de trabalho)</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="3"
                  value={novoCargoRat || ''}
                  onChange={(e) => setNovoCargoRat(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowCargoModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1"
                disabled={savingCargo || !novoCargo.trim()}
                onClick={handleSaveCargo}
              >
                {savingCargo ? 'Salvando...' : 'Criar cargo'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Novo funcionário"
        description="Preencha os dados para cadastrar"
        actions={
          <Button type="button" variant="outline" onClick={() => router.push('/rh/funcionarios')}>
            Voltar
          </Button>
        }
      />

      {errors.submit && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
          {errors.submit}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <Card className="p-4 md:p-6">
          <SectionTitle title="Dados pessoais" />
          <DadosPessoaisFields
            values={dadosPessoais}
            onChange={(p) => setDadosPessoais((prev) => ({ ...prev, ...p }))}
            errors={errors}
            folhaStatus={folhaStatus}
          />
        </Card>

        <Card className="p-4 md:p-6">
          <SectionTitle title="Cargo e lotação" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cargo</label>
              <div className="flex gap-2">
                <select
                  value={cargoId}
                  onChange={(e) => setCargoId(e.target.value)}
                  className={cn(inputCls, 'flex-1')}
                >
                  <option value="">Selecionar...</option>
                  {cargos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => setShowCargoModal(true)}
                  title="Criar novo cargo"
                >
                  <Plus className="size-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Loja</label>
              <select
                value={lojaId}
                onChange={(e) => setLojaId(e.target.value)}
                className={inputCls}
              >
                <option value="">Selecionar...</option>
                {lojas.map((l: Loja) => (
                  <option key={l.id} value={l.id}>
                    {l.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Observações</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre o funcionário..."
                rows={3}
                className={cn(inputCls, 'h-auto py-2 resize-none')}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <SectionTitle title="Composição salarial" />
          <ComposicaoSalarialForm
            values={composicao}
            onChange={(p) => setComposicao((prev) => ({ ...prev, ...p }))}
            errors={errors}
            parseMoney={parseMoney}
          />
        </Card>

        <Card className="p-4 md:p-6">
          <SectionTitle title="Escala de trabalho" />
          <div className="space-y-5">
            <div>
              <label className={labelCls}>Regime de escala</label>
              <div className="flex gap-3">
                {(['6x1', '5x2'] as const).map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEscala(e)}
                    className={cn(
                      'flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors',
                      escala === e ? chipSelected : chipIdle
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Turno</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['manhã', 'tarde', 'noite', 'integral'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTurno(t)}
                    className={cn(
                      'py-2.5 rounded-lg text-sm font-medium border capitalize transition-colors',
                      turno === t ? chipSelected : chipIdle
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Horário de entrada</label>
                <input
                  type="time"
                  value={horarioEntrada}
                  onChange={(e) => {
                    const v = e.target.value;
                    setHorarioEntrada(v);
                    setHorarioDigest((prev) => (prev === horarioEntrada ? v : prev));
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Horário de saída</label>
                <input
                  type="time"
                  value={horarioSaida}
                  onChange={(e) => setHorarioSaida(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Horário do resumo de tarefas (WhatsApp)</label>
              <input
                type="time"
                value={horarioDigest}
                onChange={(e) => setHorarioDigest(e.target.value)}
                className={inputCls}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Horário em que o bot envia a lista de tarefas do dia. Padrão: horário de entrada.
              </p>
            </div>

            <div>
              <label className={labelCls}>
                Dias de folga fixos ({diasFolga.length} dia{diasFolga.length !== 1 ? 's' : ''})
              </label>
              <div className="flex flex-wrap gap-2">
                {DIAS_SEMANA.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDiaFolga(dia)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-xs font-medium border transition-colors',
                      diasFolga.includes(dia) ? chipSelected : chipIdle
                    )}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Domingo de folga no mês (DSR)</label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: '1', label: '1º domingo' },
                    { value: '2', label: '2º domingo' },
                    { value: '3', label: '3º domingo' },
                    { value: '4', label: '4º domingo' },
                    { value: 'ultimo', label: 'Último domingo' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDomingoFolga(opt.value)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium border transition-colors',
                      domingoFolga === opt.value ? chipSelected : chipIdle
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/rh/funcionarios')}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={submitting}>
            {submitting ? 'Cadastrando...' : 'Cadastrar funcionário'}
          </Button>
        </div>
      </form>
    </div>
  );
}
