export const dynamic = "force-dynamic"

import { MapPin, Phone, Mail } from "lucide-react"
import { getInfoSettingsApi } from "@/lib/api/settings"
import { ContactForm } from "./_components/contact-form"

export default async function ContactPage() {
  const settings = await getInfoSettingsApi()

  const contactItems = [
    { icon: MapPin, label: "Address",       value: settings.address,     href: null,                                    color: "bg-emerald-50 text-emerald-600" },
    { icon: Phone,  label: "Phone",         value: settings.phoneNumber, href: settings.phoneNumber ? `tel:${settings.phoneNumber}` : null,   color: "bg-blue-50 text-blue-600"    },
    { icon: Mail,   label: "Email",         value: settings.email,       href: settings.email ? `mailto:${settings.email}` : null,            color: "bg-violet-50 text-violet-600" },
  ].filter((i) => i.value)

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Contact Us
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question or want to get in touch with {settings.name}?
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Contact info — left */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Get in touch</h2>

            {contactItems.length > 0 ? contactItems.map(({ icon: Icon, label, value, href, color }) => (
              <div key={label} className="flex items-start gap-4 p-4 rounded-xl border bg-white shadow-sm">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-900">{value}</p>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground italic">
                No contact info configured yet.
              </p>
            )}
          </div>

          {/* Contact form — right */}
          <div className="lg:col-span-3 rounded-xl border bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Send us a message</h2>
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
