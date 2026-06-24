# Scroll Reveal Animations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GSAP ScrollTrigger fade-up + stagger animations to all sections below the hero.

**Architecture:** Two reusable Client Components (`ScrollReveal` and `ScrollRevealStagger`) are created in `components/ui/`. Each section (Server Component) imports and wraps its text headers and card grids with these components. GSAP ScrollTrigger is already registered globally in `Providers.tsx`; calling `gsap.registerPlugin` again in the new file is safe (idempotent).

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3.15 + ScrollTrigger, TypeScript

## Global Constraints

- GSAP ease for all animations: `power2.out`
- Fade-up distance: `y: 30` (from) → `y: 0` (to)
- Opacity: `0` (from) → `1` (to)
- `ScrollReveal` duration: `0.7s`
- `ScrollRevealStagger` duration per child: `0.6s`, stagger: `0.1s`
- ScrollTrigger start: `"top 90%"` (10% visible)
- `toggleActions`: `"play none none none"` (fires once, never reverses)
- HeroSection is NOT animated — it is above the fold
- `#trophy-end-anchor` in AboutSection is NOT wrapped — it is a GSAP positional anchor, not visual content
- Server Components stay as Server Components — no `'use client'` added to section files

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/ui/ScrollReveal.tsx` | `ScrollReveal` and `ScrollRevealStagger` client components |
| Modify | `components/home/AboutSection.tsx` | Add wrappers to text block and mobile cards grid |
| Modify | `components/home/FeaturedProducts.tsx` | Add wrappers to header and products grid |
| Modify | `components/home/ModelsSection.tsx` | Add wrappers to header and models grid |
| Modify | `components/home/ContactSection.tsx` | Add wrappers to header and contact cards grid |

---

### Task 1: Create ScrollReveal and ScrollRevealStagger components

**Files:**
- Create: `components/ui/ScrollReveal.tsx`

**Interfaces:**
- Produces:
  - `ScrollReveal({ children, className? })` — wraps any block, fades it up as a unit
  - `ScrollRevealStagger({ children, className? })` — IS the grid/list container, stagger-animates its direct DOM children

> Note: No unit tests for this task. GSAP ScrollTrigger requires real browser viewport dimensions that jsdom cannot provide. Verification is a TypeScript check + manual visual test in the dev server.

- [ ] **Step 1: Create the file**

Create `components/ui/ScrollReveal.tsx` with the following content:

```tsx
'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function ScrollRevealStagger({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;

    const anim = gsap.fromTo(
      Array.from(el.children),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ScrollReveal.tsx
git commit -m "feat: add ScrollReveal and ScrollRevealStagger components"
```

---

### Task 2: Apply scroll reveal to AboutSection

**Files:**
- Modify: `components/home/AboutSection.tsx`

**Interfaces:**
- Consumes: `ScrollReveal`, `ScrollRevealStagger` from `@/components/ui/ScrollReveal`

- [ ] **Step 1: Add imports**

Open `components/home/AboutSection.tsx`. Add this import at the top:

```tsx
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";
```

- [ ] **Step 2: Wrap the text block**

Find the `{/* Texto */}` div (the first column, `className="flex flex-col gap-6"`). Replace it with a `ScrollReveal` wrapper:

Before:
```tsx
        {/* Texto */}
        <div className="flex flex-col gap-6">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Nossa história
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Joabe Araújo
            <br />
            <span className="text-gold">AllBlack Sports</span>
          </h2>

          <div className="flex flex-col gap-4 text-stone text-sm leading-relaxed max-w-md">
            <p>
              A AllBlack Sports nasceu da paixão de Joabe Araújo pelo futebol e
              pela moda esportiva. Em Grajaú-MA, onde o amor pelo jogo pulsa nas
              ruas, Joabe viu a oportunidade de levar camisas tailandesas de
              qualidade premium para os torcedores da região.
            </p>
            <p>
              Cada peça é cuidadosamente selecionada para garantir o melhor
              acabamento — tecido respirável, cores vibrantes e fidelidade ao
              design original dos times. Do Brasil ao PSG, da Argentina ao Real
              Madrid, você encontra tudo aqui.
            </p>
            <p>
              Venha nos visitar na Avenida Brasil, Bairro Canoeiro, e escolha a
              camisa do seu clube com a confiança de quem entende de qualidade.
            </p>
          </div>
        </div>
```

After:
```tsx
        {/* Texto */}
        <ScrollReveal className="flex flex-col gap-6">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Nossa história
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Joabe Araújo
            <br />
            <span className="text-gold">AllBlack Sports</span>
          </h2>

          <div className="flex flex-col gap-4 text-stone text-sm leading-relaxed max-w-md">
            <p>
              A AllBlack Sports nasceu da paixão de Joabe Araújo pelo futebol e
              pela moda esportiva. Em Grajaú-MA, onde o amor pelo jogo pulsa nas
              ruas, Joabe viu a oportunidade de levar camisas tailandesas de
              qualidade premium para os torcedores da região.
            </p>
            <p>
              Cada peça é cuidadosamente selecionada para garantir o melhor
              acabamento — tecido respirável, cores vibrantes e fidelidade ao
              design original dos times. Do Brasil ao PSG, da Argentina ao Real
              Madrid, você encontra tudo aqui.
            </p>
            <p>
              Venha nos visitar na Avenida Brasil, Bairro Canoeiro, e escolha a
              camisa do seu clube com a confiança de quem entende de qualidade.
            </p>
          </div>
        </ScrollReveal>
```

- [ ] **Step 3: Replace the mobile cards div with ScrollRevealStagger**

Find `{/* Mobile: cards de diferenciais */}` and its `<div className="grid grid-cols-2 gap-4 lg:hidden">`. Replace only the outer div tag (opening and closing), keeping all children intact:

Before:
```tsx
        {/* Mobile: cards de diferenciais (troféu não anima em telas pequenas) */}
        <div className="grid grid-cols-2 gap-4 lg:hidden">
```

After:
```tsx
        {/* Mobile: cards de diferenciais (troféu não anima em telas pequenas) */}
        <ScrollRevealStagger className="grid grid-cols-2 gap-4 lg:hidden">
```

And the closing tag:

Before: `        </div>`
After: `        </ScrollRevealStagger>`

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Manual visual test**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll down past the HeroSection to the AboutSection. Verify:
1. On desktop: the text block (label + h2 + paragraphs) fades up from y=30 as it enters the viewport
2. On mobile: the 4 stat cards fade up in cascade (0.1s stagger between each)
3. Animation fires once — scrolling back up and then down again does NOT re-trigger

- [ ] **Step 6: Commit**

```bash
git add components/home/AboutSection.tsx
git commit -m "feat: add scroll reveal to AboutSection"
```

---

### Task 3: Apply scroll reveal to FeaturedProducts

**Files:**
- Modify: `components/home/FeaturedProducts.tsx`

**Interfaces:**
- Consumes: `ScrollReveal`, `ScrollRevealStagger` from `@/components/ui/ScrollReveal`

- [ ] **Step 1: Add imports**

Open `components/home/FeaturedProducts.tsx`. Add this import at the top (after existing imports):

```tsx
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";
```

- [ ] **Step 2: Wrap the section header**

Find the header div (`className="flex items-end justify-between mb-10"`). Wrap it with `ScrollReveal`:

Before:
```tsx
        <div className="flex items-end justify-between mb-10">
          <div className="flex flex-col gap-2">
            <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
              Seleção especial
            </span>
            <h2
              className="text-ink uppercase leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
              }}
            >
              Destaques
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="text-mute text-sm hover:text-ink transition-colors hidden sm:block"
          >
            Ver todos →
          </Link>
        </div>
