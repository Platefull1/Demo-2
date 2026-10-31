'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type FotoDestaque = { path: string; url: string };

export function DestaqueFotosDialog({
  open,
  onOpenChange,
  fotos,
  selecionadasInicial,
  salvando,
  erro,
  confirmLabel = 'Destacar',
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fotos: FotoDestaque[];
  selecionadasInicial: string[];
  salvando?: boolean;
  erro?: string | null;
  confirmLabel?: string;
  onConfirm: (paths: string[]) => void;
}) {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setSelecionadas(selecionadasInicial);
  }, [open, selecionadasInicial]);

  function toggle(path: string) {
    setSelecionadas((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-semibold">
            Fotos do destaque
          </DialogTitle>
          <DialogDescription>
            Escolha quais fotos entram na ata. Clique para marcar ou desmarcar.
          </DialogDescription>
        </DialogHeader>

        {fotos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar as fotos desta ocorrência.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {fotos.map((foto, i) => {
              const ativa = selecionadas.includes(foto.path);
              return (
                <Button
                  key={foto.path}
                  type="button"
                  variant="outline"
                  aria-pressed={ativa}
                  aria-label={`${ativa ? 'Desmarcar' : 'Marcar'} foto ${i + 1}`}
                  className={cn(
                    'relative h-auto overflow-hidden rounded-md p-0',
                    ativa && 'border-primary ring-2 ring-primary/40',
                  )}
                  onClick={() => toggle(foto.path)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url}
                    alt=""
                    className="aspect-square w-full object-cover"
                  />
                  {ativa ? (
                    <span className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" />
                    </span>
                  ) : null}
                </Button>
              );
            })}
          </div>
        )}

        {erro ? (
          <p className="text-sm text-destructive" role="alert">
            {erro}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selecionadas.length === 0 || salvando || fotos.length === 0}
            loading={salvando}
            onClick={() => onConfirm(selecionadas)}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
