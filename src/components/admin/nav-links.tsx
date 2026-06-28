"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Mail,
  Settings,
  UserCircle,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true  },
  { href: "/users",     label: "Users",      icon: Users,           exact: false },
  { href: "/chat",      label: "Chat",       icon: MessageSquare,   exact: false },
  { href: "/messages",  label: "Messages",   icon: Mail,            exact: false },
  { href: "/settings",  label: "Settings",   icon: Settings,        exact: true  },
  { href: "/profile",   label: "Profile",    icon: UserCircle,      exact: true  },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