```

After:
```tsx
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div className="flex flex-col gap-2">
              <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
                Seleção especial
              </span>
              <h2
                className="text-ink uppercase leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                }}
              >
                Destaques
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="text-mute text-sm hover:text-ink transition-colors hidden sm:block"
            >
              Ver todos →
            </Link>
          </div>
        </ScrollReveal>
```

- [ ] **Step 3: Replace the products grid div with ScrollRevealStagger**

Find `<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">` and its closing `</div>` (the one wrapping `products.map`). Replace the opening and closing tags:

Before:
```tsx
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
```

After:
```tsx
        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </ScrollRevealStagger>
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Manual visual test**

Open `http://localhost:3000`. Scroll to the "Destaques" section. Verify:
1. The section header (label + h2 + "Ver todos →") fades up as a unit
2. Product cards appear in cascade — leftmost card first, 0.1s between each

- [ ] **Step 6: Commit**

```bash
git add components/home/FeaturedProducts.tsx
git commit -m "feat: add scroll reveal to FeaturedProducts"
```

---

### Task 4: Apply scroll reveal to ModelsSection

**Files:**
- Modify: `components/home/ModelsSection.tsx`

**Interfaces:**
- Consumes: `ScrollReveal`, `ScrollRevealStagger` from `@/components/ui/ScrollReveal`

