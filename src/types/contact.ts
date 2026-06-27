export interface ContactMessageDto {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

export interface ContactFilterParams {
  search?: string
  isRead?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface PaginatedContactResponse {
  isSuccess: boolean
  message: string
  data: ContactMessageDto[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
