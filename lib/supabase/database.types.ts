// Supabase database types
// Bu dosya Supabase dashboard'dan otomatik generate edilebilir
// Şimdilik manuel olarak tanımlıyoruz

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      arizalar: {
        Row: {
          id: number
          konum: Json
          aciklama: string
          tur: string
          kritiklik: number
          durum: string
          telefon: string | null
          email: string | null
          tarih: string
          created_at: string
        }
        Insert: {
          id?: number
          konum: Json
          aciklama: string
          tur: string
          kritiklik: number
          durum?: string
          telefon?: string | null
          email?: string | null
          tarih?: string
          created_at?: string
        }
        Update: {
          id?: number
          konum?: Json
          aciklama?: string
          tur?: string
          kritiklik?: number
          durum?: string
          telefon?: string | null
          email?: string | null
          tarih?: string
          created_at?: string
        }
      }
      arsiv: {
        Row: {
          id: number
          konum: Json
          aciklama: string
          tur: string
          kritiklik: number
          durum: string
          telefon: string | null
          email: string | null
          tarih: string
          created_at: string
        }
        Insert: {
          id?: number
          konum: Json
          aciklama: string
          tur: string
          kritiklik: number
          durum?: string
          telefon?: string | null
          email?: string | null
          tarih?: string
          created_at?: string
        }
        Update: {
          id?: number
          konum?: Json
          aciklama?: string
          tur?: string
          kritiklik?: number
          durum?: string
          telefon?: string | null
          email?: string | null
          tarih?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: number
          username: string
          email: string | null
          role: string
          olusturma_tarihi: string
          created_at: string
        }
        Insert: {
          id?: number
          username: string
          email?: string | null
          role?: string
          olusturma_tarihi?: string
          created_at?: string
        }
        Update: {
          id?: number
          username?: string
          email?: string | null
          role?: string
          olusturma_tarihi?: string
          created_at?: string
        }
      }
    }
  }
}
