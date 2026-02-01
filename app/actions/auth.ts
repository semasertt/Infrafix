'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { loginSchema } from '@/lib/validation'
import { handleServerActionError, AuthError } from '@/lib/error'
import { getCurrentUser, getUserRole } from '@/lib/auth'
import type { ApiResponse } from '@/types/api'
import type { User } from '@/types/user'

// Login with email/password (Supabase Auth)
export async function login(formData: FormData): Promise<ApiResponse<{ user: User }>> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate
    const validated = loginSchema.parse({ email, password })

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      throw new AuthError(error.message)
    }

    if (!data.user) {
      throw new AuthError('Giriş başarısız')
    }

    // Get user role
    const role = await getUserRole(data.user.id)

    revalidatePath('/')
    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          role: role || 'user',
        },
      },
    }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Logout
export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}

// Get current user
export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const role = await getUserRole(user.id)
    return {
      id: user.id,
      email: user.email || '',
      role: role || 'user',
    }
  } catch {
    return null
  }
}

// Get user with role
export async function getUserWithRole(): Promise<{ user: User; role: string } | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const role = await getUserRole(user.id)
    if (!role) return null

    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: role as 'admin' | 'user',
      },
      role,
    }
  } catch {
    return null
  }
}
