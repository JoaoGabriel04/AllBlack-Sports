"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, OrbitControls } from "@react-three/drei";
import type { Group } from "three";

function TrophyModel({
  rotationY,
}: {
  rotationY: React.MutableRefObject<number>;
}) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/world cup trophy 3d model.glb");

  // clone evita compartilhamento de estado do scene graph entre renders
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = rotationY.current;
    }
  });

  return (
    <group ref={group} scale={1.4} position={[0, -1, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#d4af37" wireframe />
    </mesh>
  );
}

export function TrophyCanvas({
  rotationY,
}: {
  rotationY: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Iluminação manual — sem depender de CDN externa (Environment preset) */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#d4af37" />
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-4, 2, 4]} intensity={0.5} color="#d4af37" />

      <Suspense fallback={<LoadingFallback />}>
        <TrophyModel rotationY={rotationY} />
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.35}
          scale={5}
          blur={2}
          far={2}
          color="#d4af37"
        />
      </Suspense>
    </Canvas>
  );
}
