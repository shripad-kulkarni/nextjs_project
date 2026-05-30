import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WebsiteShell } from "@/components/website-shell"
import { ShieldCheck, LayoutDashboard, Users } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Authentication",
    description:
      "JWT-based login and registration backed by a .NET Core API with ASP.NET Core Identity.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description:
      "Clean sidebar layout ready to extend with your own pages and data.",
  },
  {
    icon: Users,
    title: "User Management",
    description:
      "Full CRUD — create, search, paginate, edit, and delete users out of the box.",
  },
]

export default function LandingPage() {
  return (
    <WebsiteShell>
      {/* Hero */}
      <section className="py-28 px-4 text-center bg-gradient-to-b from-blue-50 via-white to-white">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-5">
          Build faster with{" "}
          <span className="text-blue-700">My App</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          A production-ready full-stack template — Next.js 16 frontend with a .NET Core clean
          architecture API, authentication included.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <Button size="lg" className="px-8">Get started for free</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8">Sign in</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to ship
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-blue-200 mb-8">
            Create your account and start building in minutes.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-10">
              Create free account
            </Button>
          </Link>
        </div>
      </section>
    </WebsiteShell>
  )
}
