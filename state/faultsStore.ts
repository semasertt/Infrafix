// Faults state management with Zustand
import { create } from 'zustand'
import type { Fault, FaultFilters } from '@/types/fault'

interface FaultsState {
  faults: Fault[]
  archivedFaults: Fault[]
  filters: FaultFilters
  isLoading: boolean
  error: string | null
  
  // Actions
  setFaults: (faults: Fault[]) => void
  setArchivedFaults: (faults: Fault[]) => void
  addFault: (fault: Fault) => void
  updateFault: (id: number, updates: Partial<Fault>) => void
  removeFault: (id: number) => void
  setFilters: (filters: FaultFilters) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useFaultsStore = create<FaultsState>((set) => ({
  faults: [],
  archivedFaults: [],
  filters: {},
  isLoading: false,
  error: null,

  setFaults: (faults) => set({ faults }),

  setArchivedFaults: (archivedFaults) => set({ archivedFaults }),

  addFault: (fault) => set((state) => ({
    faults: [fault, ...state.faults]
  })),

  updateFault: (id, updates) => set((state) => ({
    faults: state.faults.map((fault) =>
      fault.id === id ? { ...fault, ...updates } : fault
    )
  })),

  removeFault: (id) => set((state) => ({
    faults: state.faults.filter((fault) => fault.id !== id)
  })),

  setFilters: (filters) => set({ filters }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))
