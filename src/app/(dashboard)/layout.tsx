import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { signOutAction } from "@/actions/auth"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AppSidebar
        userName={session.name}
        userEmail={session.email}
        signOut={signOutAction}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
