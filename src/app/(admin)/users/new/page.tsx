import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { UserForm } from "../_components/user-form"

export default function NewUserPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">Add user</h1>
      </div>

      <UserForm />
    </div>
  )
}
