"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChatUserDto } from "@/types/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Props {
  users: ChatUserDto[]
  selectedId: string | null
  unreadCounts: Record<string, number>
  onSelect: (user: ChatUserDto) => void
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function ConversationSidebar({ users, selectedId, unreadCounts, onSelect }: Props) {
  const [query, setQuery] = useState("")

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <aside className="w-full flex flex-col border-r border-slate-200 bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search contacts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-slate-50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-8">No contacts found.</p>
        ) : (
          <ul className="py-1">
            {filtered.map((user) => {
              const unread = unreadCounts[user.identityId] ?? 0
              const isActive = selectedId === user.identityId
              return (
                <li key={user.identityId}>
                  <button
                    onClick={() => onSelect(user)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                      isActive
                        ? "bg-blue-50 border-r-2 border-blue-600"
                        : "hover:bg-slate-50",
                    )}
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage src={user.profilePhotoUrl ?? undefined} />
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-semibold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    {unread > 0 && (
                      <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-blue-600 hover:bg-blue-600 shrink-0">
                        {unread > 99 ? "99+" : unread}
                      </Badge>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </ScrollArea>
    </aside>
  )
}
