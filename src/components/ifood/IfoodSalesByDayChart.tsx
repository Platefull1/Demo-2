"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DashboardSummary } from "@/types/ifood-dashboard";

interface Props {
  summary: DashboardSummary | null;
  isLoading: boolean;
  periodLabel: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-md p-3 text-xs shadow-md">
      <p className="text-muted-foreground mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-foreground">
          <span className="text-muted-foreground">
            {p.dataKey === "revenue" ? "Receita: " : "Pedidos: "}
          </span>
          {p.dataKey === "revenue"
            ? `R$ ${(p.value as number).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
            : p.value}
        </p>
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-[280px] flex flex-col items-center justify-center gap-1 text-center px-4">
      <p className="text-sm text-muted-foreground">Nenhum pedido neste período</p>
      <p className="text-xs text-muted-foreground">
        Os dados aparecerão quando houver vendas no intervalo selecionado.
      </p>
    </div>
  );
}

export function IfoodSalesByDayChart({ summary, isLoading, periodLabel }: Props) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const data =
    summary?.salesByDay.map((d) => ({
      name: format(new Date(d.date + "T12:00:00"), "dd/MM", { locale: ptBR }),
      revenue: d.revenue,
      orders: d.orders,
    })) ?? [];

  const hasData = data.some((d) => d.revenue > 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Vendas por dia
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {periodLabel} · Receita dos pedidos aceitos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ifoodRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$${(v / 1000).toFixed(1)}k` : `R$${v}`
                }
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#ifoodRevenueGrad)"
                dot={{ fill: "var(--primary)", r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "var(--primary)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
