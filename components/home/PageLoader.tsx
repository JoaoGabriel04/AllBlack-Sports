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

    return () => {
      tl.kill();
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
