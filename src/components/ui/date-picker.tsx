"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatYmd, formatYmdDisplay, parseYmd, todayYmd } from "@/lib/date-ymd"

type DatePickerProps = {
  value?: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  captionLayout?: React.ComponentProps<typeof Calendar>["captionLayout"]
  id?: string
  "aria-label"?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecionar data",
  disabled,
  captionLayout = "dropdown",
  id,
  "aria-label": ariaLabel,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = value ? parseYmd(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className="h-9 min-w-[11rem] justify-start font-normal"
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {value ? (
            formatYmdDisplay(value)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? formatYmd(date) : null)
            if (date) setOpen(false)
          }}
          captionLayout={captionLayout}
          defaultMonth={selected}
        />
        <div className="flex justify-end gap-2 border-t border-border p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(todayYmd())
              setOpen(false)
            }}
          >
            Hoje
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            Limpar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
