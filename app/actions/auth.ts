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

    // Get user role - direkt sorgu ile, cache sorununu önlemek için
    let role: string | null = null
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', data.user.id)
      .single()
    
    console.log('Login - User data query:', { 
      userId: data.user.id, 
      email: data.user.email,
      userData, 
      userError: userError?.message,
      errorCode: userError?.code
    })
    
    if (userError && userError.code === 'PGRST116') {
      // Kullanıcı public.users'da yok, ekle
      console.log('User not found in public.users, inserting...')
      const { error: insertError, data: insertedData } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email || '',
          role: 'user',
        })
        .select()
        .single()
      
      if (insertError && insertError.code !== '23505') { // 23505 = duplicate key
        console.error('Failed to insert user:', insertError)
        role = 'user' // Default role
      } else {
        role = insertedData?.role || 'user'
        console.log('User inserted with role:', role)
      }
    } else if (userError) {
      console.error('Error fetching user role:', userError)
      role = 'user' // Default role
    } else {
      role = userData?.role || 'user'
      console.log('User role found:', role)
    }

    revalidatePath('/')
    revalidatePath('/admin')
    
    return {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          role: role as 'admin' | 'user',
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
