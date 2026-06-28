"use client"

import { create } from "zustand"
import * as signalR from "@microsoft/signalr"
import type { ChatMessageDto, ChatUserDto } from "@/types/chat"
import { getConversationApi, markAsReadApi } from "@/lib/api/chat"

interface ChatState {
  connection: signalR.HubConnection | null
  isConnected: boolean
  currentUserId: string
  token: string
  // messages keyed by the other user's identityId
  threads: Record<string, ChatMessageDto[]>
  // per-user unread count keyed by sender identityId
  unreadCounts: Record<string, number>

  init: (token: string, currentUserId: string) => Promise<void>
  destroy: () => Promise<void>
  loadThread: (otherUserId: string) => Promise<void>
  sendMessage: (receiverId: string, content: string, fileUrl?: string, fileName?: string) => Promise<void>
  markThreadAsRead: (senderId: string) => Promise<void>
  totalUnread: () => number
}

export const useChatStore = create<ChatState>((set, get) => ({
  connection: null,
  isConnected: false,
  currentUserId: "",
  token: "",
  threads: {},
  unreadCounts: {},

  init: async (token, currentUserId) => {
    if (get().connection) return

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5187/api"
    // Hub lives at the root, not under /api
    const hubBaseUrl = apiUrl.replace(/\/api$/, "")

    // skipNegotiation + WebSockets avoids the HTTP negotiation fetch entirely.
    // This prevents self-signed cert rejections and CORS preflight failures in dev.
    // SignalR converts http:// → ws:// and https:// → wss:// automatically.
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${hubBaseUrl}/hubs/chat`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connection.on("ReceiveMessage", (message: ChatMessageDto) => {
      const { currentUserId: me } = get()
      const otherUserId =
        message.senderId === me ? message.receiverId : message.senderId

      set((s) => {
        const existing = s.threads[otherUserId] ?? []
        if (existing.some((m) => m.id === message.id)) return s

        const isMine = message.senderId === me
        return {
          threads: {
            ...s.threads,
            [otherUserId]: [...existing, message],
          },
          unreadCounts: isMine
            ? s.unreadCounts
            : {
                ...s.unreadCounts,
                [otherUserId]: (s.unreadCounts[otherUserId] ?? 0) + 1,
              },
        }
      })
    })

    connection.on("MessagesRead", ({ by }: { by: string }) => {
      set((s) => ({
        threads: {
          ...s.threads,
          [by]: (s.threads[by] ?? []).map((m) => ({ ...m, isRead: true })),
        },
      }))
    })

    connection.onclose(() => set({ isConnected: false }))
    connection.onreconnected(() => set({ isConnected: true }))

    await connection.start()
    set({ connection, isConnected: true, token, currentUserId })
  },

  destroy: async () => {
    const conn = get().connection
    if (conn) await conn.stop()
    set({ connection: null, isConnected: false, threads: {}, unreadCounts: {} })
  },

  loadThread: async (otherUserId) => {
    const { token } = get()
    if (!token) return
    const messages = await getConversationApi(otherUserId, token)
    set((s) => ({ threads: { ...s.threads, [otherUserId]: messages } }))
  },

  sendMessage: async (receiverId, content, fileUrl, fileName) => {
    const conn = get().connection
    if (!conn || conn.state !== signalR.HubConnectionState.Connected)
      throw new Error("Not connected to chat.")
    await conn.invoke("SendMessage", { receiverId, content, fileUrl, fileName })
  },

  markThreadAsRead: async (senderId) => {
    const { token, unreadCounts } = get()
    if (!token || !unreadCounts[senderId]) return
    try {
      const conn = get().connection
      if (conn?.state === signalR.HubConnectionState.Connected)
        await conn.invoke("MarkAsRead", senderId)
      else
        await markAsReadApi(senderId, token)
    } catch {
      // best-effort
    }
    set((s) => {
      const counts = { ...s.unreadCounts }
      delete counts[senderId]
      return { unreadCounts: counts }
    })
  },

  totalUnread: () => Object.values(get().unreadCounts).reduce((a, b) => a + b, 0),
}))
