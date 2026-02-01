// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total?: number
  }
}

export interface ErrorResponse {
  success: false
  error: string
  message?: string
  details?: unknown
}

export interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
}
