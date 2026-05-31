import { getSession } from "@/lib/session"
import { Users, LayoutDashboard, ShieldCheck, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Total Users",
    value: "—",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    label: "Active Sessions",
    value: "1",
    icon: TrendingUp,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    label: "Admin Panel",
    value: "Live",
    icon: LayoutDashboard,
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    label: "Security",
    value: "JWT",
    icon: ShieldCheck,
    gradient: "from-orange-400 to-pink-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
]

export default async function DashboardPage() {
  const session = await getSession()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, {session?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Signed in as {session?.email}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, gradient, bg, text }) => (
          <div key={label} className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
            <div className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-5 w-5 ${text}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Getting started card */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="p-6">
          <h2 className="text-base font-semibold text-gray-900">Getting started</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your dashboard is ready. Head to{" "}
            <span className="text-blue-600 font-medium">Users</span> to manage your team.
          </p>
        </div>
      </div>
    </div>
  )
}
