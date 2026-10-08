"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IfoodConnection } from "@/types/ifood-dashboard";

type Props = {
  stores: IfoodConnection[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSync: (merchantId: string) => void;
  syncingId: string | null;
};

function statusLabel(ifoodStatus?: string | null, dbStatus?: string) {
  if (ifoodStatus === "OPEN") return { label: "Online", tone: "success" as const };
  if (ifoodStatus === "CLOSED") return { label: "Fechado", tone: "muted" as const };
  if (ifoodStatus === "PAUSED") return { label: "Pausado", tone: "warning" as const };
  if (dbStatus === "inactive" || dbStatus === "error") {
    return { label: "Erro", tone: "destructive" as const };
  }
  return { label: "Aguardando", tone: "muted" as const };
}

function StatusDot({ tone }: { tone: "success" | "warning" | "destructive" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full shrink-0",
        tone === "success" && "bg-success",
        tone === "warning" && "bg-warning",
        tone === "destructive" && "bg-destructive",
        tone === "muted" && "bg-muted-foreground"
      )}
    />
  );
}

export function StoreCombobox({
  stores,
  selectedId,
  onSelect,
  onSync,
  syncingId,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedStore = useMemo(
    () => stores.find((s) => s.merchantId === selectedId),
    [stores, selectedId]
  );

  const selectedLabel =
    selectedId === "all"
      ? "Todas as lojas"
      : selectedStore?.merchantName ?? "Selecionar loja";

  const selectedStatus =
    selectedId === "all"
      ? null
      : statusLabel(selectedStore?.ifoodStatus, selectedStore?.status);

  const isSyncing = syncingId === selectedId;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="h-8 min-w-[180px] justify-between bg-card border-border text-foreground hover:bg-muted"
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 bg-popover border-border" align="end">
          <Command>
            <CommandInput placeholder="Buscar loja..." />
            <CommandList>
              <CommandEmpty>Nenhuma loja encontrada.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="Todas as lojas"
                  onSelect={() => {
                    onSelect("all");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedId === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Todas as lojas
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                {stores.map((store) => {
                  const status = statusLabel(store.ifoodStatus, store.status);
                  return (
                    <CommandItem
                      key={store.merchantId}
                      value={store.merchantName}
                      onSelect={() => {
                        onSelect(store.merchantId);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedId === store.merchantId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="flex-1 truncate">{store.merchantName}</span>
                      <StatusDot tone={status.tone} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedStatus && (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <StatusDot tone={selectedStatus.tone} />
          {selectedStatus.label}
        </span>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8"
        disabled={isSyncing}
        onClick={() => onSync(selectedId)}
      >
        <RefreshCw
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground",
            isSyncing && "animate-spin"
          )}
        />
        {isSyncing ? "Sincronizando..." : "Sincronizar agora"}
      </Button>
    </div>
  );
}
