import apiClient from "./client"
import type { ContactFilterParams, PaginatedContactResponse } from "@/types/contact"

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function getContactMessagesApi(filter: ContactFilterParams, token: string) {
  const params: Record<string, unknown> = {
    pageNumber: filter.page ?? 1,
    pageSize: filter.pageSize ?? 10,
  }
  if (filter.search)   params.search   = filter.search
  if (filter.isRead)   params.isRead   = filter.isRead
  if (filter.dateFrom) params.dateFrom  = filter.dateFrom
  if (filter.dateTo)   params.dateTo    = filter.dateTo

  const { data } = await apiClient.get<PaginatedContactResponse>("/v1/contact", {
    params,
    headers: authHeaders(token),
  })
  return data
}
