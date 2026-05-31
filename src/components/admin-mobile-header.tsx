"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LayoutDashboard, Users, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/users",     label: "Users",     icon: Users,           exact: false },
  { href: "/settings",  label: "Settings",  icon: Settings,        exact: true  },
]

interface Props {
  userName: string
  userEmail: string
  signOut: () => Promise<never>
}

export function AdminMobileHeader({ userName, userEmail, signOut }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="lg:hidden flex items-center h-14 px-4 shrink-0 bg-slate-100 border-b border-slate-200">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-3">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 flex flex-col bg-slate-100">
          {/* Logo */}
          <div className="h-14 flex items-center px-5 border-b border-slate-200 shrink-0">
            <span className="font-bold text-blue-600 text-lg tracking-tight">My App</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:bg-slate-200 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* User + sign out */}
          <div className="p-2 border-t border-slate-200 shrink-0 space-y-1">
            <div className="flex items-center gap-3 px-2 py-2 rounded-md">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate text-gray-900">{userName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{userEmail}</p>
              </div>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <span className="font-bold text-white text-lg tracking-tight">My App</span>
    </div>
  )
}
