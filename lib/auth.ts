// Auth helpers and utilities
import { createClient } from '@/lib/supabase/server'
import { AuthError, ForbiddenError } from './error'
import type { UserRole } from '@/types/user'

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Get user role from users table
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient()
  
  // Cache'i bypass etmek için direkt sorgu yap
  const { data, error } = await supabase
    .from('users')
    .select('role, email')
    .eq('id', userId)
    .maybeSingle() // single() yerine maybeSingle() kullan - null dönebilir

  if (error) {
    console.error('getUserRole error:', { 
      userId, 
      error: error.message, 
      code: error.code,
      details: error
    })
    return null
  }

  if (!data) {
    console.warn('getUserRole: No data returned for userId:', userId)
    return null
  }

  console.log('getUserRole success:', { 
    userId, 
    email: data.email,
    role: data.role 
  })
  return (data.role as UserRole) || null
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const role = await getUserRole(user.id)
  return role === 'admin'
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthError('Giriş yapmanız gerekiyor')
  }
  return user
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const role = await getUserRole(user.id)

  if (role !== 'admin') {
    throw new ForbiddenError('Bu işlem için admin yetkisi gereklidir')
  }

  return { user, role }
}

/**
 * Get user with role
 */
export async function getUserWithRole() {
  const user = await getCurrentUser()
  if (!user) return null

  const role = await getUserRole(user.id)
  return { user, role }
}
