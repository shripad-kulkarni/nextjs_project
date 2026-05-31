"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { FileText, FileSpreadsheet, FileDown, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Format = "pdf" | "excel" | "word"

const formats: { format: Format; label: string; icon: React.ElementType; ext: string }[] = [
  { format: "pdf",   label: "PDF",   icon: FileText,        ext: "pdf"  },
  { format: "excel", label: "Excel", icon: FileSpreadsheet, ext: "xlsx" },
  { format: "word",  label: "Word",  icon: FileDown,        ext: "doc"  },
]

async function triggerDownload(url: string, filename: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = blobUrl
  a.download = filename
  a.click()
  URL.revokeObjectURL(blobUrl)
}

export function ExportButtons() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<Format | null>(null)

  const handleExport = async (format: Format) => {
    setLoading(format)
    try {
      const params = new URLSearchParams()
      const search = searchParams.get("search")
      const gender = searchParams.get("gender")
      if (search) params.set("search", search)
      if (gender) params.set("gender", gender)

      const qs = params.size ? `?${params}` : ""
      const ext = formats.find((f) => f.format === format)!.ext

      await triggerDownload(
        `/api/reports/users/export/${format}${qs}`,
        `UsersReport.${ext}`,
      )
    } catch {
      toast.error("Export failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!!loading} className="gap-1.5">
          {loading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Download className="h-3.5 w-3.5" />
          }
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Download report as
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map(({ format, label, icon: Icon }) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={!!loading}
            className="gap-2 cursor-pointer"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
