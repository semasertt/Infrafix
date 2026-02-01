# 📁 Modüler Proje Yapısı

## 🏗️ Klasör Organizasyonu

```
infrafix/
├── app/                        # Next.js App Router
│   ├── actions/                # Server Actions (backend logic)
│   │   ├── auth.ts             # login, logout, getCurrentUser
│   │   └── faults.ts           # reportFault, getFaults, updateFault, etc.
│   ├── admin/                  # Admin page
│   │   ├── page.tsx
│   │   └── admin.css
│   ├── archive/                # Archive page
│   │   ├── page.tsx
│   │   └── archive.css
│   ├── login/                  # Login page
│   │   ├── page.tsx
│   │   └── login.css
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── page.css
│   └── globals.css             # Global styles
│
├── components/                 # React Components
│   ├── common/                 # Shared components
│   │   ├── Button.tsx          # Reusable button
│   │   ├── Toast.tsx           # Toast notifications
│   │   ├── Skeleton.tsx        # Loading skeletons
│   │   └── *.css
│   ├── Header.tsx              # Site header
│   ├── Footer.tsx              # Site footer
│   ├── LoginForm.tsx           # Login form
│   ├── FaultReportForm.tsx    # Fault report form
│   ├── MapSelector.tsx         # Map component
│   ├── AdminPanel.tsx          # Admin panel
│   ├── ArchivePanel.tsx        # Archive panel
│   └── LogoutButton.tsx
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts              # Auth state management
│   ├── useFaults.ts            # Faults data fetching
│   └── useLoading.ts           # Loading state
│
├── state/                      # Global State (Zustand)
│   ├── userStore.ts            # User state
│   └── faultsStore.ts          # Faults state
│
├── types/                      # TypeScript Types
│   ├── fault.ts                # Fault types & constants
│   ├── user.ts                 # User types
│   └── api.ts                  # API response types
│
├── lib/                        # Library & Utilities
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── database.types.ts   # DB types
│   ├── auth.ts                 # Auth helpers (requireAdmin, etc.)
│   ├── error.ts                # Error handling
│   └── validation.ts           # Zod schemas
│
├── utils/                      # Helper Functions
│   ├── formatDate.ts           # Date formatting
│   ├── sanitize.ts             # Input sanitization
│   └── constants.ts            # App constants
│
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## 🔄 Data Flow

### 1. User Action Flow
```
User clicks button
  ↓
Component (Client)
  ↓
Hook (useFaults, useAuth)
  ↓
Server Action (app/actions/)
  ↓
Auth Helper (lib/auth.ts) - requireAdmin()
  ↓
Validation (lib/validation.ts) - Zod
  ↓
Supabase Client (lib/supabase/server.ts)
  ↓
Database (Supabase PostgreSQL)
  ↓
Response → Update Zustand Store
  ↓
Component re-renders
```

### 2. State Management Flow
```
Global State (Zustand)
  ├── userStore → User, role, auth state
  └── faultsStore → Faults list, filters, loading

Component State (React)
  ├── Form inputs → React Hook Form
  └── Local UI state → useState

Server State (Server Actions)
  └── Database queries → Supabase
```

## 📦 Key Concepts

### Server Actions
- **Location:** `app/actions/`
- **Purpose:** Backend logic, database operations
- **Pattern:** `'use server'` directive
- **Error Handling:** Centralized via `lib/error.ts`

### Custom Hooks
- **Location:** `hooks/`
- **Purpose:** Reusable logic, data fetching
- **Examples:** `useAuth()`, `useFaults()`

### Zustand Stores
- **Location:** `state/`
- **Purpose:** Global state management
- **Stores:** `userStore`, `faultsStore`

### Types
- **Location:** `types/`
- **Purpose:** TypeScript type definitions
- **Files:** `fault.ts`, `user.ts`, `api.ts`

### Utils
- **Location:** `utils/`
- **Purpose:** Pure helper functions
- **Examples:** Date formatting, sanitization

### Lib
- **Location:** `lib/`
- **Purpose:** Core utilities (auth, validation, error handling)
- **Pattern:** Reusable across server and client

## 🎯 Best Practices

1. **Separation of Concerns**
   - Server logic → Server Actions
   - Client logic → Hooks & Components
   - Shared logic → Utils & Lib

2. **Type Safety**
   - Types in `types/` folder
   - Zod schemas for validation
   - TypeScript everywhere

3. **Error Handling**
   - Centralized in `lib/error.ts`
   - Consistent error responses
   - User-friendly error messages

4. **State Management**
   - Global state → Zustand
   - Form state → React Hook Form
   - Server state → Server Actions

5. **Code Organization**
   - One responsibility per file
   - Reusable components in `components/common/`
   - Page-specific components in page folders

## 🚀 Benefits

✅ **Modular:** Easy to find and modify code
✅ **Scalable:** Easy to add new features
✅ **Maintainable:** Clear structure and patterns
✅ **Type-safe:** TypeScript + Zod validation
✅ **Testable:** Isolated functions and components
✅ **Reusable:** Shared components and utilities
