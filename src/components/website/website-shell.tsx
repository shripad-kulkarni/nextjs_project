import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { getInfoSettingsApi, type InfoSettings } from "@/lib/api/settings"
import { WebsiteHeader } from "@/components/website/website-header"

export async function WebsiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getInfoSettingsApi()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <WebsiteHeader settings={settings} />
      <main className="flex-1 pt-16">{children}</main>
      <WebsiteFooter settings={settings} />
    </div>
  )
}

function WebsiteFooter({ settings }: { settings: InfoSettings }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {settings.logoPath && (
                <img
                  src={settings.logoPath}
                  alt={settings.name}
                  className="h-7 w-7 rounded object-cover"
                />
              )}
              <span className="font-bold text-gray-900">{settings.name}</span>
            </div>
            <p className="text-sm text-gray-500">
              A complete platform for management & operations.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Navigation</p>
            <nav className="flex flex-col gap-1.5">
              {[
                { href: "/",        label: "Home"    },
                { href: "/about",   label: "About"   },
                { href: "/team",    label: "Team"    },
                { href: "/contact", label: "Contact" },
                { href: "/login",   label: "Sign in" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Contact</p>
            <div className="flex flex-col gap-2">
              {settings.address && (
                <span className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                  {settings.address}
                </span>
              )}
              {settings.phoneNumber && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {settings.phoneNumber}
                </span>
              )}
              {settings.email && (
                <span className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  {settings.email}
                </span>
              )}
              {!settings.address && !settings.phoneNumber && !settings.email && (
                <span className="text-sm text-gray-400 italic">No contact info set.</span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-xs text-gray-400">
          © {year} {settings.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
