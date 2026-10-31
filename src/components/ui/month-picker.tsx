"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addMonthsYm, formatMonthLong, todayYmd, ymFromYmd } from "@/lib/date-ymd"

const MESES = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const

type MonthPickerProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  "aria-label"?: string
}

export function MonthPicker({
  value,
  onChange,
  disabled,
  id,
  "aria-label": ariaLabel,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [year, setYear] = React.useState(() => Number(value.slice(0, 4)) || new Date().getFullYear())
  const atual = ymFromYmd(todayYmd())

  React.useEffect(() => {
    if (open) setYear(Number(value.slice(0, 4)) || new Date().getFullYear())
  }, [open, value])

  const selectedMonth = Number(value.slice(5, 7))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? "Mês"}
          className="h-9 min-w-[12rem] justify-start font-normal"
        >
          {formatMonthLong(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="mb-3 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Ano anterior"
            onClick={() => setYear((y) => y - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <p className="text-sm font-medium tabular-nums">{year}</p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Próximo ano"
            onClick={() => setYear((y) => y + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {MESES.map((label, i) => {
            const ym = `${year}-${String(i + 1).padStart(2, "0")}`
            const selected = year === Number(value.slice(0, 4)) && i + 1 === selectedMonth
            const isAtual = ym === atual
            return (
              <Button
                key={ym}
                type="button"
                variant={selected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 capitalize",
                  isAtual && !selected && "ring-1 ring-primary/40",
                )}
                onClick={() => {
                  onChange(ym)
                  setOpen(false)
                }}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
