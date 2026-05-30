"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Props {
  defaultSearch?: string
  defaultGender?: string
}

export function UserFilters({ defaultSearch = "", defaultGender = "" }: Props) {
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

  const hasFilters = searchParams.get("search") || searchParams.get("gender")

  return (
    <div className="flex gap-3 flex-wrap items-center">
      <Input
        placeholder="Search by name or email…"
        defaultValue={defaultSearch}
        className="max-w-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter") update("search", e.currentTarget.value)
        }}
        onBlur={(e) => update("search", e.target.value)}
      />

      <Select
        defaultValue={defaultGender || "all"}
        onValueChange={(v) => update("gender", v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genders</SelectItem>
          <SelectItem value="Male">Male</SelectItem>
          <SelectItem value="Female">Female</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

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
