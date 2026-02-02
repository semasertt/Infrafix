// Fault related types
export type FaultType = 'Elektrik' | 'Su' | 'Yol' | 'Aydınlatma' | 'Park' | 'Diğer'

export type FaultStatus = 'Beklemede' | 'İnceleniyor' | 'Çözüldü' | 'Arşivlendi'

export type CriticalityLevel = 1 | 2 | 3 | 4 | 5

export interface Location {
  lat: number
  lng: number
}

export interface Fault {
  id: number
  konum: Location
  aciklama: string
  tur: FaultType
  kritiklik: CriticalityLevel
  durum: FaultStatus
  telefon: string | null
  email: string | null
  tarih: string
  created_at?: string
}

export interface FaultFormData {
  konum: Location
  aciklama: string
  tur: FaultType
  kritiklik: CriticalityLevel
  telefon?: string
  email?: string
}

export interface FaultFilters {
  tur?: FaultType
  durum?: FaultStatus
  kritiklik?: number | string
  page?: number
  limit?: number
}

export interface FaultUpdateData {
  id: number
  durum: FaultStatus
}

// Constants
export const FAULT_TYPES: FaultType[] = ['Elektrik', 'Su', 'Yol', 'Aydınlatma', 'Park', 'Diğer']

export const FAULT_STATUSES: FaultStatus[] = ['Beklemede', 'İnceleniyor', 'Çözüldü', 'Arşivlendi']

export const CRITICALITY_LEVELS: CriticalityLevel[] = [1, 2, 3, 4, 5]

export const CRITICALITY_LABELS: Record<CriticalityLevel, string> = {
  1: 'Çok Düşük',
  2: 'Düşük',
  3: 'Orta',
  4: 'Yüksek',
  5: 'Çok Yüksek (Acil)',
}
