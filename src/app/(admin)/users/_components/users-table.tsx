"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { MoreHorizontal, Pencil, Trash2, FileDown, Award, Loader2 } from "lucide-react"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { UserDto } from "@/types/user"

const avatarPalette = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
]

const genderBadge: Record<string, string> = {
  Male:   "bg-sky-50 text-sky-700 border border-sky-200",
  Female: "bg-pink-50 text-pink-700 border border-pink-200",
  Other:  "bg-violet-50 text-violet-700 border border-violet-200",
}

interface Props {
  users: UserDto[]
  totalCount: number
  pageNumber: number
  pageSize: number
  totalPages: number
  onDelete: (user: UserDto) => void
}

export function UsersTable({
  users,
  totalCount,
  pageNumber,
  totalPages,
  onDelete,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [downloadingProfileId, setDownloadingProfileId] = useState<number | null>(null)
  const [downloadingCertId, setDownloadingCertId] = useState<number | null>(null)

  const downloadFile = async (
    userId: number,
    apiPath: string,
    fileName: string,
    setLoading: (id: number | null) => void,
    errorMsg: string,
  ) => {
    setLoading(userId)
    try {
      const res = await fetch(apiPath)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(errorMsg)
    } finally {
      setLoading(null)
    }
  }

  const downloadProfile = (userId: number) =>
    downloadFile(
      userId,
      `/api/users/${userId}/profile-report`,
      `UserReport_${userId}.pdf`,
      setDownloadingProfileId,
      "Failed to download profile report.",
    )

  const downloadCertificate = (userId: number) =>
    downloadFile(
      userId,
      `/api/users/${userId}/certificate`,
      `Certificate_${userId}.pdf`,
      setDownloadingCertId,
      "Failed to download certificate.",
    )

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center text-muted-foreground text-sm">
        No users found.
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-gray-700">User</TableHead>
              <TableHead className="font-semibold text-gray-700">Email</TableHead>
              <TableHead className="font-semibold text-gray-700">Gender</TableHead>
              <TableHead className="font-semibold text-gray-700">Phone</TableHead>
              <TableHead className="font-semibold text-gray-700">Date of birth</TableHead>
              <TableHead className="font-semibold text-gray-700">City</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const avatarColor = avatarPalette[user.id % avatarPalette.length]
              const badge = genderBadge[user.gender] ?? "bg-gray-50 text-gray-600 border border-gray-200"

              return (
                <TableRow key={user.id} className="hover:bg-slate-50/60">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor}`}>
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">#{user.id}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">{user.email}</TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge}`}>
                      {user.gender}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">{user.phone}</TableCell>

                  <TableCell className="text-sm text-gray-600">
                    {format(parseISO(user.dateOfBirth), "dd MMM yyyy")}
                  </TableCell>

                  <TableCell className="text-sm text-gray-600">{user.city}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/users/${user.id}/edit`)}
                          className="text-blue-600 focus:text-blue-700 focus:bg-blue-50"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => downloadProfile(user.id)}
                          disabled={downloadingProfileId === user.id}
                        >
                          {downloadingProfileId === user.id
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <FileDown className="mr-2 h-4 w-4" />
                          }
                          Download Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => downloadCertificate(user.id)}
                          disabled={downloadingCertId === user.id}
                        >
                          {downloadingCertId === user.id
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Award className="mr-2 h-4 w-4" />
                          }
                          Download Certificate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(user)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 text-sm">
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
          <span className="text-muted-foreground px-1 font-medium">
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
