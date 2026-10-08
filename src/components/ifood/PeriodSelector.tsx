"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Period, PeriodType } from "@/types/ifood-dashboard";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface Props {
  value: Period;
  onChange: (period: Period) => void;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function subtractDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const QUICK_PERIODS: { label: string; type: PeriodType; days: number }[] = [
  { label: "1D", type: "1D", days: 0 },
  { label: "7D", type: "7D", days: 6 },
  { label: "15D", type: "15D", days: 14 },
  { label: "30D", type: "30D", days: 29 },
];

export function PeriodSelector({ value, onChange }: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const handleQuick = (type: PeriodType, days: number) => {
    const today = getToday();
    onChange({
      type,
      startDate: days === 0 ? today : subtractDays(days),
      endDate: today,
    });
  };

  const handleCustomApply = () => {
    if (!range?.from) return;
    const start = range.from.toISOString().split("T")[0];
    const end = range.to ? range.to.toISOString().split("T")[0] : start;
    onChange({ type: "custom", startDate: start, endDate: end });
    setCustomOpen(false);
  };

  const customLabel =
    value.type === "custom"
      ? `${format(new Date(value.startDate + "T12:00:00"), "dd/MM", { locale: ptBR })} – ${format(
          new Date(value.endDate + "T12:00:00"),
          "dd/MM",
          { locale: ptBR },
        )}`
      : "Personalizado";

  const quickValue = value.type === "custom" ? "" : value.type;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ToggleGroup
        type="single"
        value={quickValue}
        onValueChange={(next) => {
          if (!next) return;
          const found = QUICK_PERIODS.find((p) => p.type === next);
          if (found) handleQuick(found.type, found.days);
        }}
        size="sm"
      >
        {QUICK_PERIODS.map(({ label, type }) => (
          <ToggleGroupItem key={type} value={type} className="h-8 px-3 text-xs">
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Popover open={customOpen} onOpenChange={setCustomOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 px-3 text-xs font-medium",
              value.type === "custom" &&
                "bg-accent text-accent-foreground border-primary/40"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            {customLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-3 bg-popover border-border"
          align="start"
        >
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
            className="bg-popover text-popover-foreground"
            locale={ptBR}
          />
          <div className="flex justify-end gap-2 mt-3 border-t border-border pt-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setCustomOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleCustomApply}
              disabled={!range?.from}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-xs text-muted-foreground">
        {format(new Date(value.startDate + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
        {value.startDate !== value.endDate && (
          <>
            {" — "}
            {format(new Date(value.endDate + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
          </>
        )}
      </span>
    </div>
  );
}
