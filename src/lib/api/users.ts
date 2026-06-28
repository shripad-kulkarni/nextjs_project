import apiClient from "./client"
import type { UserDto, UserFilterParams, PaginatedApiResponse } from "@/types/user"
import type { ApiResponse } from "@/types/auth"

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

// Axios doesn't know how to resolve the multipart boundary for native Web API
// FormData in Node.js (no getHeaders / getBoundary). Fetch handles it natively.
async function fetchMultipart(
  path: string,
  method: "POST" | "PUT",
  formData: FormData,
  token: string,
): Promise<ApiResponse<UserDto>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5187/api"
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) {
    const err: any = new Error(json?.message ?? `HTTP ${res.status}`)
    err.response = { data: json }
    throw err
  }
  return json
}

export async function getUserByIdApi(id: number, token: string) {
  const { data } = await apiClient.get<ApiResponse<UserDto>>(`/v1/users/${id}`, {
    headers: authHeaders(token),
  })
  return data.data!
}

export async function getPublicUsersApi(filter: UserFilterParams) {
  const params: Record<string, unknown> = {
    pageNumber: filter.pageNumber ?? 1,
    pageSize: filter.pageSize ?? 100,
  }
  if (filter.searchTerm) params.searchTerm = filter.searchTerm
  if (filter.gender) params.gender = filter.gender
  if (filter.isActive !== undefined) params.isActive = filter.isActive

  const { data } = await apiClient.get<PaginatedApiResponse<UserDto>>("/v1/users", { params })
  return data
}

export async function getUsersApi(filter: UserFilterParams, token: string) {
  const params: Record<string, unknown> = {
    pageNumber: filter.pageNumber ?? 1,
    pageSize: filter.pageSize ?? 10,
  }
  if (filter.searchTerm) params.searchTerm = filter.searchTerm
  if (filter.gender) params.gender = filter.gender
  if (filter.isActive !== undefined) params.isActive = filter.isActive

  const { data } = await apiClient.get<PaginatedApiResponse<UserDto>>("/v1/users", {
    params,
    headers: authHeaders(token),
  })
  return data
}

export async function createUserApi(formData: FormData, token: string) {
  return fetchMultipart("/v1/users", "POST", formData, token)
}

export async function updateUserApi(id: number, formData: FormData, token: string) {
  return fetchMultipart(`/v1/users/${id}`, "PUT", formData, token)
}

export async function deleteUserApi(id: number, token: string) {
  await apiClient.delete(`/v1/users/${id}`, {
    headers: authHeaders(token),
  })
}

export async function setUserActiveApi(id: number, isActive: boolean, token: string) {
  const action = isActive ? "activate" : "deactivate"
  const { data } = await apiClient.patch<ApiResponse<never>>(
    `/v1/users/${id}/${action}`,
    null,
    { headers: authHeaders(token) },
  )
  return data
}
