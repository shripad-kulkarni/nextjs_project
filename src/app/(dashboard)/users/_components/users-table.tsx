"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { UserDto } from "@/types/user"

interface Props {
  users: UserDto[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  onEdit: (user: UserDto) => void
  onDelete: (user: UserDto) => void
}

export function UsersTable({
  users,
  totalCount,
  pageNumber,
  totalPages,
  onEdit,
  onDelete,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-16 text-center text-muted-foreground text-sm">
        No users found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Date of birth</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-slate-100 text-slate-600">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm leading-none">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">#{user.id}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-sm">{user.email}</TableCell>

              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {user.gender}
                </Badge>
              </TableCell>

              <TableCell className="text-sm">{user.phone}</TableCell>

              <TableCell className="text-sm">
                {format(parseISO(user.dateOfBirth), "dd MMM yyyy")}
              </TableCell>

              <TableCell className="text-sm">{user.city}</TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3 border-t text-sm">
        <span className="text-muted-foreground">
          {totalCount} user{totalCount !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber <= 1}
          >
            Previous
          </Button>
          <span className="text-muted-foreground px-1">
            {pageNumber} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
