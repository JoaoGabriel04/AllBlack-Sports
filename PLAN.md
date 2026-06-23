# AllBlack Sports — Plano de Implementação

## Stack
- Next.js 16.2.9 (App Router) + TypeScript
- Tailwind CSS v4 (`shrink-0`, `w-64`, `text-(--var)`, `@theme inline`)
- React Three Fiber + `@react-three/drei` (troféu 3D)
- GSAP + ScrollTrigger (scrub) + Lenis (scroll suave)
- NextAuth v5 (Credentials + Google OAuth) — JWT strategy
- Prisma + PostgreSQL (Neon)
- bcryptjs + Zod + lucide-react
- Vitest (testes de lógica)

## Instalar
```bash
npm install three @react-three/fiber @react-three/drei gsap lenis next-auth@beta @auth/prisma-adapter @prisma/client bcryptjs zod lucide-react react-hook-form @hookform/resolvers
npm install -D prisma @types/three @types/bcryptjs tsx vitest @vitejs/plugin-react
```

## package.json scripts
```json
"dev": "next dev",
"build": "prisma generate && next build",
"postbuild": "prisma migrate deploy && npm run db:seed",
"start": "next start",
"lint": "eslint",
"db:migrate": "prisma migrate dev",
"db:seed": "tsx prisma/seed.ts",
"db:studio": "prisma studio",
"test": "vitest run",
"test:watch": "vitest"
```

## Estrutura de Arquivos
```
app/
  layout.tsx                  ← root: fonts, metadata, Providers
  globals.css                 ← @theme inline, @layer base
  page.tsx                    ← homepage (todas as seções)
  login/page.tsx
  registro/page.tsx
  catalogo/page.tsx
  carrinho/page.tsx           ← protegida
  perfil/page.tsx             ← protegida
  admin/
    layout.tsx                ← sidebar + header fixos (flexbox)
    page.tsx                  ← dashboard stats
    produtos/page.tsx
    clientes/page.tsx
    estoque/page.tsx
    pedidos/page.tsx
  api/
    auth/[...nextauth]/route.ts
    products/route.ts         ← GET (listagem/filtros), POST (admin)
    products/[id]/route.ts    ← GET, PUT, DELETE (admin)
    orders/route.ts           ← GET (perfil do usuário)
    orders/[id]/route.ts      ← PUT status (admin → dispara loyalty)
    vouchers/route.ts         ← GET (vouchers do usuário)
    admin/stats/route.ts

components/
  layout/
    Header.tsx                ← logo + catálogo + carrinho badge + user icon
    Footer.tsx                ← 3 colunas + WhatsApp btn
    Providers.tsx             ← SessionProvider + Lenis + GSAP init (client)
  home/
    HeroSection.tsx           ← picture (desktop/mobile), texto top-left
    TrophySection.tsx         ← wrapper + GSAP trigger (client)
    TrophyCanvas.tsx          ← R3F Canvas, dynamic ssr:false
    AboutSection.tsx
    FeaturedProducts.tsx      ← server component, fetch /api/products?featured=true
    ModelsSection.tsx         ← 4 cards com imagens de /public/images
    ContactSection.tsx        ← form + WhatsApp btn dourado
  catalog/
    CatalogSidebar.tsx        ← filtros (categoria, preço) — chips pill
    ProductGrid.tsx           ← grid-cols-4 lg / grid-cols-2 sm
  cart/
    CartContext.tsx            ← useReducer + localStorage (client)
  admin/
    AdminSidebar.tsx
    AdminHeader.tsx
  ui/
    Button.tsx
    Badge.tsx
    ProductCard.tsx

lib/
  auth.ts                     ← NextAuth config (Credentials + Google)
  db.ts                       ← Prisma singleton
  whatsapp.ts                 ← buildWhatsAppUrl, buildCartMessage
  loyalty.ts                  ← checkAndGrantVoucher(userId)

middleware.ts                 ← protege /perfil, /carrinho, /admin/**
types/next-auth.d.ts         ← augment Session com id + role
vitest.config.ts
prisma/
  schema.prisma
  seed.ts                     ← upsert admin@allblack.com
```

