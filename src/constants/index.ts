// ─── Auth ────────────────────────────────────────────────────────────────────

export const SESSION_COOKIE = "auth_session"
export const SESSION_EXPIRY = 60 * 60 // seconds
export const ROLES = ["Admin", "Manager", "User", "Guest"] as const

// ─── User ────────────────────────────────────────────────────────────────────

export const GENDERS = ["Male", "Female", "Other"] as const
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const

// ─── File sizes ───────────────────────────────────────────────────────────────

export const MAX_PROFILE_PHOTO_SIZE = 5 * 1024 * 1024   // 5 MB
export const MAX_INTRO_VIDEO_SIZE   = 100 * 1024 * 1024 // 100 MB

// ─── Routes ───────────────────────────────────────────────────────────────────

export const PROTECTED_ROUTES = ["/dashboard", "/users"]