- [ ] **Step 1: Add imports**

Open `components/home/ModelsSection.tsx`. Add this import at the top:

```tsx
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";
```

- [ ] **Step 2: Wrap the section header**

Find the centered header div (`className="flex flex-col items-center gap-3 mb-14 text-center"`). Wrap it with `ScrollReveal`:

Before:
```tsx
        <div className="flex flex-col items-center gap-3 mb-14 text-center">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Linha completa
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Nossos Modelos
          </h2>
        </div>
```

After:
```tsx
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 mb-14 text-center">
            <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
              Linha completa
            </span>
            <h2
              className="text-ink uppercase leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              Nossos Modelos
            </h2>
          </div>
        </ScrollReveal>
```

- [ ] **Step 3: Replace the models grid div with ScrollRevealStagger**

Find `<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">` (the one wrapping `models.map`). Replace:

Before:
```tsx
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <div
              key={model.key}
              className="group relative bg-soft-cloud overflow-hidden"
            >
```

After:
```tsx
        <ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <div
              key={model.key}
              className="group relative bg-soft-cloud overflow-hidden"
            >
```

And the closing `</div>` of the grid:

Before: `        </div>` (closing the grid div, before the `<p>` disclaimer)
After: `        </ScrollRevealStagger>`

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Manual visual test**

Open `http://localhost:3000`. Scroll to "Nossos Modelos". Verify:
1. Header (label + h2) fades up as a unit
2. The 4 model image cards cascade in left-to-right with 0.1s stagger

- [ ] **Step 6: Commit**

```bash
git add components/home/ModelsSection.tsx
git commit -m "feat: add scroll reveal to ModelsSection"
```

---

### Task 5: Apply scroll reveal to ContactSection

**Files:**
- Modify: `components/home/ContactSection.tsx`

**Interfaces:**
- Consumes: `ScrollReveal`, `ScrollRevealStagger` from `@/components/ui/ScrollReveal`

- [ ] **Step 1: Add imports**

Open `components/home/ContactSection.tsx`. Add this import at the top (after existing imports):

```tsx
import { ScrollReveal, ScrollRevealStagger } from "@/components/ui/ScrollReveal";
```

- [ ] **Step 2: Wrap the section header**

Find the centered header div (`className="flex flex-col items-center gap-3 mb-14 text-center"`). Wrap it with `ScrollReveal`:

Before:
```tsx
        <div className="flex flex-col items-center gap-3 mb-14 text-center">
          <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
            Fale conosco
          </span>
          <h2
            className="text-ink uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            Venha nos Visitar
          </h2>
        </div>
```

After:
```tsx
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3 mb-14 text-center">
            <span className="text-gold text-xs font-medium uppercase tracking-[0.2em]">
              Fale conosco
            </span>
            <h2
              className="text-ink uppercase leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
              }}
            >
              Venha nos Visitar
            </h2>
          </div>
        </ScrollReveal>
```

- [ ] **Step 3: Replace the contact cards grid div with ScrollRevealStagger**

Find `<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">`. Replace:

Before:
```tsx
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Localização */}
          <div className="bg-canvas border border-hairline p-6 flex flex-col gap-4">
```

After:
```tsx
        <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Localização */}
          <div className="bg-canvas border border-hairline p-6 flex flex-col gap-4">
```

And the closing `</div>` of the grid:

Before: `        </div>` (the closing tag of the 3-column grid)
After: `        </ScrollRevealStagger>`

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Manual visual test**

Open `http://localhost:3000`. Scroll to "Venha nos Visitar". Verify:
1. Header (label + h2) fades up as a unit
2. The 3 contact cards (endereço, horário, WhatsApp) stagger in with 0.1s between each

- [ ] **Step 6: Final end-to-end scroll**

Scroll the entire page top to bottom. Verify:
1. HeroSection has NO fade animation — it appears immediately
2. Each subsequent section's header fades up before its cards
3. Cards in all grids cascade in left-to-right
4. No layout shifts, no invisible elements remaining after animation
5. Trophy scroll animation is unaffected

- [ ] **Step 7: Commit**

```bash
git add components/home/ContactSection.tsx
git commit -m "feat: add scroll reveal to ContactSection"
```
