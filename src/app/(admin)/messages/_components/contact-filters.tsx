"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  defaultSearch?: string
  defaultIsRead?: string
  defaultDateFrom?: string
  defaultDateTo?: string
}

export function ContactFilters({
  defaultSearch = "",
  defaultIsRead = "",
  defaultDateFrom = "",
  defaultDateTo = "",
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const hasFilters =
    searchParams.get("search") ||
    searchParams.get("isRead") ||
    searchParams.get("dateFrom") ||
    searchParams.get("dateTo")

  return (
    <div className="flex gap-3 flex-wrap items-center">
      <Input
        placeholder="Search name, email or subject…"
        defaultValue={defaultSearch}
        className="max-w-xs"
        onKeyDown={(e) => { if (e.key === "Enter") update("search", e.currentTarget.value) }}
        onBlur={(e) => update("search", e.target.value)}
      />

      <Select
        defaultValue={defaultIsRead || "all"}
        onValueChange={(v) => update("isRead", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="false">Unread</SelectItem>
          <SelectItem value="true">Read</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        defaultValue={defaultDateFrom}
        className="w-40"
        onChange={(e) => update("dateFrom", e.target.value)}
      />
      <span className="text-muted-foreground text-sm">to</span>
      <Input
        type="date"
        defaultValue={defaultDateTo}
        className="w-40"
        onChange={(e) => update("dateTo", e.target.value)}
      />

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("?")}
          className="gap-1.5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
