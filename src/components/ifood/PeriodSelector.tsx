"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Period, PeriodType } from "@/types/ifood-dashboard";

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
  const handleQuick = (type: PeriodType, days: number) => {
    const today = getToday();
    onChange({
      type,
      startDate: days === 0 ? today : subtractDays(days),
      endDate: today,
    });
  };

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

      <DateRangePicker
        value={{ from: value.startDate, to: value.endDate }}
        onChange={(range) => {
          if (!range) return;
          onChange({ type: "custom", startDate: range.from, endDate: range.to });
        }}
        presets={false}
      />
    </div>
  );
}
