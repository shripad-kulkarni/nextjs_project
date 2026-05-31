import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getInfoSettingsAdminApi } from "@/lib/api/settings"
import { InfoSettingsForm } from "./_components/info-settings-form"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session) redirect("/login")

  let settings = { name: "My App" }
  try {
    settings = await getInfoSettingsAdminApi(session.token)
  } catch {
    // use fallback
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your organisation info shown across the website
        </p>
      </div>

      <InfoSettingsForm settings={settings} />
    </div>
  )
}
