import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getContactMessagesApi } from "@/lib/api/contact"
import { ContactFilters } from "./_components/contact-filters"
import { ContactsTable } from "./_components/contacts-table"

interface Props {
  searchParams: Promise<{
    search?: string
    isRead?: string
    dateFrom?: string
    dateTo?: string
    page?: string
  }>
}

export default async function MessagesPage({ searchParams }: Props) {
  const sp = await searchParams
  const session = await getSession()
  if (!session) redirect("/login")

  let result: Awaited<ReturnType<typeof getContactMessagesApi>> | null = null

  try {
    result = await getContactMessagesApi(
      {
        search:   sp.search,
        isRead:   sp.isRead,
        dateFrom: sp.dateFrom,
        dateTo:   sp.dateTo,
        page:     Number(sp.page) || 1,
        pageSize: 10,
      },
      session.token,
    )
  } catch {
    // leave null — table renders empty state
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages submitted via the contact form.</p>
      </div>

      <ContactFilters
        defaultSearch={sp.search ?? ""}
        defaultIsRead={sp.isRead ?? ""}
        defaultDateFrom={sp.dateFrom ?? ""}
        defaultDateTo={sp.dateTo ?? ""}
      />

      <ContactsTable
        messages={result?.data ?? []}
        pageNumber={result?.pageNumber ?? 1}
        totalPages={result?.totalPages ?? 1}
        totalCount={result?.totalCount ?? 0}
      />
    </div>
  )
}
