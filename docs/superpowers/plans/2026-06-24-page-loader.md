# PageLoader — Gate Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen black loader with a mini spinning trophy, brand name, and gold progress bar that splits open like a gate once the GLB model and Hero images finish loading.

**Architecture:** A `#loader-bg` div server-rendered in `layout.tsx` prevents any flash of content before React hydrates. The `PageLoader` client component mounts two fixed panels (left 50vw, right 50vw) that together cover the full screen; it tracks GLB progress via `useProgress` (drei) and hero-image loading via `Promise.all` + `new Image()`. When both signal done, it hides `#loader-bg`, runs a GSAP timeline that slides the panels off-screen while fading the center content, then unmounts.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3.15, `@react-three/drei` (`useGLTF`, `useProgress`, `Environment`), `@react-three/fiber` (`Canvas`, `useFrame`), Three.js 0.184, vitest

## Global Constraints

- Colors: background `#0a0a0a`, gold `#d4af37`, surface `#1a1a1a`
- Font family for brand name: `var(--font-display)` (Bebas Neue)
- GLB path: `/models/trofeu-copa-do-mundo.glb`
- Hero image paths: `/images/hero-mobile.png`, `/images/hero-desktop.png`
- Progress weights: GLB 60%, images 40%; formula: `Math.round(gltfProgress * 0.6 + (imagesLoaded ? 100 : 0) * 0.4)`
- Gate animation: 1 s total, ease `power2.inOut`; center fade: 0.35 s, ease `power2.in`, starts simultaneously
- z-index stack: `#loader-bg` → 9998, panels → 9999, center content → 10000
- Brand text: `"AllBlack Sports"`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `components/home/loaderUtils.ts` | Pure progress-calculation function (no React, no Three.js) |
| Create | `components/home/loaderUtils.test.ts` | Vitest unit tests for the above |
| Create | `components/home/PageLoader.tsx` | Full loader component: panels, mini canvas, progress bar, GSAP animation |
| Modify | `app/layout.tsx` | Add server-rendered `#loader-bg` div |
| Modify | `app/page.tsx` | Mount `<PageLoader />` |

---

### Task 1: Server-rendered flash-prevention overlay

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add `#loader-bg` as first child of `<body>`**

Open `app/layout.tsx`. The current `<body>` block is:

```tsx
<body>
  <Providers session={session}>{children}</Providers>
</body>
```

Replace it with:

```tsx
<body>
  <div
    id="loader-bg"
    style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0a0a',
      zIndex: 9998,
    }}
  />
  <Providers session={session}>{children}</Providers>
</body>
```

- [ ] **Step 2: Verify the div is server-rendered**

Run: `npm run dev`

In the browser, open DevTools → Network → find the document request → Preview tab. Search for `loader-bg` in the raw HTML. It must appear in the initial HTML payload, not injected by a script.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add server-rendered #loader-bg to prevent content flash on load"
```

---

### Task 2: Progress-calculation util (TDD)

**Files:**
- Create: `components/home/loaderUtils.ts`
- Create: `components/home/loaderUtils.test.ts`

**Interfaces:**
- Produces: `calcCombinedProgress(gltfProgress: number, imagesLoaded: boolean): number`
  — returns an integer 0–100; consumed by `PageLoader.tsx` in Task 3.

- [ ] **Step 1: Write the failing tests**

Create `components/home/loaderUtils.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { calcCombinedProgress } from './loaderUtils';

describe('calcCombinedProgress', () => {
  it('returns 0 when nothing has loaded', () => {
    expect(calcCombinedProgress(0, false)).toBe(0);
  });

  it('returns 60 when GLB is at 100% but images are not done', () => {
    expect(calcCombinedProgress(100, false)).toBe(60);
  });

  it('returns 40 when GLB is at 0% but images are done', () => {
    expect(calcCombinedProgress(0, true)).toBe(40);
  });

  it('returns 100 when both GLB and images are fully loaded', () => {
    expect(calcCombinedProgress(100, true)).toBe(100);
  });

  it('returns 30 at 50% GLB with images not done', () => {
    expect(calcCombinedProgress(50, false)).toBe(30);
  });

  it('rounds fractional progress down', () => {
    // 33 * 0.6 = 19.8 → rounds to 20
    expect(calcCombinedProgress(33, false)).toBe(20);
  });
});
```

- [ ] **Step 2: Run to confirm failure**

```bash
npm test
```

Expected output: FAIL — `Cannot find module './loaderUtils'`

- [ ] **Step 3: Implement the util**

Create `components/home/loaderUtils.ts`:

```ts
export function calcCombinedProgress(gltfProgress: number, imagesLoaded: boolean): number {
  return Math.round(gltfProgress * 0.6 + (imagesLoaded ? 100 : 0) * 0.4);
}
```

- [ ] **Step 4: Run tests and confirm all pass**

```bash
npm test
```

Expected output: 6 tests PASS, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add components/home/loaderUtils.ts components/home/loaderUtils.test.ts
git commit -m "feat: add calcCombinedProgress util with vitest coverage"
```

---

### Task 3: PageLoader component + page integration

**Files:**
- Create: `components/home/PageLoader.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `calcCombinedProgress` from `./loaderUtils` (signature above)
- Produces: `<PageLoader />` — exported named React component, no props

**How `allLoaded` works:**
`useProgress` from drei returns `{ active, progress }` that reflect Three.js's `DefaultLoadingManager`. When `active` is `false`, no download is in flight. `imagesLoaded` starts `false` and flips `true` only after `Promise.all` resolves — so `allLoaded` is never true on the very first render regardless of network speed.

**Why `#loader-bg` is hidden before the animation (not after):**
The two panels together cover 100% of the viewport. To reveal site content through the gap as the panels slide apart, `#loader-bg` (which sits behind both panels) must be hidden first. If it were visible during the animation it would block the content.

