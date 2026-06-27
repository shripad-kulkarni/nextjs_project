"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { ContactMessageDto } from "@/types/contact"

interface Props {
  messages: ContactMessageDto[]
  pageNumber: number
  totalPages: number
  totalCount: number
}

export function ContactsTable({ messages, pageNumber, totalPages, totalCount }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-16 text-center text-muted-foreground text-sm">
        No contact messages found.
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-gray-700">From</TableHead>
              <TableHead className="font-semibold text-gray-700">Phone</TableHead>
              <TableHead className="font-semibold text-gray-700">Subject</TableHead>
              <TableHead className="font-semibold text-gray-700">Message</TableHead>
              <TableHead className="font-semibold text-gray-700">Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id} className="hover:bg-slate-50/60">
                <TableCell>
                  <p className="font-medium text-sm text-gray-900">{msg.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{msg.email}</p>
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  {msg.phone ?? "—"}
                </TableCell>

                <TableCell className="text-sm font-medium text-gray-800">
                  {msg.subject}
                </TableCell>

                <TableCell className="text-sm text-gray-600 max-w-xs">
                  <p className="truncate">{msg.message}</p>
                </TableCell>

                <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                  {format(parseISO(msg.createdAt), "dd MMM yyyy")}
                </TableCell>

                <TableCell>
                  {msg.isRead ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      Read
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      Unread
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50 text-sm">
        <span className="text-muted-foreground">
          {totalCount} message{totalCount !== 1 ? "s" : ""}
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
