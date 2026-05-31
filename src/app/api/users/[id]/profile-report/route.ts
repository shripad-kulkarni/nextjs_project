import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import apiClient from "@/lib/api/client"

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await context.params

  const response = await apiClient.get(
    `/api/v1/users/${id}/documents/generate/ProfileReport`,
    {
      headers: { Authorization: `Bearer ${session.token}` },
      responseType: "arraybuffer",
    },
  )

  return new NextResponse(response.data as ArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="UserReport_${id}.pdf"`,
    },
  })
}