- [ ] **Step 1: Create `components/home/PageLoader.tsx`**

```tsx
'use client';

import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useProgress, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import type { Group } from 'three';
import { calcCombinedProgress } from './loaderUtils';

useGLTF.preload('/models/trofeu-copa-do-mundo.glb');

const HERO_IMAGES = ['/images/hero-mobile.png', '/images/hero-desktop.png'];

function MiniTrophy() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF('/models/trofeu-copa-do-mundo.glb');
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}

function RingFallback() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 2;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.3, 0.04, 8, 48]} />
      <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
    </mesh>
  );
}

function useImagePreload(urls: string[]) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Promise.all(
      urls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve(); // never block on broken images
            img.src = url;
          })
      )
    ).then(() => setLoaded(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return loaded;
}

export function PageLoader() {
  const [done, setDone] = useState(false);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const { active, progress: gltfProgress } = useProgress();
  const imagesLoaded = useImagePreload(HERO_IMAGES);

  const combinedProgress = calcCombinedProgress(gltfProgress, imagesLoaded);
  const allLoaded = !active && imagesLoaded;

  // Drive progress bar width directly via ref to avoid re-renders
  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${combinedProgress}%`;
    }
  }, [combinedProgress]);

  // Fire gate animation once when both sources signal done
  useEffect(() => {
    if (!allLoaded || hasAnimated.current) return;
    hasAnimated.current = true;

    // Hide #loader-bg so the content behind the panels is visible through
    // the gap as the panels slide apart
    const loaderBg = document.getElementById('loader-bg');
    if (loaderBg) loaderBg.style.display = 'none';

    const tl = gsap.timeline({
      onComplete: () => {
        loaderBg?.remove();
        setDone(true);
      },
    });

    tl.to(centerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
      .to(leftRef.current, { x: '-50vw', duration: 1, ease: 'power2.inOut' }, 0)
      .to(rightRef.current, { x: '50vw', duration: 1, ease: 'power2.inOut' }, 0);
  }, [allLoaded]);

  if (done) return null;

  return (
    <>
      {/* Left gate panel */}
      <div
        ref={leftRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '50vw',
          height: '100vh',
          background: '#0a0a0a',
          zIndex: 9999,
        }}
      />
      {/* Right gate panel */}
      <div
        ref={rightRef}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          width: '50vw',
          height: '100vh',
          background: '#0a0a0a',
          zIndex: 9999,
        }}
      />
      {/* Center content: mini trophy + brand + progress bar */}
      <div
        ref={centerRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          pointerEvents: 'none',
        }}
      >
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
          style={{ width: 140, height: 140 }}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
          <Suspense fallback={<RingFallback />}>
            <Environment preset="studio" />
            <MiniTrophy />
          </Suspense>
        </Canvas>

        <span
          style={{
            fontFamily: 'var(--font-display)',
            color: '#d4af37',
            fontSize: '1.5rem',
            letterSpacing: '0.15em',
            whiteSpace: 'nowrap',
          }}
        >
          AllBlack Sports
        </span>

        {/* Progress bar */}
        <div
          style={{
            width: 200,
            height: 4,
            background: '#1a1a1a',
            borderRadius: 2,
          }}
        >
          <div
            ref={barRef}
            style={{
              width: '0%',
              height: '100%',
              background: '#d4af37',
              borderRadius: 2,
              transition: 'width 0.2s linear',
            }}
          />
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Add `<PageLoader />` to `app/page.tsx`**

Open `app/page.tsx`. Replace the entire file with:

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ModelsSection } from "@/components/home/ModelsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { TrophyScrollController } from "@/components/home/TrophyScrollController";
import { PageLoader } from "@/components/home/PageLoader";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <FeaturedProducts />
        <ModelsSection />
        <ContactSection />
      </main>
      <Footer />
      <TrophyScrollController />
      <PageLoader />
    </>
  );
}
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors. If TypeScript reports errors for `useGLTF.preload` or `useProgress`, check that `@types/three` and `@react-three/drei` versions are compatible (they are per `package.json`).

- [ ] **Step 4: Manual end-to-end test — normal connection**

```bash
npm run dev
```

Open `http://localhost:3000` and verify in order:

1. **No flash** — page content is never visible before the loader; the screen is black from the very first frame
2. **Mini trophy** — gold torus ring spins at center while GLB loads, then switches to the actual trophy model
3. **Brand name** — "AllBlack Sports" appears in gold Bebas Neue font below the trophy
4. **Progress bar** — gold bar fills from left to right as GLB and images load
5. **Gate opens** — center content fades out while left panel slides left and right panel slides right, revealing the site behind
6. **Clean exit** — after animation completes, loader is fully gone from DOM (check DevTools Elements — no `#loader-bg`, no panel divs)
7. **Site usable** — scroll, hover, trophy animation all work normally after loader exits

- [ ] **Step 5: Manual end-to-end test — throttled connection**

In Chrome DevTools → Network tab → throttle dropdown → select **Slow 3G**.

Reload the page and verify:

1. Black screen holds while assets download
2. Progress bar visibly fills in steps (not instant)
3. Trophy ring fallback is visible for longer before model appears
4. Gate animation still fires correctly once bar reaches 100%

- [ ] **Step 6: Commit**

```bash
git add components/home/PageLoader.tsx app/page.tsx
git commit -m "feat: PageLoader gate animation with mini trophy, progress bar, and flash prevention"
```
