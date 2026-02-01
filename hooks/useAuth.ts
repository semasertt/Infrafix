// Auth hook for managing authentication state
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/state/userStore'
import { getCurrentUserAction, getUserWithRole } from '@/app/actions/auth'

export function useAuth() {
  const router = useRouter()
  const { user, role, isAuthenticated, setUser, setRole, setLoading, logout: storeLogout } = useUserStore()

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    setLoading(true)
    try {
      const userData = await getCurrentUserAction()
      if (userData) {
        const userWithRole = await getUserWithRole()
        if (userWithRole) {
          setUser(userData)
          setRole(userWithRole.role as 'admin' | 'user')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    storeLogout()
    router.push('/login')
    router.refresh()
  }

  return {
    user,
    role,
    isAuthenticated,
    isLoading: useUserStore((state) => state.isLoading),
    checkAuth,
    logout,
    isAdmin: role === 'admin',
  }
}
