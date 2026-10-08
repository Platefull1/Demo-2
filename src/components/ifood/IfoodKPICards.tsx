"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle } from "lucide-react";
import { DashboardSummary } from "@/types/ifood-dashboard";
import { cn } from "@/lib/utils";

interface Props {
  summary: DashboardSummary | null;
  isLoading: boolean;
  isRealtime: boolean;
}

function pctChange(current: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

function VariationBadge({ current, prev }: { current: number; prev: number }) {
  const pct = pctChange(current, prev);
  if (pct === null) return null;
  const positive = pct >= 0;
  return (
    <span
      className={`text-xs ${
        positive ? "text-success" : "text-destructive"
      }`}
    >
      {positive ? "+" : ""}
      {pct.toFixed(1)}% vs período anterior
    </span>
  );
}

function cellBorderClass(index: number) {
  return cn(
    // 2 colunas: divisor vertical entre colunas (células da esquerda)
    (index === 0 || index === 2) && "border-r border-border",
    // 2 colunas: divisor horizontal entre as duas linhas
    (index === 0 || index === 1) && "border-b border-border xl:border-b-0",
    // xl (4 colunas): só divisores verticais, sem borda na última célula
    index < 3 && "xl:border-r"
  );
}

export function IfoodKPICards({ summary, isLoading, isRealtime: _isRealtime }: Props) {
  const cards = [
    {
      title: "Vendas",
      tooltip: "Total de receita dos pedidos não cancelados no período",
      value: summary
        ? `R$ ${summary.totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
      current: summary?.totalSales ?? 0,
      prev: summary?.prevTotalSales ?? 0,
    },
    {
      title: "Pedidos",
      tooltip: "Total de pedidos aceitos (excluindo cancelados e de teste)",
      value: summary ? summary.totalOrders.toString() : "0",
      current: summary?.totalOrders ?? 0,
      prev: summary?.prevTotalOrders ?? 0,
    },
    {
      title: "Ticket médio",
      tooltip: "Receita total dividida pelo número de pedidos no período",
      value: summary
        ? `R$ ${summary.averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
      current: summary?.averageTicket ?? 0,
      prev: summary?.prevAverageTicket ?? 0,
    },
    {
      title: "Clientes únicos",
      tooltip: "Número de telefones distintos que fizeram pedidos no período",
      value: summary ? summary.uniqueCustomers.toString() : "0",
      current: summary?.uniqueCustomers ?? 0,
      prev: summary?.prevUniqueCustomers ?? 0,
    },
  ];

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn("p-5", cellBorderClass(i))}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-28 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => (
              <div
                key={card.title}
                className={cn("p-5", cellBorderClass(index))}
                title={card.tooltip}
              >
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-3xl font-semibold text-foreground tabular-nums">
                  {card.value}
                </p>
                <div className="mt-1">
                  <VariationBadge current={card.current} prev={card.prev} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {(summary?.cancelledOrders ?? 0) > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {summary!.cancelledOrders} pedido(s) cancelado(s) no período — não incluídos nos KPIs
          </span>
        </div>
      )}
    </div>
  );
}
