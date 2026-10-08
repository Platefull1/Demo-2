"use client";

import { RealtimeData } from "@/types/ifood-dashboard";

interface Props {
  isRealtime: boolean;
  realtimeData: RealtimeData | null;
  lastFetchedAt: Date | null;
}

export function RealtimeIndicator({ isRealtime, realtimeData, lastFetchedAt }: Props) {
  if (!isRealtime) return null;

  const timeLabel = lastFetchedAt
    ? lastFetchedAt.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const lastOrder = realtimeData
    ? {
        minutesAgo: realtimeData.lastOrderMinutesAgo,
        description: realtimeData.lastOrderDescription,
      }
    : null;

  return (
    <div className="flex flex-wrap items-center gap-3 justify-end">
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span>
          Ao vivo
          {timeLabel ? ` · atualizado ${timeLabel}` : ""}
        </span>
      </div>

      {lastOrder?.minutesAgo !== null && lastOrder?.minutesAgo !== undefined && (
        <span className="text-xs text-muted-foreground">
          Último pedido{" "}
          <span className="text-foreground">
            {lastOrder.minutesAgo === 0
              ? "agora"
              : `há ${lastOrder.minutesAgo} min`}
          </span>
          {lastOrder.description ? ` · ${lastOrder.description}` : ""}
        </span>
      )}
    </div>
  );
}
