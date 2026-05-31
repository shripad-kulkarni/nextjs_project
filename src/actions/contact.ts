"use server"

import apiClient from "@/lib/api/client"

interface ContactPayload {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContactAction(
  payload: ContactPayload,
): Promise<{ error?: string }> {
  try {
    await apiClient.post("/api/v1/contact", payload)
    return {}
  } catch (err: any) {
    const errors: string[] | undefined = err?.response?.data?.errors
    if (errors?.length) return { error: errors[0] }
    return { error: err?.response?.data?.message ?? "Failed to send message. Please try again." }
  }
}
