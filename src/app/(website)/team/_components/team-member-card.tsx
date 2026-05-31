import type { UserDto } from "@/types/user"

export function TeamMemberCard({ member }: { member: UserDto }) {
  return (
    <div className="group h-80 [perspective:1000px] cursor-pointer">
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* Front — photo + name */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl border bg-white shadow-sm flex flex-col items-center justify-center gap-5 p-6">
          {member.profilePhotoUrl ? (
            <img
              src={member.profilePhotoUrl}
              alt={member.fullName}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-offset-2 ring-blue-100"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-semibold text-slate-400 select-none">
              {member.firstName[0]}{member.lastName[0]}
            </div>
          )}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">{member.fullName}</h3>
            <p className="text-xs text-muted-foreground mt-1">Hover to learn more</p>
          </div>
        </div>

        {/* Back — description */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-blue-50 border border-blue-100 shadow-sm p-7 flex flex-col items-center justify-center text-center gap-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {member.description ?? "No description provided."}
          </p>
          <p className="text-blue-600 text-sm font-semibold">{member.fullName}</p>
        </div>

      </div>
    </div>
  )
}
