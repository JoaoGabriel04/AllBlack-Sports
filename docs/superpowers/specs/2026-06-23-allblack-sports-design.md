# AllBlack Sports — Design Spec
**Data:** 2026-06-23  
**Status:** Aprovado pelo usuário

---

## Visão Geral

Site de loja de camisas esportivas temático de Copa do Mundo. Dark mode exclusivo, baseado no Nike Design System adaptado para fundo escuro, com acento dourado (copa/troféu). Animações via GSAP + ScrollTrigger (scrub) e scroll suave via Lenis. Troféu 3D (`trofeu.glb`) renderizado com React Three Fiber acompanhando o scroll do usuário.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| 3D | React Three Fiber + `@react-three/drei` |
| Animações | GSAP + ScrollTrigger (scrub: 1.5) |
| Scroll suave | Lenis |
| Auth | NextAuth v5 (Auth.js) — JWT + Google OAuth |
| ORM | Prisma + PostgreSQL (Neon) |
| Validação | Zod |
| Hash de senha | bcryptjs |

### Tailwind v4 — Convenções Obrigatórias
- Usar `shrink-0` em vez de `flex-shrink-0`
- Usar valores de spacing nativos: `w-56` em vez de `w-[224px]`, `w-64` em vez de `w-[256px]`
- CSS custom properties: `text-(--cor-primary)` em vez de interpolação manual
- Sem uso de `@apply` desnecessário; preferir classes diretas

---

## Design System (Nike DS Dark Mode Adaptation)

### Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `canvas` | `#0a0a0a` | Fundo principal |
| `soft-cloud` | `#141414` | Superfície de cards, inputs |
| `surface-raised` | `#1a1a1a` | Cards elevados, sidebar |
| `ink` | `#ffffff` | Texto principal, botão primário |
| `on-primary` | `#0a0a0a` | Texto sobre botão primário branco |
| `mute` | `#6b6b6d` | Texto secundário |
| `stone` | `#9e9ea0` | Texto terciário |
| `hairline` | `#2a2a2b` | Divisores, bordas |
| `accent-gold` | `#D4AF37` | Acento copa, bordas de destaque |
| `accent-gold-glow` | `rgba(212,175,55,0.25)` | Shadows temáticos |
| `sale` | `#d30005` | Preços com desconto |
| `success` | `#1eaa52` | Confirmações, estoque OK |

### Tipografia

| Papel | Fonte | Tamanho | Peso |
|---|---|---|---|
| Display/Hero | Bebas Neue | 96px (desktop), 64px (tablet), 48px (mobile) | 400 |
| Heading XL | Inter | 32px | 700 |
| Heading LG | Inter | 24px | 600 |
| Body | Inter | 16px | 400 |
| Body Strong | Inter | 16px | 500 |
| Caption | Inter | 14px | 500 |
| Caption SM | Inter | 12px | 500 |
| Legal | Inter | 9px | 500 |

### Shapes
- Botões: `rounded-full` (pill)
- Cards: sem radius (0px)
- Inputs: `rounded-full`
- Avatar/badge: `rounded-full`

### Shadows Temáticos
- Card hover: `box-shadow: 0 0 24px rgba(212,175,55,0.15)`
- Botão WhatsApp: `box-shadow: 0 0 20px rgba(212,175,55,0.3)`
- Trophy glow: `pointLight` âmbar + ambient dourado no R3F

---

## Banco de Dados (Prisma + PostgreSQL/Neon)

### Schema

