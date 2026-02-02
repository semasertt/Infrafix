'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { faultReportSchema, faultStatusUpdateSchema, faultFiltersSchema } from '@/lib/validation'
import { handleServerActionError, ValidationError, NotFoundError } from '@/lib/error'
import { requireAdmin } from '@/lib/auth'
import type { ApiResponse, SuccessResponse, ErrorResponse } from '@/types/api'
import type { Fault, FaultFilters } from '@/types/fault'

// Public: Arıza bildir
export async function reportFault(formData: FormData): Promise<ApiResponse<Fault>> {
  try {
    const data = {
      konum: JSON.parse(formData.get('konum') as string),
      aciklama: formData.get('aciklama') as string,
      tur: formData.get('tur') as string,
      kritiklik: parseInt(formData.get('kritiklik') as string),
      telefon: formData.get('telefon') as string || null,
      email: formData.get('email') as string || null,
    }

    // Validate
    const validated = faultReportSchema.parse(data)

    const supabase = await createClient()

    const { data: fault, error } = await supabase
      .from('arizalar')
      .insert({
        konum: validated.konum,
        aciklama: validated.aciklama,
        tur: validated.tur,
        kritiklik: validated.kritiklik,
        durum: 'Beklemede',
        telefon: validated.telefon,
        email: validated.email,
        tarih: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/')
    return { success: true, data: fault as Fault }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arızaları listele
export async function getFaults(filters?: FaultFilters): Promise<ApiResponse<Fault[]>> {
  try {
    await requireAdmin()

    // Boş string'leri undefined'a çevir (validation hatasını önlemek için)
    const cleanedFilters = filters ? {
      ...Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [
          key,
          value === '' || value === null ? undefined : value
        ])
      )
    } : {}

    // Validate filters (sadece tanımlı değerler için)
    const validatedFilters = Object.keys(cleanedFilters).length > 0 
      ? faultFiltersSchema.parse(cleanedFilters) 
      : {}

    const supabase = await createClient()

    let query = supabase
      .from('arizalar')
      .select('*')
      .order('tarih', { ascending: false })

    if (validatedFilters.tur) {
      query = query.eq('tur', validatedFilters.tur)
    }
    if (validatedFilters.durum) {
      query = query.eq('durum', validatedFilters.durum)
    }
    if (validatedFilters.kritiklik) {
      query = query.eq('kritiklik', validatedFilters.kritiklik)
    }

    const { data, error } = await query

    if (error) {
      console.error('getFaults error:', error)
      return { success: false, error: error.message }
    }

    console.log('getFaults success:', { count: data?.length || 0, filters: validatedFilters })
    return { success: true, data: data as Fault[] }
  } catch (error) {
    console.error('getFaults validation error:', error)
    return handleServerActionError(error)
  }
}

// Admin: Tek arıza getir
export async function getFault(id: number): Promise<ApiResponse<Fault>> {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('arizalar')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      throw new NotFoundError('Arıza bulunamadı')
    }

    return { success: true, data: data as Fault }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Durum güncelle
export async function updateFaultStatus(id: number, durum: string): Promise<ApiResponse<Fault>> {
  try {
    await requireAdmin()

    const validated = faultStatusUpdateSchema.parse({ id, durum })

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('arizalar')
      .update({ durum: validated.durum })
      .eq('id', validated.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, data: data as Fault }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arıza sil
export async function deleteFault(id: number): Promise<ApiResponse<void>> {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { error } = await supabase
      .from('arizalar')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arşivle
export async function archiveFault(id: number): Promise<ApiResponse<void>> {
  try {
    await requireAdmin()

    const supabase = await createClient()

    // Get fault
    const { data: fault, error: fetchError } = await supabase
      .from('arizalar')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !fault) {
      throw new NotFoundError('Arıza bulunamadı')
    }

    // Move to archive
    const { error: archiveError } = await supabase
      .from('arsiv')
      .insert({
        konum: fault.konum,
        aciklama: fault.aciklama,
        tur: fault.tur,
        kritiklik: fault.kritiklik,
        durum: fault.durum,
        telefon: fault.telefon,
        email: fault.email,
        tarih: fault.tarih,
      })

    if (archiveError) {
      return { success: false, error: archiveError.message }
    }

    // Delete from main table
    const { error: deleteError } = await supabase
      .from('arizalar')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/archive')
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arşiv listesi
export async function getArchivedFaults(filters?: Pick<FaultFilters, 'tur'>): Promise<ApiResponse<Fault[]>> {
  try {
    await requireAdmin()

    const validatedFilters = filters ? faultFiltersSchema.partial().parse(filters) : {}

    const supabase = await createClient()

    let query = supabase
      .from('arsiv')
      .select('*')
      .order('tarih', { ascending: false })

    if (validatedFilters.tur) {
      query = query.eq('tur', validatedFilters.tur)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Fault[] }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arşivden geri al
export async function restoreFault(id: number): Promise<ApiResponse<void>> {
  try {
    await requireAdmin()

    const supabase = await createClient()

    // Get archived fault
    const { data: fault, error: fetchError } = await supabase
      .from('arsiv')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !fault) {
      throw new NotFoundError('Arıza bulunamadı')
    }

    // Restore to main table
    const { error: restoreError } = await supabase
      .from('arizalar')
      .insert({
        konum: fault.konum,
        aciklama: fault.aciklama,
        tur: fault.tur,
        kritiklik: fault.kritiklik,
        durum: fault.durum,
        telefon: fault.telefon,
        email: fault.email,
        tarih: fault.tarih,
      })

    if (restoreError) {
      return { success: false, error: restoreError.message }
    }

    // Delete from archive
    const { error: deleteError } = await supabase
      .from('arsiv')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/archive')
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}

// Admin: Arşivden kalıcı sil
export async function deleteArchivedFault(id: number): Promise<ApiResponse<void>> {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { error } = await supabase
      .from('arsiv')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/archive')
    return { success: true }
  } catch (error) {
    return handleServerActionError(error)
  }
}
