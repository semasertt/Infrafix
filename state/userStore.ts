// User state management with Zustand
import { create } from 'zustand'
import type { User, UserRole } from '@/types/user'

interface UserState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  
  // Actions
  setUser: (user: User | null) => void
  setRole: (role: UserRole | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  role: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),

  setRole: (role) => set({ role }),

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => set({ 
    user: null, 
    role: null, 
    isAuthenticated: false 
  }),

  isAdmin: () => get().role === 'admin',
}))
