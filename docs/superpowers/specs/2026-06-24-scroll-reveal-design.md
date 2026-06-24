# Scroll Reveal Animations — Design Spec

**Data:** 2026-06-24
**Status:** Aprovado

## Objetivo

Adicionar animações de scroll reveal com GSAP ScrollTrigger nos elementos das seções abaixo do hero. Textos e labels fazem fade-up como bloco único; cards e grids aparecem em cascata com stagger de 0.1s entre filhos.

## Seções Afetadas

| Seção | Componente atual | Tipo |
|-------|-----------------|------|
| Sobre | `AboutSection.tsx` | Server Component |
| Produtos em Destaque | `FeaturedProducts.tsx` | Server Component (async) |
| Nossos Modelos | `ModelsSection.tsx` | Server Component |
| Venha nos Visitar | `ContactSection.tsx` | Server Component |

HeroSection fica fora — está acima da dobra e não deve animar na entrada.

## Arquitetura

### Componentes novos

**`components/ui/ScrollReveal.tsx`** — dois componentes exportados, ambos `'use client'`:

**`<ScrollReveal>`**
- Envolve qualquer bloco de conteúdo (título, label, parágrafos) como uma `<div>`
- Anima o wrapper inteiro: `opacity 0→1`, `y 30→0`
- Duração 0.7s, ease `power2.out`
- Trigger: `start: "top 90%"` — dispara quando 10% do elemento entra na viewport
- `toggleActions: "play none none none"` — anima uma vez, não reverte
- Props: `children`, `className?`

**`<ScrollRevealStagger>`**
- É renderizado como o próprio container grid/lista (substitui o `<div className="grid ...">`)
- Anima cada filho direto em cascata via `Array.from(el.children)`
- `stagger: 0.1s`, duração 0.6s por filho, ease `power2.out`
- Mesmo trigger e toggleActions do `ScrollReveal`
- Props: `children`, `className?`

### Por que Server Components não precisam mudar de tipo

Server Components podem importar e renderizar Client Components normalmente no App Router. `ScrollReveal` e `ScrollRevealStagger` recebem apenas `children` e `className` — props serializáveis. Nenhuma seção precisa virar `'use client'`.

### GSAP setup

`gsap.registerPlugin(ScrollTrigger)` é chamado uma vez no início de `ScrollReveal.tsx` (idempotente — GSAP ignora registros duplicados).

Cleanup no `useEffect`: `return () => { anim.scrollTrigger?.kill(); }` — evita memory leaks na navegação entre páginas.

## Animação por seção

### AboutSection

```
<ScrollReveal>
  label "Nossa história" + h2 + 3 parágrafos
</ScrollReveal>

<ScrollRevealStagger className="grid grid-cols-2 gap-4 lg:hidden">
  4 cards mobile (ícone + título + desc)
</ScrollRevealStagger>
```

O `#trophy-end-anchor` (coluna direita desktop) fica fora — é um âncora GSAP, não conteúdo visual.

### FeaturedProducts

```
<ScrollReveal>
  label "Seleção especial" + h2 "Destaques" + link "Ver todos →"
</ScrollReveal>

<ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {products.map(...)}
</ScrollRevealStagger>
```

### ModelsSection

```
<ScrollReveal>
  label "Linha completa" + h2 "Nossos Modelos"
</ScrollReveal>

<ScrollRevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  4 cards de modelo
</ScrollRevealStagger>
```

### ContactSection

```
<ScrollReveal>
  label "Fale conosco" + h2 "Venha nos Visitar"
</ScrollReveal>

<ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
  3 cards (localização, horário, WhatsApp)
</ScrollRevealStagger>
```

## Valores de animação

| Parâmetro | ScrollReveal | ScrollRevealStagger |
|-----------|-------------|---------------------|
| `from` | `opacity: 0, y: 30` | `opacity: 0, y: 30` |
| `to` | `opacity: 1, y: 0` | `opacity: 1, y: 0` |
| `duration` | `0.7s` | `0.6s` |
| `ease` | `power2.out` | `power2.out` |
| `stagger` | — | `0.1s` |
| `start` trigger | `top 90%` | `top 90%` |
| `toggleActions` | `play none none none` | `play none none none` |

## Arquivos afetados

| Arquivo | Mudança |
|---------|---------|
| `components/ui/ScrollReveal.tsx` | Criar — dois componentes exportados |
| `components/home/AboutSection.tsx` | Modificar — adicionar wrappers |
| `components/home/FeaturedProducts.tsx` | Modificar — adicionar wrappers |
| `components/home/ModelsSection.tsx` | Modificar — adicionar wrappers |
| `components/home/ContactSection.tsx` | Modificar — adicionar wrappers |

## Fora do escopo

- Animações diferentes por seção (definido: fade-up + stagger)
- Animações no HeroSection
- Animação de saída ao rolar de volta
- Delay configurável (valor fixo: `top 90%`)
- Redução de movimento (`prefers-reduced-motion`) — pode ser adicionado futuramente
