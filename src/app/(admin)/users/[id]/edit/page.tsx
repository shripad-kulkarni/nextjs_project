import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getSession } from "@/lib/session"
import { getUserByIdApi } from "@/lib/api/users"
import { UserForm } from "../../_components/user-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params
  const session = await getSession()

  let user = null
  try {
    user = await getUserByIdApi(Number(id), session!.token)
  } catch {
    notFound()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to users
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit user</h1>
        <p className="text-muted-foreground mt-1">{user.fullName}</p>
      </div>

      <UserForm user={user} />
    </div>
  )
}
