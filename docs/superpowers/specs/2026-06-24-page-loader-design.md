# Page Loader — Animação de Entrada com Portão

**Data:** 2026-06-24
**Status:** Aprovado

## Objetivo

Exibir uma tela de loading full-screen que cobre todo o conteúdo da página enquanto o modelo 3D do troféu e as imagens do Hero carregam. Quando tudo estiver pronto, a tela se divide ao meio e os dois painéis deslizam para os lados como um portão, revelando o site por baixo.

## Arquitetura

### Componentes

**`app/layout.tsx`** (Server Component — modificação)
- Adiciona `<div id="loader-bg" style="position:fixed;inset:0;background:#0a0a0a;z-index:9999" />` diretamente no HTML server-rendered.
- Garante que o fundo preto está visível desde o primeiro byte da resposta HTTP, antes de qualquer JS ou React rodar — elimina completamente o flash de conteúdo.

**`components/home/PageLoader.tsx`** (novo, Client Component)
- Montado em `app/page.tsx` ao lado do conteúdo existente.
- Usa `useLayoutEffect` para tomar controle do `#loader-bg` imediatamente após hidratação.
- Renderiza via portal no `document.body`: dois painéis (esquerdo/direito), conteúdo central.
- Desmonta completamente após a animação de saída.

### Estrutura visual interna

```
#loader-bg (server-rendered, black cover)
  └── PageLoader (client, monta sobre o div)
      ├── leftPanel   — fixed, left: 0, width: 50vw, height: 100vh, bg: #0a0a0a
      ├── rightPanel  — fixed, right: 0, width: 50vw, height: 100vh, bg: #0a0a0a
      └── centerContent — fixed, centrado, z-index acima dos painéis
          ├── MiniTrophyCanvas  — Canvas R3F 140×140px, troféu girando
          ├── "AllBlack Sports" — fonte display do projeto, cor: #d4af37
          └── ProgressBar       — 200px largura, bg: #1a1a1a, fill: #d4af37
```

### Preload

`useGLTF.preload('/models/trofeu-copa-do-mundo.glb')` chamado no nível de módulo de `PageLoader.tsx` — inicia o download do GLB imediatamente ao carregar o bundle JS, antes de qualquer componente montar.

## Lógica de Loading

### Fontes de progresso

| Fonte | Hook/API | Peso |
|-------|----------|------|
| Modelo GLB | `useProgress` (drei) — `progress` (0–100) | 60% |
| Imagens do Hero | `Promise.all` com `new Image()` em `hero-mobile.png` e `hero-desktop.png` | 40% |

**Progresso combinado:**
```ts
combinedProgress = gltfProgress * 0.6 + (imagesReady ? 100 : 0) * 0.4
```

### Gatilho de abertura

Quando `combinedProgress >= 100` e `gltfActive === false` → dispara animação de saída.

## Animação de Saída (Portão)

Implementada com GSAP `gsap.timeline()`:

1. **Fade out do centro** — `centerContent` opacity 1→0, duration 0.35s, ease `power2.in` (simultâneo ao início dos painéis)
2. **Painéis deslizam** — `leftPanel` translateX 0→-50vw, `rightPanel` translateX 0→+50vw, duration 1s, ease `power2.inOut`
3. **Cleanup** — após `onComplete`: remove `#loader-bg` do DOM, desmonta o `PageLoader`

Duração total da animação: ~1s.

## Mini Trophy Canvas

- Canvas R3F dedicado, 140×140px, `alpha: true`, `dpr={[1, 1.5]}`
- Mesmo modelo GLB (já cacheado pelo preload — sem download adicional)
- Rotação idle lenta (`delta * 0.5`)
- `Suspense` com fallback: anel dourado CSS animado (enquanto o GLB carrega pela primeira vez)
- `Environment preset="studio"` para iluminação consistente com o canvas principal

## Prevenção de Flash

| Risco | Solução |
|-------|---------|
| Flash antes do React montar | `#loader-bg` server-rendered cobre tudo desde o primeiro paint |
| Flash entre SSR e hidratação | `useLayoutEffect` toma controle do div antes do browser pintar |
| Conteúdo visível durante animação de saída | `overflow: hidden` no body durante a animação |

## Arquivos Afetados

| Arquivo | Mudança |
|---------|---------|
| `app/layout.tsx` | Adiciona `#loader-bg` div e importa `PageLoader` (ou via `page.tsx`) |
| `app/page.tsx` | Adiciona `<PageLoader />` |
| `components/home/PageLoader.tsx` | Novo arquivo — componente completo |

## Fora do Escopo

- Loader em outras páginas além da home (`/`)
- Sons ou haptics
- Animação de skip (clique para pular)
- Persistência entre navegações (loader só roda no primeiro carregamento)
