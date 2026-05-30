import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getUsersApi } from "@/lib/api/users"
import { UsersClient } from "./_components/users-client"

interface Props {
  searchParams: Promise<{
    search?: string
    gender?: string
    page?: string
  }>
}

export default async function UsersPage({ searchParams }: Props) {
  const sp = await searchParams
  const session = await getSession()
  if (!session) redirect("/login")

  let users: Awaited<ReturnType<typeof getUsersApi>> | null = null

  try {
    users = await getUsersApi(
      {
        searchTerm: sp.search,
        gender: sp.gender,
        pageNumber: Number(sp.page) || 1,
        pageSize: 10,
      },
      session.token,
    )
  } catch {
    // leave users null — client renders empty state
  }

  return (
    <UsersClient
      users={users?.data ?? []}
      totalCount={users?.totalCount ?? 0}
      pageNumber={users?.pageNumber ?? 1}
      pageSize={users?.pageSize ?? 10}
      totalPages={users?.totalPages ?? 1}
      defaultSearch={sp.search ?? ""}
      defaultGender={sp.gender ?? ""}
    />
  )
}
