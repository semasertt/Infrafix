<div align="center">

# 🏗️ InfraFix - Konum Bazlı Arıza İhbar Sistemi

**Modern, Güvenli ve Kullanıcı Dostu Şehir Altyapı Yönetim Platformu**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.39-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

[🚀 Özellikler](#-özellikler) • [📦 Kurulum](#-kurulum) • [🏗️ Mimari](#️-mimari) • [📚 Dokümantasyon](#-dokümantasyon) • [🔐 Güvenlik](#-güvenlik)

</div>

---

## 📖 Proje Hakkında

**InfraFix**, şehir altyapısındaki arızaları konum bazlı olarak bildirmenizi ve yönetmenizi sağlayan modern bir web uygulamasıdır. Vatandaşlar kolayca arıza bildirebilir, adminler ise bu bildirimleri merkezi bir panelden yönetebilir.

### 🎯 Proje Amacı

- 🗺️ **Konum Bazlı Bildirim**: Harita üzerinden kolayca arıza konumu seçimi
- 📱 **Responsive Tasarım**: Mobil ve masaüstünde mükemmel deneyim
- 🔒 **Güvenli Yönetim**: Admin paneli ile merkezi arıza yönetimi
- 🌍 **Çoklu Dil Desteği**: Türkçe ve İngilizce dil desteği
- 🌙 **Dark Mode**: Göz dostu karanlık tema desteği
- ⚡ **Hızlı ve Modern**: Next.js 14 App Router ile optimize edilmiş performans

---

## ✨ Özellikler

### 👥 Vatandaş Özellikleri

- ✅ **Harita Üzerinden Konum Seçimi**: Leaflet.js ile interaktif harita entegrasyonu
- ✅ **Arıza Bildirimi**: Detaylı form ile arıza bildirimi (tip, açıklama, fotoğraf)
- ✅ **Takip Numarası**: Her bildirim için benzersiz takip numarası
- ✅ **Durum Takibi**: Bildirim durumunu görüntüleme
- ✅ **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- ✅ **Çoklu Dil**: TR/EN dil desteği
- ✅ **Dark Mode**: Göz dostu karanlık tema

### 🔧 Admin Özellikleri

- ✅ **Merkezi Yönetim Paneli**: Tüm arızaları tek yerden yönetme
- ✅ **İstatistikler**: Bekleyen, incelenen, çözülen arıza istatistikleri
- ✅ **Filtreleme ve Arama**: Tip, durum, kritiklik bazlı filtreleme
- ✅ **Durum Güncelleme**: Arıza durumunu güncelleme (Beklemede → İnceleniyor → Çözüldü)
- ✅ **Arşiv Yönetimi**: Çözülen arızaları arşivleme ve geri alma
- ✅ **Kritiklik Seviyesi**: 1-5 arası kritiklik seviyesi belirleme
- ✅ **Harita Entegrasyonu**: Google Maps ile rota görüntüleme
- ✅ **Pagination**: Büyük veri setleri için sayfalama

### 🎨 UI/UX Özellikleri

- 🎨 **Modern Kart Tasarımı**: Arşiv panelinde modern kart tasarımı
- 🎨 **Smooth Animations**: Hover efektleri ve geçiş animasyonları
- 🎨 **Scroll Behavior**: Aşağı scroll'da navbar gizlenme, yukarı scroll'da görünme
- 🎨 **Toast Notifications**: Kullanıcı geri bildirimleri için toast mesajları
- 🎨 **Loading States**: Skeleton loader'lar ile yükleme durumları
- 🎨 **Responsive Grid**: Mobil ve masaüstü için optimize edilmiş grid sistemleri

---

## 🚀 Teknoloji Stack

### Frontend
- **Next.js 14** - App Router ile modern React framework
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **React Hook Form** - Form yönetimi
- **Zod** - Schema validation
- **Leaflet.js** - Harita entegrasyonu
- **Zustand** - State management

### Backend & Database
- **Supabase** - PostgreSQL database + Authentication
- **Supabase RLS** - Row Level Security ile güvenlik
- **Next.js Server Actions** - API routes olmadan backend işlemleri

### Styling & UI
- **CSS Modules** - Component bazlı styling
- **CSS Variables** - Theme yönetimi (Dark/Light mode)
- **Responsive Design** - Mobile-first yaklaşım

---

## 📦 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### 1️⃣ Projeyi Klonlayın

```bash
git clone <repository-url>
cd konumbazlıarızaihbarsistemi
```

### 2️⃣ Bağımlılıkları Yükleyin

```bash
npm install
```

### 3️⃣ Environment Variables Ayarlayın

`.env.local.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4️⃣ Supabase Veritabanını Hazırlayın

#### 4.1. Supabase Dashboard'a Giriş Yapın
- [Supabase Dashboard](https://app.supabase.com/) adresine gidin
- Projenizi seçin veya yeni proje oluşturun

#### 4.2. SQL Scriptlerini Çalıştırın

**RLS Politikalarını Düzelt:**
```sql
-- scripts/fix-all-rls-policies.sql dosyasını Supabase SQL Editor'de çalıştırın
```

**Admin Kullanıcı Oluştur:**
```sql
-- scripts/create-admin-user.sql dosyasını çalıştırın
-- Email ve password'ü kendi bilgilerinizle değiştirin
```

**Test Verileri Ekle (Opsiyonel):**
```sql
-- scripts/add-test-data.sql dosyasını çalıştırın
```

### 5️⃣ Development Server'ı Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacak! 🎉

---

## 🏗️ Mimari

### Proje Yapısı

```
konumbazlıarızaihbarsistemi/
│
├── 📁 app/                          # Next.js App Router
│   ├── 📁 actions/                  # Server Actions (Backend Logic)
│   │   ├── auth.ts                 # Authentication işlemleri
│   │   └── faults.ts               # Arıza CRUD işlemleri
│   │
│   ├── 📁 admin/                   # Admin Sayfası
│   │   ├── page.tsx                # Admin ana sayfa
│   │   ├── layout.tsx              # Admin layout
│   │   └── admin.css               # Admin stilleri
│   │
│   ├── 📁 archive/                 # Arşiv Sayfası (Admin içinde entegre)
│   │   ├── page.tsx                # Arşiv sayfası
│   │   └── archive.css             # Arşiv stilleri
│   │
│   ├── 📁 login/                   # Giriş Sayfası
│   │   ├── page.tsx                # Login sayfası
│   │   └── login.css               # Login stilleri
│   │
│   ├── 📁 documents/               # Dokümantasyon Sayfaları
│   │   ├── privacy/                # Gizlilik Politikası
│   │   └── terms/                  # Kullanım Şartları
│   │
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Ana sayfa
│   └── globals.css                 # Global stiller
│
├── 📁 components/                  # React Bileşenleri
│   ├── 📁 common/                  # Ortak Bileşenler
│   │   ├── Button.tsx              # Buton bileşeni
│   │   ├── Toast.tsx               # Bildirim bileşeni
│   │   └── Skeleton.tsx            # Yükleme skeleton'ı
│   │
│   ├── Header.tsx                  # Navigation header
│   ├── Footer.tsx                  # Footer
│   ├── HeroSection.tsx             # Ana sayfa hero bölümü
│   ├── HowItWorks.tsx              # Nasıl çalışır bölümü
│   ├── FAQ.tsx                     # Sık sorulan sorular
│   ├── FaultReportForm.tsx         # Arıza bildirim formu
│   ├── MapSelector.tsx             # Harita seçici bileşeni
│   ├── AdminPanel.tsx              # Admin yönetim paneli
│   ├── ArchivePanel.tsx            # Arşiv yönetim paneli
│   └── LoginForm.tsx               # Giriş formu
│
├── 📁 hooks/                       # Custom React Hooks
│   ├── useAuth.ts                  # Authentication hook
│   ├── useFaults.ts                # Arıza verileri hook
│   └── useLoading.ts               # Loading state hook
│
├── 📁 lib/                         # Kütüphaneler ve Yardımcılar
│   ├── 📁 supabase/                # Supabase Clients
│   │   ├── client.ts               # Client-side Supabase client
│   │   ├── server.ts               # Server-side Supabase client
│   │   └── database.types.ts       # Database type definitions
│   │
│   ├── auth.ts                     # Authentication helper fonksiyonları
│   ├── i18n.ts                     # Çoklu dil desteği (TR/EN)
│   ├── error.ts                    # Hata yönetimi
│   └── validation.ts               # Zod validation şemaları
│
├── 📁 state/                       # Global State Management (Zustand)
│   ├── userStore.ts                # Kullanıcı state'i
│   └── faultsStore.ts              # Arıza state'i
│
├── 📁 types/                       # TypeScript Type Definitions
│   ├── fault.ts                    # Arıza tipleri ve sabitler
│   ├── user.ts                     # Kullanıcı tipleri
│   └── api.ts                      # API response tipleri
│
├── 📁 utils/                       # Yardımcı Fonksiyonlar
│   ├── formatDate.ts               # Tarih formatlama
│   ├── sanitize.ts                 # Input temizleme
│   └── constants.ts                # Uygulama sabitleri
│
├── 📁 assets/                       # Statik Dosyalar (Import ile kullanılır)
│   ├── 📁 icons/                   # İkonlar (Elektrik, Su, Yol, vb.)
│   └── 📁 images/                  # Görseller
│
├── 📁 public/                      # Public Static Files (URL ile erişilir)
│   └── 📁 documents/               # PDF belgeler
│
├── 📁 scripts/                     # SQL Setup Scripts
│   ├── fix-all-rls-policies.sql    # RLS politikalarını düzeltme
│   ├── create-admin-user.sql       # Admin kullanıcı oluşturma
│   └── add-test-data.sql           # Test verileri ekleme
│
├── 📁 contexts/                    # React Contexts
│   └── LanguageContext.tsx          # Dil context'i
│
├── package.json                    # Proje bağımlılıkları
├── tsconfig.json                   # TypeScript yapılandırması
├── next.config.js                  # Next.js yapılandırması
└── README.md                       # Bu dosya
```

### Mimari Özellikler

#### 🎯 Server Actions Pattern
Next.js Server Actions kullanarak API routes'a gerek kalmadan backend işlemleri yapılıyor:

```typescript
// app/actions/faults.ts
'use server'

export async function reportFault(formData: FormData) {
  const supabase = await createClient()
  // Server-side işlemler
}
```

#### 🔒 Row Level Security (RLS)
Supabase RLS ile veritabanı seviyesinde güvenlik sağlanıyor. Her kullanıcı sadece kendi verilerine erişebilir, adminler tüm verilere erişebilir.

#### 🌍 Internationalization (i18n)
Context API ile çoklu dil desteği. Türkçe ve İngilizce dil desteği mevcut.

#### 🎨 Theme System
CSS Variables ile dark/light mode desteği. Kullanıcı tercihi localStorage'da saklanıyor.

---

## 🔐 Güvenlik

### Authentication
- ✅ Supabase Auth ile JWT tabanlı kimlik doğrulama
- ✅ Email/Password authentication
- ✅ Session yönetimi otomatik

### Authorization
- ✅ Role-based access control (Admin/User)
- ✅ Supabase RLS ile veritabanı seviyesinde yetkilendirme
- ✅ Server Actions ile server-side doğrulama

### Data Protection
- ✅ Input sanitization
- ✅ Zod validation ile tip güvenliği
- ✅ XSS koruması
- ✅ SQL injection koruması (Supabase parametreli sorgular)

---

## 📚 Kullanım Kılavuzu

### Vatandaş Kullanımı

1. **Ana Sayfa**: Uygulamaya giriş yapın
2. **Arıza Bildir**: "Hemen Arıza Bildir" butonuna tıklayın
3. **Konum Seç**: Harita üzerinden arıza konumunu işaretleyin
4. **Detayları Doldur**: Arıza tipi, açıklama ve fotoğraf ekleyin
5. **Gönder**: Formu gönderin ve takip numaranızı alın

### Admin Kullanımı

1. **Giriş Yap**: Admin hesabı ile giriş yapın
2. **Admin Panel**: Admin panel sekmesine geçin
3. **Arızaları Yönet**: 
   - Filtreleme ve arama ile arızaları bulun
   - Durum güncellemesi yapın
   - Kritiklik seviyesi belirleyin
   - Harita üzerinden konum görüntüleyin
4. **Arşiv Yönetimi**: 
   - Arşiv sekmesine geçin
   - Çözülen arızaları görüntüleyin
   - Geri alma veya kalıcı silme işlemleri yapın

---

## 🎨 Özelleştirme

### Renk Teması Değiştirme

`app/globals.css` dosyasındaki CSS variables'ları düzenleyin:

```css
:root {
  --primary-color: #2563eb;      /* Ana renk */
  --secondary-color: #64748b;     /* İkincil renk */
  --success-color: #10b981;       /* Başarı rengi */
  --danger-color: #ef4444;        /* Hata rengi */
}
```

### Dil Desteği Ekleme

`lib/i18n.ts` dosyasına yeni dil ekleyin:

```typescript
export const translations = {
  tr: { /* Türkçe çeviriler */ },
  en: { /* İngilizce çeviriler */ },
  // Yeni dil ekleyin
}
```

---

## 🚀 Production Deploy

### Vercel ile Deploy (Önerilen)

1. **GitHub'a Push Edin**
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Vercel'e Bağlayın**
   - [Vercel](https://vercel.com) hesabı oluşturun
   - GitHub repository'nizi bağlayın
   - Environment variables'ları ekleyin:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy!**
   - Vercel otomatik olarak deploy edecek
   - Production URL'iniz hazır! 🎉

### Build Komutları

```bash
# Production build
npm run build

# Production server başlat
npm start
```

---

## 🧪 Test

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

---

## 📝 Scripts

### SQL Scripts

- **`scripts/fix-all-rls-policies.sql`**: RLS politikalarını düzeltir
- **`scripts/create-admin-user.sql`**: Admin kullanıcı oluşturur
- **`scripts/add-test-data.sql`**: Test verileri ekler

### NPM Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint kontrolü
```

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

ISC License

---

## 👨‍💻 Geliştirici

Bu proje modern web teknolojileri kullanılarak geliştirilmiştir.

---

## 🎯 Gelecek Özellikler

- [ ] Push notification desteği
- [ ] Email bildirimleri
- [ ] Mobil uygulama (React Native)
- [ ] Dashboard grafikleri ve raporlar
- [ ] Çoklu şehir desteği
- [ ] API dokümantasyonu
- [ ] Unit testler
- [ ] E2E testler

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

Made with ❤️ using Next.js, React, TypeScript, and Supabase

</div>
