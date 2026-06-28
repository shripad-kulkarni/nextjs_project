"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  UserCircle,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/users",     label: "Users",      icon: Users,           exact: false },
  { href: "/chat",      label: "Chat",       icon: MessageSquare,   exact: false },
  { href: "/messages",  label: "Messages",   icon: Mail,            exact: false },
  { href: "/settings",  label: "Settings",   icon: Settings,        exact: true  },
  { href: "/profile",   label: "Profile",    icon: UserCircle,      exact: true  },
]

interface Props {
  userName: string
  userEmail: string | null
  signOut: () => Promise<void>
}

export function AdminMobileHeader({ userName, userEmail, signOut }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      <header className="md:hidden h-14 flex items-center justify-between px-4 border-b bg-white shrink-0">
        <span className="font-bold text-blue-700 text-sm">Admin Panel</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Slide-down mobile menu */}
      {open && (
        <div className="md:hidden border-b bg-white z-40 shrink-0">
          <nav className="px-3 py-2 flex flex-col gap-0.5">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="px-4 py-3 border-t flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userEmail}</p>
            </div>
            <form action={signOut}>
              <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
