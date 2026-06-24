'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';

if (typeof window !== 'undefined') {
  history.scrollRestoration = 'manual';
}
import { useGLTF, useProgress } from '@react-three/drei';
import { gsap } from 'gsap';
import { calcCombinedProgress } from './loaderUtils';

useGLTF.preload('/models/trofeu-copa-do-mundo.glb');

const HERO_IMAGES = ['/images/hero-mobile.png', '/images/hero-desktop.png'];

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

  // Reset scroll before TrophyScrollController.useEffect runs its setup().
  // useLayoutEffect fires before any useEffect, ensuring getBoundingClientRect()
  // reads correct positions regardless of browser scroll restoration on refresh.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Fire gate animation 2s after both sources signal done
  useEffect(() => {
    if (!allLoaded || hasAnimated.current) return;
    hasAnimated.current = true;

    let tl: ReturnType<typeof gsap.timeline>;

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);

      const loaderBg = document.getElementById('loader-bg');
      if (loaderBg) loaderBg.style.display = 'none';

      tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
        },
      });

      tl.to(centerRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
        .to(leftRef.current, { x: '-50vw', duration: 1, ease: 'power2.inOut' }, 0)
        .to(rightRef.current, { x: '50vw', duration: 1, ease: 'power2.inOut' }, 0);
    }, 2000);

    return () => {
      clearTimeout(timer);
      tl?.kill();
    };
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
          willChange: 'transform',
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
          willChange: 'transform',
        }}
      />
      {/* Center content: brand + progress bar */}
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
