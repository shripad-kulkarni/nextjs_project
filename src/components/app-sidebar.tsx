"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, LogOut, ChevronLeft, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

export function AppSidebar({ userName, userEmail, signOut }: Props) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 h-screen transition-all duration-300 overflow-hidden",
          "bg-slate-100 border-r border-slate-200",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo + collapse toggle */}
        <div className="h-14 flex items-center shrink-0 px-3 gap-2 border-b border-slate-200">
          {!collapsed && (
            <span className="flex-1 font-bold text-blue-600 text-lg tracking-tight truncate">
              My App
            </span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0",
              collapsed && "mx-auto",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(href + "/")

            const linkClass = cn(
              "flex items-center rounded-md transition-colors text-sm font-medium",
              isActive
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-500 hover:bg-slate-200 hover:text-gray-900",
              collapsed ? "justify-center h-9 w-full" : "gap-3 px-3 py-2",
            )

            if (collapsed) {
              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>
                    <Link href={href} className={linkClass}>
                      <Icon className="h-4 w-4 shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={href} href={href} className={linkClass}>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="p-2 border-t border-slate-200 shrink-0 space-y-1">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center py-1 cursor-default">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                    {initials}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3 px-2 py-2 rounded-md">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate text-gray-900">{userName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{userEmail}</p>
              </div>
            </div>
          )}

          <form action={signOut}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center h-9 rounded-md text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-slate-200 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            )}
          </form>
        </div>
      </aside>
    </TooltipProvider>
  )
}
