'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  LogOut,
  ArrowLeft,
  ImageIcon,
  X,
  RefreshCw,
  Check,
  ChevronsUpDown,
  Store,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { nomeCurtoLoja } from '@/lib/ocorrencias-lojas';
import {
  CATEGORIA_CHIP_VALUES,
  CATEGORIA_LABELS,
  type CategoriaChip,
} from '@/lib/ocorrencias-categorias';
import {
  arquivosImagemDaClipboard,
  FOTO_FORMATO_NAO_SUPORTADO,
  isImageFile,
} from '@/lib/ocorrencias-clipboard';

interface Loja {
  id: string;
  nome: string;
}
interface Motoboy {
  id: string;
  nome: string;
}

type Etapa = 'loja' | 'formulario' | 'sucesso';

const MAX_LADO_PX = 1600;
const JPEG_QUALITY = 0.8;

function comprimirImagem(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_LADO_PX || height > MAX_LADO_PX) {
        if (width > height) {
          height = Math.round((height * MAX_LADO_PX) / width);
          width = MAX_LADO_PX;
        } else {
          width = Math.round((width * MAX_LADO_PX) / height);
          height = MAX_LADO_PX;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas não suportado'));
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Falha ao comprimir'));
          resolve(blob);
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Imagem inválida'));
    };
    img.src = url;
  });
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}


