import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react"
import type { InfoSettings } from "@/lib/api/settings"

const trustItems = [
  "No credit card required",
  "Free to get started",
  "Data stays in India",
]

const highlights = [
  "Role-based access control",
  "Email verification built in",
  "Real-time chat & messaging",
  "PDF reports & document uploads",
]

interface Props {
  settings: InfoSettings
}

export function HomeHero({ settings }: Props) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">

      {/* Full-page background image */}
      <img
        src="/hero.jfif"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-black/55" aria-hidden />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 py-20">

        {/* Badge */}
        <div className="mb-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            Trusted by organisations across India
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Logo + Headline */}
        <div className="space-y-5 mb-8 max-w-3xl">
          {settings.logoPath && (
            <img
              src={settings.logoPath}
              alt={settings.name}
              className="h-14 w-14 rounded-xl object-cover shadow-lg"
            />
          )}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Run your organisation{" "}
            <span className="text-blue-400">smarter.</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-xl leading-relaxed">
            {settings.name} gives your team everything — user management, documents,
            real-time chat, and analytics — in one secure platform.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-base gap-2">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base bg-transparent text-white border-white/40 hover:bg-white/10"
            >
              Talk to us
            </Button>
          </Link>
        </div>

        {/* Highlights */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 mb-8">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        {/* Trust line */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {trustItems.map((t) => (
            <span key={t} className="text-xs text-white/50 flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-white/40 inline-block" />
              {t}
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}
