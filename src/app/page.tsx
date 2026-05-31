export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WebsiteShell } from "@/components/website-shell"
import { ShieldCheck, LayoutDashboard, Users, MapPin, Phone, Mail } from "lucide-react"
import { getInfoSettingsApi } from "@/lib/api/settings"

const features = [
  {
    icon: ShieldCheck,
    title: "Authentication",
    description: "JWT-based login and registration backed by a .NET Core API with ASP.NET Core Identity.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Clean sidebar layout ready to extend with your own pages and data.",
    color: "bg-violet-50 text-violet-700",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Full CRUD — create, search, paginate, edit, and delete users out of the box.",
    color: "bg-emerald-50 text-emerald-700",
  },
]

export default async function LandingPage() {
  const settings = await getInfoSettingsApi()

  return (
    <WebsiteShell>
      {/* Hero */}
      <section className="py-28 px-4 text-center bg-gradient-to-b from-blue-50 via-white to-white">
        {settings.logoPath && (
          <img
            src={settings.logoPath}
            alt={settings.name}
            className="h-16 w-16 rounded-xl object-cover mx-auto mb-6 shadow-sm"
          />
        )}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-5">
          Welcome to{" "}
          <span className="text-blue-700">{settings.name}</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          A complete platform for management, authentication, and operations — built and ready to use.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/register">
            <Button size="lg" className="px-8">Get started</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="px-8">Sign in</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
            Everything you need
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Powerful features built right in
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info — only shown if settings have contact data */}
      {(settings.address || settings.phoneNumber || settings.email) && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Get in touch</h2>
              <p className="text-gray-500 mt-1">We are here to help</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {settings.address && (
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-white shadow-sm text-sm text-gray-700">
                  <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
                  {settings.address}
                </div>
              )}
              {settings.phoneNumber && (
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-white shadow-sm text-sm text-gray-700">
                  <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                  {settings.phoneNumber}
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-2.5 px-5 py-3 rounded-xl border bg-white shadow-sm text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-violet-500 shrink-0" />
                  {settings.email}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">
            Create your account and start using {settings.name} in minutes.
          </p>
          <Link href="/register">
            <Button size="lg" className="px-10">
              Create account
            </Button>
          </Link>
        </div>
      </section>
    </WebsiteShell>
  )
}
