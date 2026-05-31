export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  token: string
}

export interface ApiResponse<T = undefined> {
  isSuccess: boolean
  message: string
  data?: T
  errors?: string[]
}

export type Role = "Admin" | "Manager" | "User" | "Guest"
