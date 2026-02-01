// Faults hook for managing faults data
'use client'

import { useEffect } from 'react'
import { useFaultsStore } from '@/state/faultsStore'
import { getFaults, getArchivedFaults } from '@/app/actions/faults'
import type { FaultFilters } from '@/types/fault'

export function useFaults(filters?: FaultFilters, includeArchived = false) {
  const {
    faults,
    archivedFaults,
    isLoading,
    error,
    setFaults,
    setArchivedFaults,
    setLoading,
    setError,
    clearError,
  } = useFaultsStore()

  const loadFaults = async () => {
    setLoading(true)
    clearError()
    
    try {
      if (includeArchived) {
        const archivedResult = await getArchivedFaults(filters)
        if (archivedResult.success && archivedResult.data) {
          setArchivedFaults(archivedResult.data)
        } else {
          setError(archivedResult.error || 'Arşiv yüklenemedi')
        }
      } else {
        const result = await getFaults(filters)
        if (result.success && result.data) {
          setFaults(result.data)
        } else {
          setError(result.error || 'Arızalar yüklenemedi')
        }
      }
    } catch (err) {
      setError('Bir hata oluştu')
      console.error('Failed to load faults:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaults()
  }, [JSON.stringify(filters), includeArchived])

  return {
    faults: includeArchived ? archivedFaults : faults,
    isLoading,
    error,
    refetch: loadFaults,
  }
}
