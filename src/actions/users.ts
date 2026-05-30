"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/session"
import { createUserApi, updateUserApi, deleteUserApi } from "@/lib/api/users"
import type { CreateUserDto, UpdateUserDto } from "@/types/user"

export async function createUserAction(
  dto: CreateUserDto,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    const result = await createUserApi(dto, session.token)
    if (!result.isSuccess) return { error: result.message }
    revalidatePath("/dashboard/users")
    return {}
  } catch (err: any) {
    return { error: err?.response?.data?.message ?? "Failed to create user." }
  }
}

export async function updateUserAction(
  id: number,
  dto: UpdateUserDto,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    const result = await updateUserApi(id, dto, session.token)
    if (!result.isSuccess) return { error: result.message }
    revalidatePath("/dashboard/users")
    return {}
  } catch (err: any) {
    return { error: err?.response?.data?.message ?? "Failed to update user." }
  }
}

export async function deleteUserAction(
  id: number,
): Promise<{ error?: string }> {
  const session = await getSession()
  if (!session) return { error: "Unauthorized" }

  try {
    await deleteUserApi(id, session.token)
    revalidatePath("/dashboard/users")
    return {}
  } catch (err: any) {
    return { error: err?.response?.data?.message ?? "Failed to delete user." }
  }
}
