"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserFilters } from "./user-filters"
import { UsersTable } from "./users-table"
import { UserFormDialog } from "./user-form-dialog"
import { DeleteDialog } from "./delete-dialog"
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
  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserDto | null>(null)
  const [deleteUser, setDeleteUser] = useState<UserDto | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount} total user{totalCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add user
        </Button>
      </div>

      <UserFilters defaultSearch={defaultSearch} defaultGender={defaultGender} />

      <UsersTable
        users={users}
        totalCount={totalCount}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalPages={totalPages}
        onEdit={setEditUser}
        onDelete={setDeleteUser}
      />

      {/* Create dialog */}
      <UserFormDialog open={createOpen} onOpenChange={setCreateOpen} />

      {/* Edit dialog */}
      <UserFormDialog
        open={!!editUser}
        onOpenChange={(v) => { if (!v) setEditUser(null) }}
        user={editUser}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={!!deleteUser}
        onOpenChange={(v) => { if (!v) setDeleteUser(null) }}
        user={deleteUser}
      />
    </div>
  )
}
