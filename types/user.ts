// User related types
export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  email: string
  username?: string
  role: UserRole
  created_at?: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export interface LoginCredentials {
  email: string
  password: string
}

// Constants
export const USER_ROLES: UserRole[] = ['admin', 'user']
