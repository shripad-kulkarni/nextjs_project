import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { signOutAction } from "@/actions/auth"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { AdminMobileHeader } from "@/components/admin/admin-mobile-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="fixed inset-0 flex bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <AppSidebar
        userName={session.name}
        userEmail={session.email}
        signOut={signOutAction}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <AdminMobileHeader
          userName={session.name}
          userEmail={session.email}
          signOut={signOutAction}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
