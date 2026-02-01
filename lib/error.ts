// Centralized error handling
import type { ApiResponse, ErrorResponse } from '@/types/api'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'AUTH_ERROR', 401)
    this.name = 'AuthError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN_ERROR', 403)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 'NOT_FOUND_ERROR', 404)
    this.name = 'NotFoundError'
  }
}

// Error handler for Server Actions
export function handleServerActionError(error: unknown): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      message: error.message,
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      message: 'Bir hata oluştu',
    }
  }

  return {
    success: false,
    error: 'Bilinmeyen bir hata oluştu',
    message: 'Bir hata oluştu',
  }
}

// Format error for client display
export function formatError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Bilinmeyen bir hata oluştu'
}
