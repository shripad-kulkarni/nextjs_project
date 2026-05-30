import { getSession } from "@/lib/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">Signed in as {session?.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Getting started</CardTitle>
            <CardDescription>Your dashboard is ready</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You are authenticated. Build your features here.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
