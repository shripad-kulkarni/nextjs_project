"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { loginApi, registerApi, forgotPasswordApi, resetPasswordApi, verifyEmailApi, changePasswordApi } from "@/lib/api/auth"
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

export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<{ error?: string }> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    if (!session) return { error: "Not authenticated." }

    const { token } = JSON.parse(session.value)
    const result = await changePasswordApi(currentPassword, newPassword, token)
    if (!result.isSuccess) return { error: result.message }
    return {}
  } catch (err: any) {
    const msg: string = err?.response?.data?.message ?? "Failed to change password. Please try again."
    return { error: msg }
  }
}

export async function verifyEmailAction(email: string, token: string): Promise<{ error?: string }> {
  try {
    const result = await verifyEmailApi(email, token)
    if (!result.isSuccess) return { error: result.message }
    return {}
  } catch (err: any) {
    const msg: string = err?.response?.data?.message ?? "Verification failed. The link may have expired."
    return { error: msg }
  }
}

export async function forgotPasswordAction(email: string): Promise<{ error?: string }> {
  try {
    await forgotPasswordApi(email)
    return {}
  } catch {
    return { error: "Something went wrong. Please try again." }
  }
}

export async function resetPasswordAction(
  email: string,
  token: string,
  newPassword: string,
): Promise<{ error?: string }> {
  try {
    const result = await resetPasswordApi(email, token, newPassword)
    if (!result.isSuccess) return { error: result.message }
    return {}
  } catch (err: any) {
    const msg: string = err?.response?.data?.message ?? "Failed to reset password. The link may have expired."
    return { error: msg }
  }
}

export async function signOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}