## .env.example
```
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ADMIN_PASSWORD="admin123"
```

## Prisma Schema
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(CUSTOMER)
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  vouchers      Voucher[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  images      String[]
  category    String
  stock       Int         @default(0)
  featured    Boolean     @default(false)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
model Order {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  items     OrderItem[]
  total     Float
  status    OrderStatus @default(PENDING)
  voucherId String?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}
model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  qty       Int
  price     Float
}
model Voucher {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  value     Float     @default(100)
  used      Boolean   @default(false)
  createdAt DateTime  @default(now())
  usedAt    DateTime?
}
enum Role        { CUSTOMER ADMIN }
enum OrderStatus { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED }
```

## globals.css
```css
@import "tailwindcss";

@theme inline {
  --font-display: var(--font-display);
  --font-body:    var(--font-body);

  --color-canvas:         #0a0a0a;
  --color-soft-cloud:     #141414;
  --color-surface-raised: #1a1a1a;
  --color-ink:            #ffffff;
  --color-on-primary:     #0a0a0a;
  --color-mute:           #6b6b6d;
  --color-stone:          #9e9ea0;
  --color-hairline:       #2a2a2b;
  --color-gold:           #d4af37;
  --color-sale:           #d30005;
  --color-success:        #1eaa52;
}

@layer base {
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: auto; background: #0a0a0a; }
  body {
    font-family: var(--font-body, 'Inter', sans-serif);
    background: #0a0a0a;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }
}
```

## lib/auth.ts (NextAuth v5)
```ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const user = await db.user.findUnique({ where: { email: credentials.email as string } })
        if (!user?.password) return null
        const ok = await bcrypt.compare(credentials.password as string, user.password)
        return ok ? user : null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role }
      return token
    },
    session({ session, token }) {
      session.user.id   = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
})
```

## middleware.ts
```ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role
  const loggedIn = !!req.auth

  if (pathname.startsWith('/admin') && role !== 'ADMIN')
    return NextResponse.redirect(new URL('/login', req.url))

  if ((pathname.startsWith('/perfil') || pathname.startsWith('/carrinho')) && !loggedIn)
    return NextResponse.redirect(new URL('/login', req.url))
})

export const config = {
  matcher: ['/admin/:path*', '/perfil/:path*', '/carrinho/:path*'],
}
```

## Admin Layout (flexbox exato solicitado)
```tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-canvas">
      <AdminSidebar />                          {/* w-64 shrink-0 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />                         {/* h-16 shrink-0 */}
        <main className="w-full h-full flex-1 overflow-hidden">
          <div className="w-full h-full overflow-y-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

## lib/loyalty.ts
```ts
import { db } from '@/lib/db'
export async function checkAndGrantVoucher(userId: string) {
  const count = await db.order.count({ where: { userId, status: 'DELIVERED' } })
  if (count === 0 || count % 10 !== 0) return
  const vouchers = await db.voucher.count({ where: { userId } })
  if (vouchers >= count / 10) return
  await db.voucher.create({ data: { userId, value: 100 } })
}
```

## lib/whatsapp.ts
```ts
const PHONE = '5599984078478'
export const buildWhatsAppUrl = (msg: string) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`

export const buildCatalogMessage = () =>
  'Olá! Vi o catálogo da AllBlack Sports e gostaria de realizar uma compra.'

