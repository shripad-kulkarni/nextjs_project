import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getChatUsersApi } from "@/lib/api/chat"
import { ChatShell } from "./_components/chat-shell"

export const metadata = { title: "Chat" }

export default async function ChatPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  let users: Awaited<ReturnType<typeof getChatUsersApi>> = []
  try {
    users = await getChatUsersApi(session.token)
  } catch (err) {
    console.error("[ChatPage] Failed to load chat users:", err)
  }

  return (
    <ChatShell
      token={session.token}
      currentUserId={session.id}
      initialUsers={users}
    />
  )
}
