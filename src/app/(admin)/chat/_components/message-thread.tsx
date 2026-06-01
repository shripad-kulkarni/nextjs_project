"use client"

import { useEffect, useRef } from "react"
import { format, isToday, isYesterday } from "date-fns"
import { Download, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatMessageDto, ChatUserDto } from "@/types/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  messages: ChatMessageDto[]
  currentUserId: string
  otherUser: ChatUserDto
}

function formatTime(isoDate: string) {
  const date = new Date(isoDate)
  if (isToday(date)) return format(date, "HH:mm")
  if (isYesterday(date)) return `Yesterday ${format(date, "HH:mm")}`
  return format(date, "d MMM, HH:mm")
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

function FileAttachment({ fileUrl, fileName, isMine }: { fileUrl: string; fileName: string; isMine: boolean }) {
  if (isImageUrl(fileUrl)) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block mt-1">
        <img
          src={fileUrl}
          alt={fileName}
          className="max-w-[240px] rounded-lg object-cover"
          loading="lazy"
        />
      </a>
    )
  }

  return (
    <a
      href={fileUrl}
      download={fileName}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 mt-1 px-3 py-2 rounded-lg text-sm transition-colors",
        isMine
          ? "bg-blue-500 hover:bg-blue-400 text-white"
          : "bg-slate-100 hover:bg-slate-200 text-gray-700",
      )}
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span className="truncate max-w-[180px]">{fileName}</span>
      <Download className="h-3.5 w-3.5 shrink-0 ml-auto" />
    </a>
  )
}

export function MessageThread({ messages, currentUserId, otherUser }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 select-none">
        No messages yet. Say hello!
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 min-h-0">
      <div className="flex flex-col gap-1 px-4 py-4">
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId
          const hasText = msg.content.length > 0
          const hasFile = !!msg.fileUrl && !!msg.fileName

          return (
            <div
              key={msg.id}
              className={cn(
                "flex items-end gap-2 max-w-[75%]",
                isMine ? "self-end flex-row-reverse" : "self-start",
              )}
            >
              {!isMine && (
                <Avatar className="h-7 w-7 shrink-0 mb-0.5">
                  <AvatarImage src={otherUser.profilePhotoUrl ?? undefined} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {getInitials(otherUser.fullName)}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm leading-relaxed break-words",
                  isMine
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-gray-800 rounded-bl-sm shadow-sm",
                )}
              >
                {hasText && <p>{msg.content}</p>}

                {hasFile && (
                  <FileAttachment
                    fileUrl={msg.fileUrl!}
                    fileName={msg.fileName!}
                    isMine={isMine}
                  />
                )}

                <span
                  className={cn(
                    "block text-right text-[10px] mt-0.5",
                    isMine ? "text-blue-200" : "text-gray-400",
                  )}
                >
                  {formatTime(msg.sentAt)}
                  {isMine && (
                    <span className="ml-1">{msg.isRead ? "✓✓" : "✓"}</span>
                  )}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
