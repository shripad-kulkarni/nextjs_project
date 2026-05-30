import Link from "next/link"
import { Button } from "@/components/ui/button"

export function WebsiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <WebsiteHeader />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  )
}

function WebsiteHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-blue-700 tracking-tight">
          My App
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function WebsiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm text-gray-500">© {year} My App. All rights reserved.</span>
        <nav className="flex items-center gap-5">
          <Link href="/about" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            About
          </Link>
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Sign in
          </Link>
        </nav>
      </div>
    </footer>
  )
}
