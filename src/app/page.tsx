export const dynamic = "force-dynamic"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WebsiteShell } from "@/components/website/website-shell"
import { HomeHero } from "@/components/website/home/home-hero"
import {
  ArrowRight,
  Shield,
  Users,
  FileText,
  MessageSquare,
  BarChart2,
  Settings,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react"
import { getInfoSettingsApi } from "@/lib/api/settings"

const capabilities = [
  {
    icon: Shield,
    title: "Identity & Access",
    description: "Multi-role authentication, email verification, password reset, and granular access control — secured with JWT.",
    accent: "blue",
  },
  {
    icon: Users,
    title: "People Management",
    description: "Onboard, search, edit, and deactivate users. Track profiles, upload documents, and export data instantly.",
    accent: "violet",
  },
  {
    icon: FileText,
    title: "Documents & Reports",
    description: "Generate PDF certificates and profile reports on demand. Manage and download user documents from one place.",
    accent: "emerald",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Built-in messaging between users with SignalR. Supports file attachments and unread count tracking.",
    accent: "amber",
  },
  {
    icon: BarChart2,
    title: "Analytics & Insights",
    description: "At-a-glance dashboards, filterable data tables, and export-ready reports to keep you informed.",
    accent: "rose",
  },
  {
    icon: Settings,
    title: "System Settings",
    description: "Customize your organisation name, logo, and contact details. Changes reflect site-wide immediately.",
    accent: "slate",
  },
]

const accentMap: Record<string, { icon: string; border: string; bg: string }> = {
  blue:   { icon: "text-blue-600",   border: "border-blue-100",   bg: "bg-blue-50"   },
  violet: { icon: "text-violet-600", border: "border-violet-100", bg: "bg-violet-50" },
  emerald:{ icon: "text-emerald-600",border: "border-emerald-100",bg: "bg-emerald-50"},
  amber:  { icon: "text-amber-600",  border: "border-amber-100",  bg: "bg-amber-50"  },
  rose:   { icon: "text-rose-600",   border: "border-rose-100",   bg: "bg-rose-50"   },
  slate:  { icon: "text-slate-600",  border: "border-slate-200",  bg: "bg-slate-100" },
}

const testimonials = [
  {
    quote: "Exactly what we needed — secure login, role management, and a clean admin panel out of the box.",
    name: "Priya Sharma",
    role: "Operations Head",
    initials: "PS",
    color: "bg-blue-100 text-blue-700",
  },
  {
    quote: "The document upload and PDF generation saved us hours of manual work every single week.",
    name: "Rahul Desai",
    role: "Admin Manager",
    initials: "RD",
    color: "bg-violet-100 text-violet-700",
  },
  {
    quote: "Real-time chat between staff has completely replaced our WhatsApp groups. So much cleaner.",
    name: "Meera Joshi",
    role: "Team Lead",
    initials: "MJ",
    color: "bg-emerald-100 text-emerald-700",
  },
]

const stats = [
  { value: "500+", label: "Active Users", icon: Users },
  { value: "99.9%", label: "Uptime SLA",   icon: TrendingUp },
  { value: "< 200ms", label: "API Response", icon: Clock },
  { value: "ISO 27001", label: "Data Security", icon: Award },
]

export default async function LandingPage() {
  const settings = await getInfoSettingsApi()

  return (
    <WebsiteShell>

      <HomeHero settings={settings} />

      {/* ─────────────────────────────────────────
          STATS BAR
      ───────────────────────────────────────── */}
      <section className="border-y bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-gray-200">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center px-6">
              <Icon className="h-5 w-5 text-blue-600 mb-1" />
              <span className="text-2xl font-extrabold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CAPABILITIES
      ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Platform capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              One platform. Every tool you need.
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Purpose-built features that work together seamlessly — no third-party integrations required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map(({ icon: Icon, title, description, accent }) => {
              const a = accentMap[accent]
              return (
                <div
                  key={title}
                  className={`p-6 rounded-2xl border ${a.border} bg-white hover:shadow-md transition-all group`}
                >
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${a.bg}`}>
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          TESTIMONIALS
      ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Trusted by teams every day
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, initials, color }) => (
              <div
                key={name}
                className="flex flex-col gap-5 p-7 rounded-2xl border bg-gray-50 hover:bg-white hover:shadow-md transition-all"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${color}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{name}</p>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          CONTACT (conditional)
      ───────────────────────────────────────── */}
      {(settings.address || settings.phoneNumber || settings.email) && (
        <section className="py-16 px-4 bg-gray-50 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Reach us</h2>
              <p className="text-gray-500 mt-1">We typically respond within one business day</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {settings.address && (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-white shadow-sm text-sm text-gray-700">
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Address</p>
                    <p className="font-medium text-gray-800">{settings.address}</p>
                  </div>
                </div>
              )}
              {settings.phoneNumber && (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-white shadow-sm text-sm text-gray-700">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Phone</p>
                    <p className="font-medium text-gray-800">{settings.phoneNumber}</p>
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl border bg-white shadow-sm text-sm text-gray-700">
                  <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Email</p>
                    <p className="font-medium text-gray-800">{settings.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────
          CTA BANNER
      ───────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Start managing smarter{" "}
            <span className="text-blue-400">today.</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join {settings.name} and give your team the tools they deserve.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-10 text-base gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/40"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-10 text-base bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                Contact sales
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 text-sm">No credit card needed · Free forever plan available</p>
        </div>
      </section>

    </WebsiteShell>
  )
}
