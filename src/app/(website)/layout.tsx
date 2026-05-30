import { WebsiteShell } from "@/components/website-shell"

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <WebsiteShell>{children}</WebsiteShell>
}
