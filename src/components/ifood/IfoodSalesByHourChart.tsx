"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { DashboardSummary } from "@/types/ifood-dashboard";

interface Props {
  summary: DashboardSummary | null;
  isLoading: boolean;
  isRealtime: boolean;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const orders = payload.find((p) => p.dataKey === "orders")?.value as number | undefined;
  const revenue = payload.find((p) => p.dataKey === "revenue")?.value as number | undefined;
  return (
    <div className="bg-popover border border-border rounded-md p-3 text-xs shadow-md">
      <p className="text-muted-foreground mb-2 font-medium">{label}h</p>
      <p className="text-foreground">
        <span className="text-muted-foreground">Pedidos: </span>
        {orders ?? 0}
      </p>
      {revenue !== undefined && revenue > 0 && (
        <p className="text-foreground">
          <span className="text-muted-foreground">Receita: </span>
          {`R$ ${revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        </p>
      )}
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

export function IfoodSalesByHourChart({ summary, isLoading, isRealtime }: Props) {
  const currentHour = new Date().getHours();

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

  const rawData = summary?.salesByHour ?? [];
  const maxHourWithData = rawData.reduce(
    (max, d) => (d.orders > 0 ? Math.max(max, d.hour) : max),
    0,
  );
  const displayEnd = isRealtime ? Math.max(currentHour, maxHourWithData, 10) : maxHourWithData || 23;
  const data = rawData.slice(0, displayEnd + 1).map((d) => ({
    hour: d.hour,
    name: `${String(d.hour).padStart(2, "0")}`,
    orders: d.orders,
    revenue: d.revenue,
  }));

  const hasData = data.some((d) => d.orders > 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Pedidos por hora
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isRealtime
            ? "Distribuição de pedidos de hoje · hora atual destacada"
            : "Distribuição de pedidos ao longo do dia"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              />
              <Bar dataKey="orders" radius={[3, 3, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.hour}`}
                    fill={
                      isRealtime && entry.hour === currentHour
                        ? "var(--primary)"
                        : entry.orders > 0
                        ? "var(--accent-foreground)"
                        : "var(--muted)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {isRealtime && hasData && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Barra em destaque = hora atual ({String(currentHour).padStart(2, "0")}h)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
