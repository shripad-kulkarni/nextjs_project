export interface UserDto {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  dateOfBirth: string // "YYYY-MM-DD" — .NET DateOnly JSON format
  gender: string
  street: string
  city: string
  state: string
  pinCode: string
  bloodGroup?: string | null
  emergencyContact?: string | null
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string // note: 'phoneNumber' on create, 'phone' on update/response
  dateOfBirth: string
  gender: string
  street: string
  city: string
  state: string
  pinCode: string
  bloodGroup?: string
  emergencyContact?: string
}

export interface UpdateUserDto {
  firstName: string
  lastName: string
  phone: string
  street: string
  city: string
  state: string
  pinCode: string
}

export interface UserFilterParams {
  searchTerm?: string
  gender?: string
  isActive?: boolean
  pageNumber?: number
  pageSize?: number
}

export interface PaginatedApiResponse<T> {
  isSuccess: boolean
  message: string
  data: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export const GENDERS = ["Male", "Female", "Other"] as const
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const
