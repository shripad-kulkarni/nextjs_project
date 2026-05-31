export const dynamic = "force-dynamic"

import { getPublicUsersApi } from "@/lib/api/users"
import { getInfoSettingsApi } from "@/lib/api/settings"
import type { UserDto } from "@/types/user"
import { TeamMemberCard } from "./_components/team-member-card"

export default async function TeamPage() {
  const [settings, usersResult] = await Promise.all([
    getInfoSettingsApi(),
    getPublicUsersApi({ pageSize: 100 }).catch(() => null),
  ])

  const members: UserDto[] = usersResult?.data ?? []

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Meet the Team</h1>
        <p className="text-muted-foreground text-lg">The people behind {settings.name}</p>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">
          No team members to display yet.
        </p>
      )}
    </section>
  )
}
