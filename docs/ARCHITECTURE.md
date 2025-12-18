# 🏗️ Arquitectura del Rascacielos Digital

## Stack Tecnológico

- **Frontend**: Next.js 15+ (App Router) + TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **ORM**: Drizzle (Type-safe queries)
- **Payments**: Stripe + Solana Pay
- **Security**: Post-quantum ML-KEM-1024 (Kyber-1024) + Zero-Trust
- **Testing**: Playwright + Jest + React Testing Library
- **CI/CD**: 5-gate pipeline (100% automated)

## Principios Arquitectónicos

### 1. Server-First
- Server Components por defecto
- Client Components solo cuando sea necesario (`"use client"`)
- Server Actions para mutaciones (`"use server"`)
- Dynamic rendering para páginas con autenticación

### 2. Type Safety
- TypeScript strict mode habilitado
- Zod para validaciones en runtime
- Drizzle para queries type-safe
- Definiciones de tipos compartidas

### 3. Performance
- Dynamic imports para code-splitting
- Suspense boundaries estratégicos
- Optimistic updates con useOptimistic
- Revalidación inteligente (revalidatePath, revalidateTag)
- Build optimization con Next.js

### 4. Security
- Post-quantum encryption (ML-KEM-1024)
- Key rotation cada 11 minutos
- Zero-trust architecture
- RLS policies en Supabase
- CSRF protection integrado
- Secure cookie handling

### 5. Testing
- Tests E2E con Playwright
- Tests unitarios con Jest
- Tests de integración
- Continuous testing en CI/CD

## Flujo de Datos

```
User Request
    ↓
Middleware (Auth Check)
    ↓
Server Component
    ↓
Supabase Query (Drizzle)
    ↓
Data Fetching
    ↓
Render (RSC)
    ↓
Client Hydration
    ↓
Interactive (Client Component)
```

## Módulos Principales

### Auth
- Supabase Auth SSR con cookies
- Magic link + OAuth (Google, GitHub)
- Session management
- Protected routes via middleware

### Billing
- Stripe Checkout integration
- Webhook handlers para eventos
- Subscription management
- Invoice generation y tracking

### Dashboard
- Real-time stats con Server Components
- Revenue charts (preparado para Recharts)
- Activity feed
- User management

### Security
- ML-KEM-1024 (Kyber-1024) post-quantum encryption
- Automatic key rotation cada 11 minutos
- Secure data handling
- Zero-trust architecture

## Estructura de Carpetas

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes (login, signup)
│   ├── (dashboard)/         # Dashboard routes
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   └── layout/              # Layout components
├── lib/                     # Utilities
│   ├── supabase/           # Supabase clients
│   ├── db/                 # Drizzle ORM
│   ├── stripe/             # Stripe integration
│   ├── security/           # Security utilities
│   └── utils.ts            # General utilities
├── types/                   # TypeScript types
└── middleware.ts            # Next.js middleware
```

## Deployment Pipeline

```
Push to GitHub
    ↓
Gate 1: Preflight (lint, types, format)
    ↓
Gate 2: Dry Run (build)
    ↓
Gate 3: Quality (tests)
    ↓
Gate 4: Security (audit, vulnerabilities)
    ↓
Gate 5: Release (Vercel deploy)
    ↓
Production Live ✅
```

## Métricas de Éxito

- Build time: < 2 min ✅
- TypeScript: strict mode ✅
- Linting: 0 errors ✅
- Security: Post-quantum ready ✅
- CI/CD: 5 gates automated ✅

## Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# App
NEXT_PUBLIC_APP_URL=
```

## Comandos Principales

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Test
npm run test:e2e
npm run test:unit
npm run test:coverage

# Database
npm run db:generate
npm run db:migrate
npm run db:studio
```