export default function NovaOcorrenciaClient({
  isOcorrenciasOnly,
  canView = false,
}: {
  isOcorrenciasOnly: boolean;
  canView?: boolean;
}) {
  const user = useUser({ or: 'return-null' });
  const router = useRouter();

  const [lojas, setLojas] = useState<Loja[]>([]);
  const [motoboys, setMotoboys] = useState<Motoboy[]>([]);
  const [carregandoOpcoes, setCarregandoOpcoes] = useState(true);

  const [etapa, setEtapa] = useState<Etapa>('loja');

  const [lojaSelecionada, setLojaSelecionada] = useState<Loja | null>(null);
  const [numeroPedidoSaipos, setNumeroPedidoSaipos] = useState('');
  const [numeroPedidoExterno, setNumeroPedidoExterno] = useState('');
  const [canalExterno, setCanalExterno] = useState<'IFOOD' | 'DELIVERY_DIRETO' | ''>('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [motoboyId, setMotoboyId] = useState('');
  const [motoboyOpen, setMotoboyOpen] = useState(false);
  const [erroMotoboys, setErroMotoboys] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaChip[]>([]);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ lojaNome: string; pedido: string } | null>(null);
  const [errosCampo, setErrosCampo] = useState<{
    saipos?: string;
    canal?: string;
    descricao?: string;
    foto?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const enviandoRef = useRef(false);
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  );

  useEffect(() => {
    fetch('/api/ocorrencias/set-mode', { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/ocorrencias/opcoes')
      .then((r) => r.json())
      .then((data) => setLojas(data.lojas || []))
      .catch(() => setLojas([]))
      .finally(() => setCarregandoOpcoes(false));
  }, []);

  const carregarMotoboys = (lojaId: string) => {
    setErroMotoboys(false);
    fetch(`/api/ocorrencias/opcoes?lojaId=${lojaId}`)
      .then((r) => {
        if (!r.ok) throw new Error('opcoes');
        return r.json();
      })
      .then((data) => setMotoboys(data.motoboys || []))
      .catch(() => {
        setMotoboys([]);
        setErroMotoboys(true);
      });
  };

  useEffect(() => {
    if (!lojaSelecionada) {
      setMotoboys([]);
      setErroMotoboys(false);
      return;
    }
    carregarMotoboys(lojaSelecionada.id);
  }, [lojaSelecionada]);

  function aplicarFoto(file: File) {
    if (!isImageFile(file)) {
      setErrosCampo((e) => ({ ...e, foto: FOTO_FORMATO_NAO_SUPORTADO }));
      return;
    }
    setFoto(file);
    const previewUrl = URL.createObjectURL(file);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(previewUrl);
    setErrosCampo((e) => ({ ...e, foto: undefined }));
  }

  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const { files, imageCount } = arquivosImagemDaClipboard(e);
      if (imageCount === 0) return;
      e.preventDefault();
      aplicarFoto(files[0]);
      if (imageCount > 1) {
        setErro('Várias imagens coladas — usando só a primeira.');
      }
    }
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fotoPreview]);

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) aplicarFoto(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setArrastando(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    aplicarFoto(file);
  }

  function removerFoto() {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFoto(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function selecionarLoja(loja: Loja) {
    setLojaSelecionada(loja);
    setMotoboyId('');
    setErrosCampo({});
    setErro(null);
    setEtapa('formulario');
  }

  function validar() {
    const next: typeof errosCampo = {};
    if (!numeroPedidoSaipos.trim()) {
      next.saipos = 'Informe o número do pedido Saipos';
    }
    if (numeroPedidoExterno.trim() && !canalExterno) {
      next.canal = 'Escolha o canal do pedido externo';
    }
    if (categorias.length === 0 && descricao.trim().length < 10) {
      next.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }
    setErrosCampo(next);
    return Object.keys(next).length === 0;
  }

  function toggleCategoria(chip: CategoriaChip) {
    setCategorias((prev) => {
      const next = prev.includes(chip)
        ? prev.filter((c) => c !== chip)
        : [...prev, chip];
      if (next.length > 0) {
        setErrosCampo((er) => ({ ...er, descricao: undefined }));
      }
      return next;
    });
  }

  async function handleSubmit() {
    if (enviandoRef.current) return;
    if (!validar() || !lojaSelecionada) return;
    enviandoRef.current = true;
    setEnviando(true);
    setErro(null);

    try {
      const fd = new FormData();
      fd.append('lojaId', lojaSelecionada.id);
      fd.append('numeroPedidoSaipos', numeroPedidoSaipos.trim());
      if (numeroPedidoExterno.trim()) {
        fd.append('numeroPedidoExterno', numeroPedidoExterno.trim());
        fd.append('canalExterno', canalExterno);
      }
      fd.append('descricao', descricao.trim());
      fd.append('categorias', JSON.stringify(categorias));
      if (motoboyId) fd.append('motoboyId', motoboyId);
      fd.append('idempotencyKey', idempotencyKeyRef.current);

      if (foto) {
        try {
          const fotoBlob = await comprimirImagem(foto);
          fd.append('foto', new File([fotoBlob], 'foto.jpg', { type: 'image/jpeg' }));
        } catch {
          fd.append('foto', foto);
        }
      }

      const res = await fetch('/api/ocorrencias', { method: 'POST', body: fd });
      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.status === 401) {
        setErro('Sessão expirada. Faça login novamente — os dados preenchidos foram mantidos.');
        return;
      }

      if (!res.ok) {
        setErro(data.error || 'Erro ao registrar ocorrência. Tente novamente.');
        return;
      }

      setSucesso({
        lojaNome: nomeCurtoLoja(lojaSelecionada.nome),
        pedido: numeroPedidoSaipos.trim(),
      });
      setEtapa('sucesso');
    } catch {
      setErro('Erro de rede. Verifique a conexão e tente novamente.');
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  }

  function novoRegistro() {
    setNumeroPedidoSaipos('');
    setNumeroPedidoExterno('');
    setCanalExterno('');
    setDescricao('');
    setCategorias([]);
    removerFoto();
    setMotoboyId('');
    setErro(null);
    setErrosCampo({});
    setSucesso(null);
    setLojaSelecionada(null);
    setEtapa('loja');
    enviandoRef.current = false;
    idempotencyKeyRef.current =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
  }

  const formularioSujo =
    etapa === 'formulario' &&
    Boolean(
      numeroPedidoSaipos ||
        numeroPedidoExterno ||
        descricao ||
        foto ||
        motoboyId ||
        categorias.length > 0,
    );

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!formularioSujo) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [formularioSujo]);

  async function handleLogout() {
    try {
      await fetch('/api/ocorrencias/set-mode', { method: 'DELETE' });
    } catch {
      // segue o logout mesmo se o cookie não limpar
    }
    if (user?.signOut) await user.signOut();
    router.push('/');
  }

  const motoboyLabel =
    motoboyId === ''
      ? 'Selecione (opcional)'
      : motoboys.find((m) => m.id === motoboyId)?.nome || 'Selecione (opcional)';

  const voltarHref = canView ? '/ocorrencias' : '/dashboard';

  const header = (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      {isOcorrenciasOnly ? (
        <Logo />
      ) : (
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>
      )}
      <div className="flex items-center gap-1">
        {!isOcorrenciasOnly && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <Link href={voltarHref}>
              <ArrowLeft className="h-4 w-4" />
              Voltar ao painel
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );

  if (etapa === 'sucesso' && sucesso) {
    return (
      <div className="flex flex-col min-h-screen">
        {header}
        <main className="flex-1 px-4 py-8 flex justify-center items-start">
          <div className="w-full max-w-[720px] rounded-xl border border-border bg-card p-6 md:p-8 mb-8 flex flex-col items-center gap-6">
            <p className="text-2xl font-semibold text-foreground text-center">
              Ocorrência registrada
            </p>
            <div className="text-sm text-muted-foreground text-center space-y-1">
              <p>
                Loja: <span className="text-foreground">{sucesso.lojaNome}</span>
              </p>
              <p>
                Pedido:{' '}
                <span className="text-foreground tabular-nums">{sucesso.pedido}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button onClick={novoRegistro} size="lg" className="flex-1">
                Registrar outra
              </Button>
              {canView && (
                <Button variant="outline" size="lg" asChild className="flex-1">
                  <Link href="/ocorrencias">Ver ocorrências</Link>
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (etapa === 'loja') {
    return (
      <div className="flex flex-col min-h-screen">
        {header}
        <main className="flex-1 px-4 py-8 flex justify-center items-start">
          <div className="w-full max-w-[720px] rounded-xl border border-border bg-card p-6 md:p-8 mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Qual loja?</h1>
            <p className="text-sm text-muted-foreground mb-6">Escolha a loja da ocorrência</p>

            {carregandoOpcoes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : lojas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma loja cadastrada.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lojas.map((loja) => (
                  <button
                    key={loja.id}
                    type="button"
                    onClick={() => selecionarLoja(loja)}
                    className="flex items-center gap-3 px-5 py-5 rounded-xl bg-background border border-border hover:border-primary text-left min-h-[88px] transition-colors"
                  >
                    <Store className="h-5 w-5 text-muted-foreground shrink-0" />
                    <span className="text-base font-semibold text-foreground">
                      {nomeCurtoLoja(loja.nome)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {header}

      <main className="flex-1 px-4 py-8 flex justify-center items-start">
        <div className="w-full max-w-[720px] h-fit rounded-xl border border-border bg-card p-6 md:p-8 mb-8 space-y-6">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-2.5">
            <span className="text-sm font-medium text-foreground">
              {lojaSelecionada ? nomeCurtoLoja(lojaSelecionada.nome) : ''}
            </span>
            <button
              type="button"
              onClick={() => setEtapa('loja')}
              className="text-xs text-primary hover:text-primary/80 font-medium min-h-9 px-2"
            >
              Trocar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Nº do pedido Saipos <span className="text-destructive">*</span>
              </label>
              <Input
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ex.: 12345"
                value={numeroPedidoSaipos}
                onChange={(e) => {
                  setNumeroPedidoSaipos(e.target.value.replace(/\D/g, ''));
                  setErrosCampo((er) => ({ ...er, saipos: undefined }));
                }}
                className="h-11 text-sm tabular-nums"
                aria-invalid={Boolean(errosCampo.saipos)}
              />
              {errosCampo.saipos && (
                <p className="text-xs text-destructive">{errosCampo.saipos}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Nº do pedido iFood / Delivery Direto
              </label>
              <Input
                inputMode="numeric"
                placeholder="Ex.: 987654"
                value={numeroPedidoExterno}
                onChange={(e) => {
                  setNumeroPedidoExterno(e.target.value);
                  if (!e.target.value) setCanalExterno('');
                  setErrosCampo((er) => ({ ...er, canal: undefined }));
                }}
                className="h-11 text-sm tabular-nums"
              />
              {numeroPedidoExterno.trim() && (
                <div className="flex gap-2 pt-1">
                  {(['IFOOD', 'DELIVERY_DIRETO'] as const).map((canal) => (
                    <button
                      key={canal}
                      type="button"
                      onClick={() => {
                        setCanalExterno(canal);
                        setErrosCampo((er) => ({ ...er, canal: undefined }));
                      }}
                      className={cn(
                        'flex-1 min-h-10 rounded-lg border text-sm font-medium',
                        canalExterno === canal
                          ? 'bg-accent border-primary text-accent-foreground'
                          : 'border-border text-muted-foreground',
                      )}
                    >
                      {canal === 'IFOOD' ? 'iFood' : 'Delivery Direto'}
                    </button>
                  ))}
                </div>
              )}
              {errosCampo.canal && (
                <p className="text-xs text-destructive">{errosCampo.canal}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">O que aconteceu?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CATEGORIA_CHIP_VALUES.map((chip) => {
                const selecionado = categorias.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    aria-pressed={selecionado}
                    onClick={() => toggleCategoria(chip)}
                    className={cn(
                      'min-h-10 rounded-lg border text-sm font-medium px-3 flex items-center justify-center gap-1.5',
                      selecionado
                        ? 'bg-accent border-primary text-accent-foreground'
                        : 'border-border text-foreground',
                    )}
                  >
                    {selecionado && (
                      <Check className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    {CATEGORIA_LABELS[chip]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              {categorias.length === 0 ? (
                <>
                  Descrição <span className="text-destructive">*</span>
                </>
              ) : (
                'Descrição (opcional)'
              )}
            </label>
            <Textarea
              placeholder="Descreva o que aconteceu"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                setErrosCampo((er) => ({ ...er, descricao: undefined }));
              }}
              rows={4}
              className="text-sm resize-none"
              aria-invalid={Boolean(errosCampo.descricao)}
            />
            {categorias.length === 0 && !errosCampo.descricao && (
              <p className="text-xs text-muted-foreground">
                Nenhum item selecionado — será registrada como Outros. Descreva o que aconteceu.
              </p>
            )}
            <div className="flex items-center justify-between gap-2">
              {errosCampo.descricao ? (
                <p className="text-xs text-destructive">{errosCampo.descricao}</p>
              ) : (
                <span />
              )}
              {categorias.length === 0 && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {descricao.trim().length}/10 mín.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Foto (opcional)
            </label>

            {fotoPreview && foto ? (
              <div className="flex items-center gap-3 rounded-xl border border-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fotoPreview}
                  alt="Preview da ocorrência"
                  className="h-16 w-16 rounded-md object-cover border border-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{foto.name}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatBytes(foto.size)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Trocar
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={removerFoto}>
                    <X className="h-4 w-4" />
                    Remover
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={handleDrop}
                className={cn(
                  'flex flex-col items-center justify-center gap-2 w-full min-h-[140px] rounded-xl border border-dashed px-4 py-6',
                  arrastando
                    ? 'border-primary bg-accent'
                    : 'border-border bg-background hover:border-primary',
                )}
              >
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm text-foreground text-center">
                  Clique, arraste ou cole (Ctrl+V) a foto aqui
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFotoChange}
            />
            {errosCampo.foto && (
              <p className="text-xs text-destructive">{errosCampo.foto}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Motoboy</label>
            <Popover open={motoboyOpen} onOpenChange={setMotoboyOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={motoboyOpen}
                  className="w-full h-11 justify-between font-normal text-sm"
                >
                  <span className={cn('truncate', motoboyId === '' && 'text-muted-foreground')}>
                    {motoboyLabel}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar motoboy…" />
                  <CommandList>
                    <CommandEmpty>Nenhum motoboy encontrado</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="nao-sei"
                        onSelect={() => {
                          setMotoboyId('');
                          setMotoboyOpen(false);
                        }}
                        className="min-h-11"
                      >
                        <Check
                          className={cn(
                            'h-4 w-4',
                            motoboyId === '' ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        Selecione (opcional)
                      </CommandItem>
                      {motoboys.map((m) => (
                        <CommandItem
                          key={m.id}
                          value={m.nome}
                          onSelect={() => {
                            setMotoboyId(m.id);
                            setMotoboyOpen(false);
                          }}
                          className="min-h-11"
                        >
                          <Check
                            className={cn(
                              'h-4 w-4',
                              motoboyId === m.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {m.nome}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {erroMotoboys ? (
              <div className="flex items-center gap-2">
                <p className="text-xs text-destructive">Não foi possível carregar motoboys.</p>
                {lojaSelecionada && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => carregarMotoboys(lojaSelecionada.id)}
                  >
                    Tentar de novo
                  </Button>
                )}
              </div>
            ) : motoboys.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum motoboy nesta loja</p>
            ) : null}
          </div>

          {erro && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {erro}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={enviando}
              size="lg"
              className="disabled:opacity-100 disabled:bg-muted disabled:text-muted-foreground"
            >
              {enviando ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Registrando…
                </>
              ) : (
                'Registrar ocorrência'
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
