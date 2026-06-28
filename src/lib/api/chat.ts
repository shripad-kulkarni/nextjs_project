import apiClient from "./client"
import type { ApiResponse } from "@/types/auth"
import type { ChatMessageDto, ChatUserDto } from "@/types/chat"

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function getChatUsersApi(token: string): Promise<ChatUserDto[]> {
  const { data } = await apiClient.get<ApiResponse<ChatUserDto[]>>("/v1/chat/users", {
    headers: authHeaders(token),
  })
  return data.data ?? []
}

export async function getConversationApi(
  otherUserId: string,
  token: string,
  page = 1,
  pageSize = 50,
): Promise<ChatMessageDto[]> {
  const { data } = await apiClient.get<ApiResponse<ChatMessageDto[]>>(
    `/v1/chat/${otherUserId}`,
    {
      params: { page, pageSize },
      headers: authHeaders(token),
    },
  )
  return data.data ?? []
}

export async function markAsReadApi(senderId: string, token: string): Promise<void> {
  await apiClient.post(`/v1/chat/${senderId}/read`, null, {
    headers: authHeaders(token),
  })
}

export async function getUnreadCountApi(token: string): Promise<number> {
  const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
    "/v1/chat/unread-count",
    { headers: authHeaders(token) },
  )
  return data.data?.count ?? 0
}

export async function uploadChatFileApi(
  file: File,
  token: string,
): Promise<{ url: string; fileName: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5187/api"
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${baseUrl}/v1/chat/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json?.message ?? "Upload failed.")
  return json.data as { url: string; fileName: string }
}
