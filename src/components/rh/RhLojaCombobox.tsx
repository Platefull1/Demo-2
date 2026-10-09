'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Loja } from '@/contexts/LojaContext';

type Props = {
  lojas: Loja[];
  lojaSelecionada: Loja | null;
  onSelect: (loja: Loja | null) => void;
  className?: string;
};

/** Combobox de loja no padrão StoreCombobox, adaptado ao LojaContext do RH. */
export function RhLojaCombobox({
  lojas,
  lojaSelecionada,
  onSelect,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => (lojaSelecionada ? lojaSelecionada.nome : 'Todas as lojas'),
    [lojaSelecionada]
  );

  const showTooltip = Boolean(lojaSelecionada?.nome && lojaSelecionada.nome.length > 22);

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      role="combobox"
      aria-expanded={open}
      className="h-8 max-w-[240px] min-w-[160px] justify-between bg-card border-border text-foreground hover:bg-muted"
    >
      <span className="truncate">{selectedLabel}</span>
      <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </Button>
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        {showTooltip ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex max-w-full">
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              {selectedLabel}
            </TooltipContent>
          </Tooltip>
        ) : (
          <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        )}
        <PopoverContent className="w-72 p-0 bg-popover border-border" align="end">
          <Command>
            <CommandInput placeholder="Buscar loja..." />
            <CommandList>
              <CommandEmpty>Nenhuma loja encontrada.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="Todas as lojas"
                  onSelect={() => {
                    onSelect(null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'h-4 w-4',
                      lojaSelecionada === null ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  Todas as lojas
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                {lojas.map((loja) => (
                  <CommandItem
                    key={loja.id}
                    value={loja.nome}
                    onSelect={() => {
                      onSelect(loja);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        lojaSelecionada?.id === loja.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="flex-1 truncate" title={loja.nome}>
                      {loja.nome}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
