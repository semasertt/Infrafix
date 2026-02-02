// Centralized validation schemas using Zod
import { z } from 'zod'
import type { FaultType, FaultStatus, CriticalityLevel } from '@/types/fault'

// Location validation
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

// Fault report validation
export const faultReportSchema = z.object({
  konum: locationSchema,
  aciklama: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır').max(1000, 'Açıklama en fazla 1000 karakter olabilir'),
  tur: z.enum(['Elektrik', 'Su', 'Yol', 'Aydınlatma', 'Park', 'Diğer']),
  kritiklik: z.number().int().min(1).max(5),
  telefon: z.string().optional().nullable(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().nullable(),
})

// Fault status update validation
export const faultStatusUpdateSchema = z.object({
  id: z.number().int().positive(),
  durum: z.enum(['Beklemede', 'İnceleniyor', 'Çözüldü', 'Arşivlendi']),
})

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

// Fault filters validation
export const faultFiltersSchema = z.object({
  tur: z.enum(['Elektrik', 'Su', 'Yol', 'Aydınlatma', 'Park', 'Diğer'])
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
    .optional(),
  durum: z.enum(['Beklemede', 'İnceleniyor', 'Çözüldü', 'Arşivlendi'])
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val)
    .optional(),
  kritiklik: z.union([
    z.string(),
    z.number().int().min(1).max(5)
  ])
    .optional()
    .transform(val => {
      if (val === '' || val === null || val === undefined) return undefined
      return typeof val === 'string' ? parseInt(val) : val
    }),
  page: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).optional(),
})

// Type exports
export type FaultReportInput = z.infer<typeof faultReportSchema>
export type FaultStatusUpdateInput = z.infer<typeof faultStatusUpdateSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type FaultFiltersInput = z.infer<typeof faultFiltersSchema>
