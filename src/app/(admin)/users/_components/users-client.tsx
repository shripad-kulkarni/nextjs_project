"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Users, UserCheck, UserX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserFilters } from "./user-filters"
import { UsersTable } from "./users-table"
import { DeleteDialog } from "./delete-dialog"
import { ExportButtons } from "./export-buttons"
import type { UserDto } from "@/types/user"

interface Props {
  users: UserDto[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  defaultSearch?: string
  defaultGender?: string
}

export function UsersClient({
  users,
  totalCount,
  pageNumber,
  pageSize,
  totalPages,
  defaultSearch = "",
  defaultGender = "",
}: Props) {
  const router = useRouter()
  const [deleteUser, setDeleteUser] = useState<UserDto | null>(null)

  const maleCount   = users.filter((u) => u.gender === "Male").length
  const femaleCount = users.filter((u) => u.gender === "Female").length

  const stats = [
    {
      label: "Total Users",
      value: totalCount,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Male",
      value: maleCount,
      icon: UserCheck,
      gradient: "from-sky-400 to-cyan-500",
      bg: "bg-sky-50",
      text: "text-sky-600",
    },
    {
      label: "Female",
      value: femaleCount,
      icon: UserCheck,
      gradient: "from-pink-400 to-rose-500",
      bg: "bg-pink-50",
      text: "text-pink-600",
    },
    {
      label: "Other",
      value: users.filter((u) => u.gender === "Other").length,
      icon: UserX,
      gradient: "from-violet-400 to-purple-500",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount} total user{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ExportButtons />
          <Button onClick={() => router.push("/users/new")} className="flex-1 sm:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, bg, text }) => (
          <div key={label} className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
            <div className="p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${text}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UserFilters defaultSearch={defaultSearch} defaultGender={defaultGender} />

      <UsersTable
        users={users}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={totalPages}
        onDelete={setDeleteUser}
      />

      <DeleteDialog
        open={!!deleteUser}
        onOpenChange={(v) => { if (!v) setDeleteUser(null) }}
        user={deleteUser}
      />
    </div>
  )
}
