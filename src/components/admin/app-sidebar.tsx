"use client"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

export function AppSidebar({ userName, userEmail, signOut }: Props) {
  const pathname = usePathname()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r bg-white h-full">
      {/* Logo / brand */}
      <div className="h-16 flex items-center px-5 border-b shrink-0">
        <span className="font-bold text-blue-700 text-base tracking-tight">Admin Panel</span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 flex flex-col gap-0.5">
          <TooltipProvider delayDuration={0}>
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link
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
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      {/* User footer */}
      <div className="border-t p-4 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
            {userName?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
        <form action={signOut}>
          <Button variant="outline" size="sm" className="w-full gap-2 text-gray-600">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