export function buildCartMessage(
  items: { name: string; qty: number; price: number }[],
  total: number,
  voucherCode?: string,
  voucherValue?: number
) {
  const lines = items.map(i => `• ${i.qty}x ${i.name} — R$ ${i.price.toFixed(2)} cada`)
  const discount = voucherValue
    ? `\nVoucher (${voucherCode}): -R$ ${voucherValue.toFixed(2)}\nTotal com desconto: R$ ${(total - voucherValue).toFixed(2)}`
    : `\nTotal: R$ ${total.toFixed(2)}`
  return ['Olá! Gostaria de realizar um pedido na AllBlack Sports.', '', 'Itens:', ...lines, discount, '', 'Aguardo confirmação! 🛒'].join('\n')
}
```

## prisma/seed.ts
```ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@allblack.com'
  const hash  = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'admin123', 12)
  await prisma.user.upsert({
    where:  { email },
    update: {},
    create: { name: 'Admin AllBlack', email, password: hash, role: 'ADMIN' },
  })
  console.log('Seed OK — admin criado/verificado')
}
main().catch(console.error).finally(() => prisma.$disconnect())
```

## vitest.config.ts
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'
export default defineConfig({
  test: { environment: 'node', globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

---

## Checklist de Tarefas

- [x] **T01** — Instalar deps + atualizar `package.json` scripts + criar `.env.example` + `next.config.ts` + `vitest.config.ts`
- [x] **T02** — Criar `prisma/schema.prisma` → `npx prisma migrate dev --name init`
- [x] **T03** — Criar `prisma/seed.ts` → `npm run db:seed` → verificar admin no banco
- [x] **T04** — Criar `lib/db.ts` + `lib/auth.ts` + `types/next-auth.d.ts` + `app/api/auth/[...nextauth]/route.ts`
- [x] **T05** — Criar `middleware.ts`
- [x] **T06** — Criar `lib/whatsapp.ts` + teste `lib/whatsapp.test.ts` → `npm test`
- [x] **T07** — Criar `lib/loyalty.ts` + teste `lib/loyalty.test.ts` → `npm test`
- [x] **T08** — Atualizar `app/globals.css` (`@theme inline`, `@layer base`) + `app/layout.tsx` (Bebas Neue + Inter via `next/font`, metadata)
- [x] **T09** — Criar `components/layout/Providers.tsx` (Lenis + GSAP + SessionProvider) + `components/cart/CartContext.tsx`; atualizar `layout.tsx`
- [x] **T10** — Criar `components/ui/Button.tsx` + `components/ui/ProductCard.tsx` + `components/ui/Badge.tsx`
- [x] **T11** — Criar `components/layout/Header.tsx`
- [x] **T12** — Criar `components/layout/Footer.tsx`
- [x] **T13** — Criar `app/login/page.tsx` + `app/registro/page.tsx` + `app/api/auth/register/route.ts`
- [x] **T14** — Criar `components/home/HeroSection.tsx`
- [x] **T15** — Criar `components/home/TrophyCanvas.tsx` (R3F, `dynamic ssr:false`) + `components/home/TrophySection.tsx` (GSAP scrub)
- [x] **T16** — Criar `components/home/AboutSection.tsx` + `components/home/ModelsSection.tsx` + `components/home/ContactSection.tsx`
- [x] **T17** — Criar `app/api/products/route.ts` (GET com ?featured + ?category) + `components/home/FeaturedProducts.tsx` (server component)
- [x] **T18** — Atualizar `app/page.tsx` (montar homepage com todas as seções)
- [x] **T19** — Criar `components/catalog/CatalogSidebar.tsx` + `components/catalog/ProductGrid.tsx` + `app/catalogo/page.tsx`
- [x] **T20** — Criar `app/carrinho/page.tsx`
- [x] **T21** — Criar `app/api/orders/route.ts` + `app/api/vouchers/route.ts` + `app/perfil/page.tsx`
- [x] **T22** — Criar `components/admin/AdminSidebar.tsx` + `components/admin/AdminHeader.tsx` + `app/admin/layout.tsx`
- [x] **T23** — Criar `app/api/admin/stats/route.ts` + `app/admin/page.tsx` (dashboard)
- [x] **T24** — Criar `app/api/products/[id]/route.ts` + `app/admin/produtos/page.tsx` (CRUD completo)
- [x] **T25** — Criar `app/api/admin/clients/route.ts` + `app/admin/clientes/page.tsx` + `app/admin/estoque/page.tsx`
- [x] **T26** — Criar `app/api/orders/[id]/route.ts` (PUT status + loyalty trigger) + `app/admin/pedidos/page.tsx`
