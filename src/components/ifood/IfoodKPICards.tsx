"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingCart, TrendingUp, Users, XCircle } from "lucide-react";
import { DashboardSummary } from "@/types/ifood-dashboard";

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

export function IfoodKPICards({ summary, isLoading, isRealtime }: Props) {
  const cards = [
    {
      title: "Vendas",
      tooltip: "Total de receita dos pedidos não cancelados no período",
      icon: DollarSign,
      value: summary
        ? `R$ ${summary.totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
      current: summary?.totalSales ?? 0,
      prev: summary?.prevTotalSales ?? 0,
    },
    {
      title: "Pedidos",
      tooltip: "Total de pedidos aceitos (excluindo cancelados e de teste)",
      icon: ShoppingCart,
      value: summary ? summary.totalOrders.toString() : "0",
      current: summary?.totalOrders ?? 0,
      prev: summary?.prevTotalOrders ?? 0,
    },
    {
      title: "Ticket médio",
      tooltip: "Receita total dividida pelo número de pedidos no período",
      icon: TrendingUp,
      value: summary
        ? `R$ ${summary.averageTicket.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
      current: summary?.averageTicket ?? 0,
      prev: summary?.prevAverageTicket ?? 0,
    },
    {
      title: "Clientes únicos",
      tooltip: "Número de telefones distintos que fizeram pedidos no período",
      icon: Users,
      value: summary ? summary.uniqueCustomers.toString() : "0",
      current: summary?.uniqueCustomers ?? 0,
      prev: summary?.prevUniqueCustomers ?? 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-5">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={`bg-card border-border ${
              isRealtime ? "border-border" : ""
            }`}
            title={card.tooltip}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {card.value}
              </p>
              <div className="mt-2 min-h-[1rem]">
                <VariationBadge current={card.current} prev={card.prev} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
