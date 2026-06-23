"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import type { Group } from "three";

function TrophyModel({ rotationY }: { rotationY: React.MutableRefObject<number> }) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF("/models/trofeu.glb");

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = rotationY.current;
    }
  });

  return (
    <group ref={group} scale={1.4} position={[0, -1, 0]}>
      <primitive object={scene} />
    </group>
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-4, 4, -4]} intensity={0.8} color="#d4af37" />
      <Environment preset="city" />
      <TrophyModel rotationY={rotationY} />
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={2}
        color="#d4af37"
      />
    </Canvas>
  );
}
