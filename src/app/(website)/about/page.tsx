export const dynamic = "force-dynamic"

import { MapPin, Phone, Mail, Building2 } from "lucide-react"
import { getInfoSettingsApi } from "@/lib/api/settings"

export default async function AboutPage() {
  const settings = await getInfoSettingsApi()

  const contactItems = [
    { icon: Building2, label: "Organisation", value: settings.name,   color: "bg-blue-50 text-blue-600"    },
    { icon: MapPin,    label: "Address",       value: settings.address,      color: "bg-emerald-50 text-emerald-600" },
    { icon: Phone,     label: "Phone",         value: settings.phoneNumber,  color: "bg-violet-50 text-violet-600"   },
    { icon: Mail,      label: "Email",         value: settings.email,        color: "bg-orange-50 text-orange-600"   },
  ].filter((item) => item.value)

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Heading */}
        <div className="text-center space-y-3">
          {settings.logoPath && (
            <img
              src={settings.logoPath}
              alt={settings.name}
              className="h-20 w-20 rounded-xl object-cover mx-auto shadow-sm"
            />
          )}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {settings.name}
          </h1>
          <p className="text-gray-500 text-lg">
            Learn more about us and how to get in touch.
          </p>
        </div>

        {/* Contact cards */}
        {contactItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {contactItems.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-start gap-4 p-5 rounded-xl border bg-white shadow-sm">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm italic">
            Contact information has not been configured yet.
          </p>
        )}
      </div>
    </section>
  )
}
