export const dynamic = "force-dynamic"

import { WebsiteShell } from "@/components/website/website-shell"

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <WebsiteShell>{children}</WebsiteShell>
}
