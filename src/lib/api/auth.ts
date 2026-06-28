import apiClient from "./client"
import type { ApiResponse, AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth"

export async function loginApi(credentials: LoginCredentials) {
  const { data } = await apiClient.post<ApiResponse<AuthUser>>(
    "/v1/auth/login",
    credentials,
  )
  return data
}

export async function registerApi(credentials: RegisterCredentials) {
  const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
    "/v1/auth/register",
    credentials,
  )
  return data
}

export async function changePasswordApi(currentPassword: string, newPassword: string, token: string) {
  const { data } = await apiClient.post<ApiResponse<null>>(
    "/v1/auth/change-password",
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return data
}

export async function verifyEmailApi(email: string, token: string) {
  const { data } = await apiClient.get<ApiResponse<null>>(
    `/v1/auth/verify-email`,
    { params: { email, token } },
  )
  return data
}

export async function forgotPasswordApi(email: string) {
  const { data } = await apiClient.post<ApiResponse<null>>(
    "/v1/auth/forgot-password",
    { email },
  )
  return data
}

export async function resetPasswordApi(email: string, token: string, newPassword: string) {
  const { data } = await apiClient.post<ApiResponse<null>>(
    "/v1/auth/set-password",
    { email, token, newPassword },
  )
  return data
}
