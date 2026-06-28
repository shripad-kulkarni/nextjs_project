import { cache } from "react"
import apiClient from "./client"
import type { ApiResponse } from "@/types/auth"

export interface InfoSettings {
  name: string
  logoPath?: string | null
  address?: string | null
  phoneNumber?: string | null
  email?: string | null
}

export interface UpdateInfoSettingsPayload {
  name: string
  address?: string | null
  phoneNumber?: string | null
  email?: string | null
}

const FALLBACK: InfoSettings = { name: "My App" }

export const getInfoSettingsApi = cache(async (): Promise<InfoSettings> => {
  try {
    const { data } = await apiClient.get<ApiResponse<InfoSettings>>("/v1/settings")
    return data.data ?? FALLBACK
  } catch (err: any) {
    console.error("[InfoSettings] fetch failed:", err?.message ?? err)
    return FALLBACK
  }
})

export async function getInfoSettingsAdminApi(token: string): Promise<InfoSettings> {
  const { data } = await apiClient.get<ApiResponse<InfoSettings>>("/v1/settings", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data.data ?? FALLBACK
}

export async function updateInfoSettingsApi(
  payload: UpdateInfoSettingsPayload,
  token: string,
): Promise<void> {
  await apiClient.put("/v1/settings", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function uploadLogoApi(formData: FormData, token: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5187/api"
  const res = await fetch(`${baseUrl}/v1/settings/logo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message ?? "Logo upload failed.")
  return json.data?.logoPath ?? ""
}
