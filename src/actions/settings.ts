"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { updateInfoSettingsApi, uploadLogoApi } from "@/lib/api/settings"

export async function updateInfoSettingsAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  const payload = {
    name: formData.get("name") as string,
    address:     (formData.get("address")     as string) || null,
    phoneNumber: (formData.get("phoneNumber") as string) || null,
    email:       (formData.get("email")       as string) || null,
  }

  try {
    await updateInfoSettingsApi(payload, session.token)
    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/team")
    return {}
  } catch (err: any) {
    return { error: err?.response?.data?.message ?? "Failed to update settings." }
  }
}

export async function uploadLogoAction(
  formData: FormData,
): Promise<{ logoUrl?: string; error?: string }> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    const logoUrl = await uploadLogoApi(formData, session.token)
    revalidatePath("/")
    revalidatePath("/about")
    revalidatePath("/team")
    return { logoUrl }
  } catch (err: any) {
    return { error: err?.message ?? "Failed to upload logo." }
  }
}
