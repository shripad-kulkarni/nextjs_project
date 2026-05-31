"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { loginApi, registerApi } from "@/lib/api/auth"
import { SESSION_COOKIE, SESSION_EXPIRY } from "@/constants"
import type { LoginCredentials, RegisterCredentials } from "@/types/auth"

export async function loginAction(
  credentials: LoginCredentials,
): Promise<{ error?: string }> {
  try {
    const result = await loginApi(credentials)
    if (!result.isSuccess || !result.data) {
      return { error: result.message }
    }

    const cookieStore = await cookies()
    cookieStore.set(
      SESSION_COOKIE,
      JSON.stringify({
        token: result.data.token,
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_EXPIRY,
        path: "/",
      },
    )

    return {}
  } catch (err: any) {
    const msg: string =
      err?.response?.data?.message ?? "Login failed. Please try again."
    return { error: msg }
  }
}

export async function registerAction(
  credentials: RegisterCredentials,
): Promise<{ error?: string }> {
  try {
    const result = await registerApi(credentials)
    if (!result.isSuccess) {
      return { error: result.message }
    }
    return {}
  } catch (err: any) {
    const msg: string =
      err?.response?.data?.message ?? "Registration failed. Please try again."
    return { error: msg }
  }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}
