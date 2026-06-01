export interface ChatMessageDto {
  id: number
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  sentAt: string // ISO date string
  fileUrl?: string | null
  fileName?: string | null
}

export interface ChatUserDto {
  identityId: string
  fullName: string
  email: string
  profilePhotoUrl?: string | null
}
