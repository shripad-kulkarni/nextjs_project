import apiClient from "./client"
import type { ApiResponse, AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth"

export async function loginApi(credentials: LoginCredentials) {
  const { data } = await apiClient.post<ApiResponse<AuthUser>>(
    "/api/v1/auth/login",
    credentials,
  )
  return data
}

export async function registerApi(credentials: RegisterCredentials) {
  const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
    "/api/v1/auth/register",
    credentials,
  )
  return data
}
