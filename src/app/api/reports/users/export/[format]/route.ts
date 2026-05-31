import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import apiClient from "@/lib/api/client"

const formatConfig = {
  pdf:   { mime: "application/pdf",                                                     filename: "UsersReport.pdf"  },
  excel: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  filename: "UsersReport.xlsx" },
  word:  { mime: "application/msword",                                                  filename: "UsersReport.doc"  },
} as const

type Format = keyof typeof formatConfig

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ format: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { format } = await context.params
  if (!(format in formatConfig)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  }

  const { mime, filename } = formatConfig[format as Format]
  const search = req.nextUrl.searchParams.get("search") ?? undefined
  const gender = req.nextUrl.searchParams.get("gender") ?? undefined

  const response = await apiClient.get(`/api/v1/reports/users/export/${format}`, {
    headers: { Authorization: `Bearer ${session.token}` },
    params: { searchTerm: search, gender },
    responseType: "arraybuffer",
  })

  return new NextResponse(response.data as ArrayBuffer, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
