import { cookies } from "next/headers"

export const SESSION_COOKIE = "auth_session"

export interface SessionData {
  token: string
  id: string
  name: string
  email: string
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionData
  } catch {
    return null
  }
}
