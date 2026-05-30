import apiClient from "./client"
import type { UserDto, CreateUserDto, UpdateUserDto, UserFilterParams, PaginatedApiResponse } from "@/types/user"
import type { ApiResponse } from "@/types/auth"

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function getUsersApi(filter: UserFilterParams, token: string) {
  const params: Record<string, unknown> = {
    pageNumber: filter.pageNumber ?? 1,
    pageSize: filter.pageSize ?? 10,
  }
  if (filter.searchTerm) params.searchTerm = filter.searchTerm
  if (filter.gender) params.gender = filter.gender
  if (filter.isActive !== undefined) params.isActive = filter.isActive

  const { data } = await apiClient.get<PaginatedApiResponse<UserDto>>("/api/v1/users", {
    params,
    headers: authHeaders(token),
  })
  return data
}

export async function createUserApi(dto: CreateUserDto, token: string) {
  const { data } = await apiClient.post<ApiResponse<UserDto>>("/api/v1/users", dto, {
    headers: authHeaders(token),
  })
  return data
}

export async function updateUserApi(id: number, dto: UpdateUserDto, token: string) {
  const { data } = await apiClient.put<ApiResponse<UserDto>>(`/api/v1/users/${id}`, dto, {
    headers: authHeaders(token),
  })
  return data
}

export async function deleteUserApi(id: number, token: string) {
  await apiClient.delete(`/api/v1/users/${id}`, {
    headers: authHeaders(token),
  })
}
