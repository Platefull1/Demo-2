'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
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
  Camera,
  ImageIcon,
  X,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronsUpDown,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

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

export default function NovaOcorrenciaClient() {
  const user = useUser({ or: 'redirect' });
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

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<{ lojaNome: string; pedido: string } | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!lojaSelecionada) {
      setMotoboys([]);
      return;
    }
    fetch(`/api/ocorrencias/opcoes?lojaId=${lojaSelecionada.id}`)
      .then((r) => r.json())
      .then((data) => setMotoboys(data.motoboys || []))
      .catch(() => setMotoboys([]));
  }, [lojaSelecionada]);

  const formularioValido =
    lojaSelecionada !== null &&
    numeroPedidoSaipos.trim().length > 0 &&
    descricao.trim().length >= 10 &&
    foto !== null &&
    (numeroPedidoExterno.trim() === '' || canalExterno !== '');

  function selecionarLoja(loja: Loja) {
    setLojaSelecionada(loja);
    setMotoboyId('');
    setEtapa('formulario');
  }

  function aplicarFoto(file: File) {
    setFoto(file);
    const previewUrl = URL.createObjectURL(file);
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(previewUrl);
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) aplicarFoto(file);
    e.target.value = '';
  }

  function removerFoto() {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFoto(null);
    setFotoPreview(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  }

  async function handleSubmit() {
    if (!formularioValido || enviando) return;
    setEnviando(true);
    setErro(null);

    try {
      let fotoFile: File;
      try {
        const fotoBlob = await comprimirImagem(foto!);
        fotoFile = new File([fotoBlob], 'foto.jpg', { type: 'image/jpeg' });
      } catch {
        fotoFile = foto!;
      }

      const fd = new FormData();
      fd.append('lojaId', lojaSelecionada!.id);
      fd.append('numeroPedidoSaipos', numeroPedidoSaipos.trim());
      if (numeroPedidoExterno.trim()) {
        fd.append('numeroPedidoExterno', numeroPedidoExterno.trim());
        fd.append('canalExterno', canalExterno);
      }
      fd.append('descricao', descricao.trim());
      fd.append('foto', fotoFile);
      if (motoboyId) fd.append('motoboyId', motoboyId);

      const res = await fetch('/api/ocorrencias', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Erro ao registrar ocorrência. Tente novamente.');
        return;
      }

      setSucesso({
        lojaNome: lojaSelecionada!.nome,
        pedido: numeroPedidoSaipos.trim(),
      });
      setEtapa('sucesso');
    } catch {
      setErro('Erro de rede. Verifique a conexão e tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  function novoRegistro() {
    setNumeroPedidoSaipos('');
    setNumeroPedidoExterno('');
    setCanalExterno('');
    setDescricao('');
    removerFoto();
    setMotoboyId('');
    setErro(null);
    setSucesso(null);
    setLojaSelecionada(null);
    setEtapa('loja');
  }

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
      ? 'Não sei / não se aplica'
      : motoboys.find((m) => m.id === motoboyId)?.nome || 'Não sei / não se aplica';

  const header = (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <Logo />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground gap-1.5"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </header>
  );

  if (etapa === 'sucesso' && sucesso) {
    return (
      <div className="flex flex-col min-h-screen">
        {header}
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <p className="text-2xl font-semibold text-foreground text-center">
            Ocorrência registrada ✓
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
          <Button onClick={novoRegistro} size="lg" className="w-full max-w-xs">
            Registrar outra
          </Button>
        </div>
      </div>
    );
  }

  if (etapa === 'loja') {
    return (
      <div className="flex flex-col min-h-screen">
        {header}
        <main className="flex-1 px-4 py-6">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Qual loja?</h1>
          <p className="text-sm text-muted-foreground mb-6">Toque para selecionar</p>

          {carregandoOpcoes ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : lojas.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma loja cadastrada.</p>
          ) : (
            <div className="space-y-3">
              {lojas.map((loja) => (
                <button
                  key={loja.id}
                  type="button"
                  onClick={() => selecionarLoja(loja)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-card border border-border hover:bg-muted active:bg-muted text-left min-h-[64px]"
                >
                  <span className="text-base font-semibold text-foreground">{loja.nome}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {header}

      <div className="flex items-center gap-3 px-4 py-2.5 bg-accent border-b border-border">
        <span className="text-sm font-medium text-foreground flex-1">
          {lojaSelecionada?.nome}
        </span>
        <button
          type="button"
          onClick={() => setEtapa('loja')}
          className="text-xs text-primary hover:text-primary/80 font-medium min-h-11 px-2"
        >
          Trocar
        </button>
      </div>

      <main className="flex-1 px-4 py-5 space-y-5 pb-32">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Nº do pedido Saipos <span className="text-destructive">*</span>
          </label>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ex.: 12345"
            value={numeroPedidoSaipos}
            onChange={(e) => setNumeroPedidoSaipos(e.target.value.replace(/\D/g, ''))}
            className="h-12 text-base tabular-nums"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Nº do pedido iFood / Delivery Direto{' '}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Input
            inputMode="numeric"
            placeholder="Ex.: 987654"
            value={numeroPedidoExterno}
            onChange={(e) => {
              setNumeroPedidoExterno(e.target.value);
              if (!e.target.value) setCanalExterno('');
            }}
            className="h-12 text-base tabular-nums"
          />
          {numeroPedidoExterno.trim() && (
            <div className="flex gap-2 pt-1">
              {(['IFOOD', 'DELIVERY_DIRETO'] as const).map((canal) => (
                <button
                  key={canal}
                  type="button"
                  onClick={() => setCanalExterno(canal)}
                  className={cn(
                    'flex-1 min-h-11 rounded-lg border text-sm font-medium',
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
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Descrição da ocorrência <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Descreva o que aconteceu"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="text-base resize-none"
          />
          {descricao.length > 0 && descricao.length < 10 && (
            <p className="text-xs text-destructive">{descricao.length}/10 mín.</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Foto <span className="text-destructive">*</span>
          </label>

          {fotoPreview ? (
            <div className="relative rounded-xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoPreview}
                alt="Preview da ocorrência"
                className="w-full object-cover max-h-64"
              />
              <button
                type="button"
                onClick={removerFoto}
                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 border border-border min-h-11 min-w-11 flex items-center justify-center"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 min-h-11 rounded-full bg-background/80 border border-border text-xs font-medium text-foreground"
                >
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  Trocar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 min-h-[120px] rounded-xl border border-border bg-card"
              >
                <Camera className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm text-foreground">Tirar foto</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 min-h-[120px] rounded-xl border border-border bg-card"
              >
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
                <span className="text-sm text-foreground">Galeria</span>
              </button>
            </div>
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFotoChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFotoChange}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Motoboy <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Popover open={motoboyOpen} onOpenChange={setMotoboyOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={motoboyOpen}
                className="w-full h-12 justify-between font-normal text-sm"
              >
                <span className="truncate">{motoboyLabel}</span>
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
                      Não sei / não se aplica
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
        </div>

        {erro && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
            {erro}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <Button
          onClick={handleSubmit}
          disabled={!formularioValido || enviando}
          size="lg"
          className="w-full"
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
  );
}