```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String?   // null quando login via Google
  image     String?   // avatar do Google
  role      Role      @default(CUSTOMER)
  orders    Order[]
  vouchers  Voucher[]
  accounts  Account[] // NextAuth
  sessions  Session[] // NextAuth
  createdAt DateTime  @default(now())
}

model Account { /* NextAuth padrão */ }
model Session { /* NextAuth padrão */ }

model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  images      String[]
  category    String      // "camisa-torcedor" | "camisa-jogador" | "conjunto" | "kit-treino"
  stock       Int         @default(0)
  featured    Boolean     @default(false)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id        String      @id @default(cuid())
  user      User        @relation(fields: [userId], references: [id])
  userId    String
  items     OrderItem[]
  total     Float
  status    OrderStatus @default(PENDING)
  voucherId String?     // voucher aplicado, se houver
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  qty       Int
  price     Float
}

model Voucher {
  id        String    @id @default(cuid())
  user      User      @relation(fields: [userId], references: [id])
  userId    String
  value     Float     @default(100)
  used      Boolean   @default(false)
  createdAt DateTime  @default(now())
  usedAt    DateTime?
}

enum Role         { CUSTOMER ADMIN }
enum OrderStatus  { PENDING CONFIRMED SHIPPED DELIVERED CANCELLED }
```

### Seed (`prisma/seed.ts`)
- Cria usuário admin: `admin@allblack.com` / senha lida de `process.env.ADMIN_PASSWORD` (default: `admin123`)
- Upsert (idempotente — roda múltiplas vezes sem duplicar)
- Script: `npm run db:seed`
- Em produção: também executa via `postbuild` no `package.json`

---

## Autenticação (NextAuth v5)

### Providers
1. **Credentials** — email + senha (bcrypt hash)
2. **Google OAuth** — chaves via `.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

### Configuração
- Strategy: JWT
- Callbacks: `session` injeta `user.id` e `user.role` no token
- Middleware Next.js protege `/perfil` e `/carrinho` e `/admin/**`
- Rota `/admin/**` exige `role === ADMIN`

### `.env` (variáveis necessárias)
```env
DATABASE_URL=""              # Neon PostgreSQL connection string
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""          # preencher depois
GOOGLE_CLIENT_SECRET=""      # preencher depois
ADMIN_PASSWORD="admin123"    # mudar em produção
```

---

## Páginas e Rotas

### `/` — Homepage

**Header (fixo/sticky)**
- Fundo `#0a0a0a`, `border-bottom: 1px solid #2a2a2b`
- Esquerda: `logo-allblack.png`
- Direita: link "Catálogo" + ícone carrinho (pill, com badge de quantidade) + ícone usuário

**Hero Section**
- Altura: `100vh`
- Background: `background-hero-desktop.png` (desktop) / `background-hero-mobile.png` (mobile) via `<picture>`
- Camisa ao centro da imagem — texto posicionado no **canto superior esquerdo**
- Overlay gradient: `linear-gradient(135deg, rgba(0,0,0,0.75) 0%, transparent 45%)` — preserva a camisa visível
- Copy: headline Bebas Neue 96px ("VISTA A COPA"), subtítulo Inter, botão pill branco "Ver Catálogo"

**Seção Troféu (ScrollTrigger)**
- Altura: `100vh`
- `trofeu.glb` renderizado via React Three Fiber
- GSAP ScrollTrigger `scrub: 1.5`: rotação Y 360° + leve translação Y conforme scroll
- Iluminação: `pointLight` âmbar dourado + `ambientLight` baixo
- Texto lateral "RUMO AO TOPO" com fade GSAP
- Integração Lenis ↔ ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`

**Sobre — AllBlack Sports**
- Duas colunas: texto (esquerda) + elemento decorativo (direita)
- `border-left: 3px solid #D4AF37` no headline
- Headline Bebas Neue 64px "QUEM SOMOS"
- Texto: história do Joabe Araújo (2021 → 2025, início sem estoque, loja física)

**Produtos em Destaque**
- Condicional: só renderiza se houver produtos com `featured: true`
- Grid: `grid-cols-4` (lg) / `grid-cols-2` (sm)
- Cards estilo Nike: imagem full-bleed fundo `#141414`, nome, preço, botão pill
- Hover: glow dourado `box-shadow: 0 0 20px rgba(212,175,55,0.2)`

**Seção Modelos**
- Título "NOSSAS LINHAS" Bebas Neue
- 4 cards: Camisa de Torcedor, Camisa de Jogador, Conjunto Camisa + Bermuda, Kit Treino
- Imagens: `camisa-torcedor.webp`, `camisa-jogador.webp`, `conjunto-camisa-bermuda.webp`, `kit-treino.webp`
- Nota rodapé: `"*Imagens meramente ilustrativas. Disponibilidade sujeita a estoque."` Inter 12px, cor `#6b6b6d`

**Seção Contato**
- Formulário: Nome, E-mail, Mensagem + botão "Enviar"
- Botão WhatsApp pill dourado → `https://wa.me/5599984078478?text=Olá!%20Vi%20o%20catálogo%20da%20AllBlack%20Sports%20e%20gostaria%20de%20realizar%20uma%20compra.`

**Footer**
- 3 colunas: Atalhos | Localização & Horário | Contato
- Localização: "Avenida Brasil, Bairro Canoeiro, Grajaú-MA"
- Horário: "Seg a Sex: 08h–19h · Sab: 08h–17h"
- Tel: +55 99 98407-8478 com link WhatsApp
- Copyright: "© 2025 AllBlack Sports — Todos os direitos reservados"

---

### `/catalogo` — Catálogo

- Header e Footer padrão
- Layout: `flex` — sidebar `w-64 shrink-0` + conteúdo `flex-1`
- **Sidebar:** filtros por categoria (chips pill Nike), faixa de preço, tamanho
- **Grid:** `grid-cols-4` (lg) / `grid-cols-2` (sm)
- Paginação ou infinite scroll

---

### `/perfil` — Perfil do Usuário (protegida)

- Dados: nome, e-mail, data de cadastro, avatar (Google ou inicial)
- Contador de compras
- Card de fidelidade: barra de progresso X/10 compras + vouchers disponíveis (valor + status)
- Histórico de pedidos em tabela: data, status, valor, itens

---

### `/carrinho` — Carrinho (protegida)

- Lista de itens, quantidade editável, subtotal
- Campo para código de voucher
- Botão "Finalizar via WhatsApp": abre `wa.me` com resumo do pedido formatado

---

### `/admin/**` — Área Administrativa (role: ADMIN)

**Layout Flexbox:**
```tsx
<div className="flex h-screen bg-(--canvas)">
  <AdminSidebar />                       {/* w-64 shrink-0 */}
  <div className="flex flex-col flex-1 overflow-hidden">
    <AdminHeader />                      {/* h-16 shrink-0 */}
    <main className="w-full h-full flex-1 overflow-hidden">
      <div className="w-full h-full overflow-y-auto p-6">
        {children}
      </div>
    </main>
  </div>
