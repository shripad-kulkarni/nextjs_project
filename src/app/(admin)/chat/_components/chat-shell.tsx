"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, MessageSquare, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/stores/chat-store"
import type { ChatUserDto } from "@/types/chat"
import { uploadChatFileApi } from "@/lib/api/chat"
import { ConversationSidebar } from "./conversation-sidebar"
import { MessageThread } from "./message-thread"
import { MessageInput } from "./message-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  token: string
  currentUserId: string
  initialUsers: ChatUserDto[]
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

// Height fills the admin content area on every breakpoint:
//  < sm : mobile header (3.5rem) + py-6 padding (3rem)   = 6.5rem
//  sm–lg: mobile header (3.5rem) + py-8 padding (4rem)   = 7.5rem
//  lg+  : no header     (0)      + py-8 padding (4rem)   = 4rem
const SHELL_HEIGHT =
  "h-[calc(100vh-6.5rem)] sm:h-[calc(100vh-7.5rem)] lg:h-[calc(100vh-4rem)]"

export function ChatShell({ token, currentUserId, initialUsers }: Props) {
  const {
    init, destroy, isConnected,
    threads, unreadCounts,
    loadThread, sendMessage, markThreadAsRead,
  } = useChatStore()

  const [selectedUser, setSelectedUser] = useState<ChatUserDto | null>(null)
  // "sidebar" | "thread" — used on mobile to show one panel at a time
  const [mobilePanel, setMobilePanel] = useState<"sidebar" | "thread">("sidebar")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    init(token, currentUserId)
    return () => { destroy() }
  }, [token, currentUserId])

  async function handleSelectUser(user: ChatUserDto) {
    setSelectedUser(user)
    setMobilePanel("thread")
    setLoading(true)
    try {
      await loadThread(user.identityId)
      await markThreadAsRead(user.identityId)
    } catch {
      toast.error("Failed to load conversation.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(content: string, file?: File) {
    if (!selectedUser) return
    try {
      let fileUrl: string | undefined
      let fileName: string | undefined
      if (file) {
        const uploaded = await uploadChatFileApi(file, token)
        fileUrl = uploaded.url
        fileName = uploaded.fileName
      }
      await sendMessage(selectedUser.identityId, content, fileUrl, fileName)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send message.")
    }
  }

  const messages = selectedUser ? (threads[selectedUser.identityId] ?? []) : []

  return (
    <div className={cn("flex rounded-xl border border-slate-200 overflow-hidden bg-gray-50 shadow-sm", SHELL_HEIGHT)}>

      {/* ── Contacts sidebar ──────────────────────────────────────────
          Mobile : full-width, visible only when mobilePanel="sidebar"
          md+    : fixed 288px, always visible                        */}
      <div className={cn(
        "flex-col overflow-hidden border-r border-slate-200 bg-white",
        "md:flex md:w-72 md:shrink-0",
        mobilePanel === "sidebar" ? "flex w-full" : "hidden md:flex",
      )}>
        <ConversationSidebar
          users={initialUsers}
          selectedId={selectedUser?.identityId ?? null}
          unreadCounts={unreadCounts}
          onSelect={handleSelectUser}
        />
      </div>

      {/* ── Thread area ───────────────────────────────────────────────
          Mobile : full-width, visible only when mobilePanel="thread"
          md+    : flex-1, always visible                              */}
      <div className={cn(
        "flex-col min-w-0 overflow-hidden",
        "md:flex md:flex-1",
        mobilePanel === "thread" ? "flex flex-1" : "hidden md:flex",
      )}>
        {selectedUser ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-white border-b border-slate-200 shrink-0">
              {/* Back button — mobile only */}
              <button
                onClick={() => setMobilePanel("sidebar")}
                className="md:hidden h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-gray-500 hover:bg-slate-100 transition-colors"
                aria-label="Back to contacts"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={selectedUser.profilePhotoUrl ?? undefined} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                  {getInitials(selectedUser.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {selectedUser.fullName}
                </p>
                <p className="text-xs text-gray-400 truncate hidden sm:block">
                  {selectedUser.email}
                </p>
              </div>

              {!isConnected && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 shrink-0">
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reconnecting…</span>
                </div>
              )}
            </div>

            {/* Messages */}
            {loading ? (
              <div className="flex-1 flex flex-col gap-3 p-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48 self-end" : "w-56 self-start"}`}
                  />
                ))}
              </div>
            ) : (
              <MessageThread
                messages={messages}
                currentUserId={currentUserId}
                otherUser={selectedUser}
              />
            )}

            <MessageInput onSend={handleSend} disabled={!isConnected} />
          </>
        ) : (
          /* Empty state — only visible on desktop when nothing is selected */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 select-none">
            <MessageSquare className="h-12 w-12 text-slate-200" />
            <p className="text-sm">Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}
