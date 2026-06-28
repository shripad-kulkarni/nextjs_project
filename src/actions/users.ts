"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { createUserApi, updateUserApi, deleteUserApi, setUserActiveApi } from "@/lib/api/users"

type ActionResult = { error?: string; errors?: string[] }

function extractError(err: any, fallback: string): ActionResult {
  const data = err?.response?.data
  const errors: string[] | undefined =
    Array.isArray(data?.errors) && data.errors.length > 0 ? data.errors : undefined
  return { error: data?.message ?? fallback, errors }
}

export async function createUserAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    const result = await createUserApi(formData, session.token)
    if (!result.isSuccess) return { error: result.message }
    revalidatePath("/users")
    return {}
  } catch (err: any) {
    return extractError(err, "Failed to create user.")
  }
}

export async function updateUserAction(formData: FormData): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  const id = Number(formData.get("id"))

  try {
    const result = await updateUserApi(id, formData, session.token)
    if (!result.isSuccess) return { error: result.message }
    revalidatePath("/users")
    return {}
  } catch (err: any) {
    return extractError(err, "Failed to update user.")
  }
}

export async function deleteUserAction(id: number): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    await deleteUserApi(id, session.token)
    revalidatePath("/users")
    return {}
  } catch (err: any) {
    return extractError(err, "Failed to delete user.")
  }
}

export async function setUserActiveAction(id: number, isActive: boolean): Promise<ActionResult> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    const result = await setUserActiveApi(id, isActive, session.token)
    if (!result.isSuccess) return { error: result.message }
    revalidatePath("/users")
    return {}
  } catch (err: any) {
    return extractError(err, `Failed to ${isActive ? "activate" : "deactivate"} user.`)
  }
}
