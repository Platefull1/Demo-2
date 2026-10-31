"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  addDaysYmd,
  endOfMonthYmd,
  formatYmd,
  formatYmdDisplay,
  parseYmd,
  startOfMonthYmd,
  todayYmd,
} from "@/lib/date-ymd"

export type DateRangeYmd = { from: string; to: string }

type DateRangePickerProps = {
  value?: DateRangeYmd | null
  onChange: (value: DateRangeYmd | null) => void
  placeholder?: string
  disabled?: boolean
  presets?: boolean
  id?: string
  "aria-label"?: string
}

function presetRange(id: string): DateRangeYmd {
  const today = todayYmd()
  const yesterday = addDaysYmd(today, -1)
  if (id === "hoje") return { from: today, to: today }
  if (id === "ontem") return { from: yesterday, to: yesterday }
  if (id === "7") return { from: addDaysYmd(today, -6), to: today }
  if (id === "30") return { from: addDaysYmd(today, -29), to: today }
  if (id === "mes") return { from: startOfMonthYmd(today), to: today }
  const prev = addDaysYmd(startOfMonthYmd(today), -1)
  return { from: startOfMonthYmd(prev), to: endOfMonthYmd(prev) }
}

const PRESETS = [
  { id: "hoje", label: "Hoje" },
  { id: "ontem", label: "Ontem" },
  { id: "7", label: "Últimos 7 dias" },
  { id: "30", label: "Últimos 30 dias" },
  { id: "mes", label: "Este mês" },
  { id: "passado", label: "Mês passado" },
] as const

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Selecionar período",
  disabled,
  presets = true,
  id,
  "aria-label": ariaLabel,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange | undefined>()

  React.useEffect(() => {
    if (!open) return
    setDraft(
      value
        ? { from: parseYmd(value.from), to: parseYmd(value.to) }
        : undefined,
    )
  }, [open, value])

  const label = value
    ? `${formatYmdDisplay(value.from)} – ${formatYmdDisplay(value.to)}`
    : null

  function aplicar(next?: DateRange) {
    const range = next ?? draft
    if (range?.from && range.to) {
      onChange({ from: formatYmd(range.from), to: formatYmd(range.to) })
    } else if (range?.from) {
      onChange({ from: formatYmd(range.from), to: formatYmd(range.from) })
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className="h-9 min-w-[15rem] justify-start font-normal"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {label ? label : <span className="text-muted-foreground">{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col md:flex-row">
          {presets ? (
            <div className="flex flex-row flex-wrap gap-1 border-b border-border p-2 md:w-40 md:flex-col md:border-b-0 md:border-r">
              {PRESETS.map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    const r = presetRange(p.id)
                    setDraft({ from: parseYmd(r.from), to: parseYmd(r.to) })
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          ) : null}
          <div>
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft?.from ?? (value ? parseYmd(value.from) : undefined)}
              className={cn("p-2")}
            />
            <div className="flex justify-end gap-2 border-t border-border p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(null)
                  setDraft(undefined)
                  setOpen(false)
                }}
              >
                Limpar
              </Button>
              <Button type="button" size="sm" onClick={() => aplicar()}>
                Aplicar
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