</div>
```

**AdminHeader:** Logo + "Área Administrativa" + "Voltar ao Site" + "Logout"

**AdminSidebar — abas:**
1. Dashboard
2. Cadastro de Produtos (CRUD)
3. Controle de Clientes
4. Controle de Estoque
5. Controle de Pedidos

**Dashboard Stats Cards:**
- Total de vendas (R$ acumulado)
- Pedidos do mês
- Clientes cadastrados
- Produtos com estoque baixo (< 5 unidades)
- Tabela: últimos 5 pedidos

---

## Lógica de Fidelidade

- A cada pedido com status atualizado para `DELIVERED`, endpoint verifica:
  - Conta pedidos `DELIVERED` do usuário
  - Se `count % 10 === 0`: cria `Voucher` de R$100
- Voucher pode ser aplicado no carrinho antes de finalizar
- Exibido na página de perfil com status (disponível / utilizado)

---

## Variáveis de Ambiente

```env
DATABASE_URL=""
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
ADMIN_PASSWORD="admin123"
```

---

## Assets Disponíveis

| Arquivo | Uso |
|---|---|
| `public/images/logo-allblack.png` | Header, Admin Header |
| `public/images/background-hero-desktop.png` | Hero (desktop) |
| `public/images/background-hero-mobile.png` | Hero (mobile) |
| `public/images/camisa-torcedor.webp` | Seção Modelos |
| `public/images/camisa-jogador.webp` | Seção Modelos |
| `public/images/conjunto-camisa-bermuda.webp` | Seção Modelos |
| `public/images/kit-treino.webp` | Seção Modelos |
| `public/models/trofeu.glb` | Seção Troféu (R3F) |
