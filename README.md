# InfraFix - Konum Bazlı Arıza İhbar Sistemi

Modern, sade ve güncel mimari ile konum bazlı arıza bildirim ve yönetim sistemi.

## 🚀 Teknoloji Stack

- **Next.js 14** (App Router) - Full-stack framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Supabase** - Database + Authentication
- **Leaflet.js** - Harita entegrasyonu
- **Zod** - Validation

## ✨ Özellikler

- ✅ Next.js Server Actions (API routes yok!)
- ✅ Supabase Auth (JWT otomatik yönetiliyor)
- ✅ Supabase RLS (Row Level Security)
- ✅ Leaflet.js harita entegrasyonu
- ✅ TypeScript desteği
- ✅ Responsive design
- ✅ Tek repo, tek deploy

## 📋 Hızlı Başlangıç

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Environment Variables

`.env.local.example` dosyasını `.env.local` olarak kopyala:

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenle (Supabase bilgileri):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Supabase Setup

1. Supabase dashboard'a git
2. `SUPABASE_RLS.md` dosyasındaki RLS policy'lerini uygula
3. Tabloları oluştur: `arizalar`, `arsiv`, `users`

### 4. Development Server

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacak.

## 🏗️ Modüler Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions (backend logic)
│   │   ├── auth.ts        # Auth operations
│   │   └── faults.ts      # Fault operations
│   ├── admin/             # Admin page
│   ├── archive/           # Archive page
│   ├── login/             # Login page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/             # React Components
│   ├── common/            # Shared components (Button, Toast, Skeleton)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LoginForm.tsx
│   ├── FaultReportForm.tsx
│   ├── MapSelector.tsx
│   ├── AdminPanel.tsx
│   └── ArchivePanel.tsx
├── hooks/                  # Custom React Hooks
│   ├── useAuth.ts          # Auth state management
│   ├── useFaults.ts        # Faults data fetching
│   └── useLoading.ts       # Loading state
├── state/                  # Global State (Zustand)
│   ├── userStore.ts        # User state
│   └── faultsStore.ts      # Faults state
├── types/                  # TypeScript Types
│   ├── fault.ts            # Fault types & constants
│   ├── user.ts             # User types
│   └── api.ts              # API response types
├── lib/                    # Library & Utilities
│   ├── supabase/           # Supabase clients
│   ├── auth.ts             # Auth helpers
│   ├── error.ts            # Error handling
│   └── validation.ts       # Zod schemas
├── utils/                  # Helper Functions
│   ├── formatDate.ts       # Date formatting
│   ├── sanitize.ts         # Input sanitization
│   └── constants.ts        # App constants
└── package.json
```

**Detaylı yapı için:** `STRUCTURE.md` dosyasına bakın.

## 🔐 Authentication

Supabase Auth kullanılıyor. Login için email/password gerekiyor.

**Admin kullanıcısı oluşturma:**
1. Supabase Auth dashboard'dan kullanıcı oluştur
2. `users` tablosunda `role = 'admin'` olarak güncelle

## 📝 Server Actions

Next.js Server Actions kullanılıyor. API routes yok!

**Örnek:**
```typescript
// app/actions/faults.ts
'use server'

export async function reportFault(formData: FormData) {
  const supabase = await createClient()
  // Server-side code
}
```

## 🗺️ Harita

Leaflet.js kullanılıyor. Client component olarak implement edildi.

## 🚀 Production Deploy

### Vercel (Önerilen)

1. GitHub'a push et
2. Vercel'e bağla
3. Environment variables'ları ekle
4. Deploy!

### Build

```bash
npm run build
npm start
```

## 📚 Dokümantasyon

- `SUPABASE_RLS.md` - RLS policy'leri ve Supabase setup
- `README.md` - Bu dosya

## 🎯 Mimari Avantajlar

1. **Tek Repo:** Frontend + backend aynı yerde
2. **Server Actions:** API routes'a gerek yok
3. **Supabase:** Auth + DB hazır
4. **RLS:** Güvenlik Supabase'de
5. **Deploy Kolay:** Vercel + Supabase = 10 dakika

## 📄 License

ISC
