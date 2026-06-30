"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Mesh, Group } from "three";

/* Markaziy "shisha" blob — apelsin rangli, sekin aylanadi va deformatsiyalanadi */
function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.y = t * 0.16;
    mesh.current.rotation.x = Math.sin(t * 0.25) * 0.12;
  });
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={mesh} scale={1.55}>
        <icosahedronGeometry args={[1, 28]} />
        <MeshDistortMaterial
          color="#f97316"
          emissive="#9a3412"
          emissiveIntensity={0.18}
          roughness={0.22}
          metalness={0.25}
          distort={0.4}
          speed={1.7}
        />
      </mesh>
    </Float>
  );
}

/* Kichik orbita sharlari — chuqurlik hissi uchun */
function Orbiters() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={group}>
      {[
        { p: [2.4, 0.6, -0.5], s: 0.16, c: "#fdba74" },
        { p: [-2.2, -0.8, 0.4], s: 0.12, c: "#fb923c" },
        { p: [1.6, -1.4, 0.8], s: 0.1, c: "#ffedd5" },
      ].map((o, i) => (
        <mesh key={i} position={o.p as [number, number, number]}>
          <sphereGeometry args={[o.s, 32, 32]} />
          <meshStandardMaterial color={o.c} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

/* Kamerani sichqoncha tomon yumshoq suradi (parallax) */
function Rig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.7 - state.camera.position.x) * 0.04;
    state.camera.position.y += (state.pointer.y * 0.5 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 3]} intensity={1.7} color="#fff7ed" />
        <pointLight position={[-3, -2, -2]} intensity={2.2} color="#ea580c" />
        <pointLight position={[2.5, -3, 2]} intensity={1.3} color="#fdba74" />
        <Blob />
        <Orbiters />
        <Sparkles count={45} scale={7} size={2.2} speed={0.35} color="#fdba74" opacity={0.55} />
        <Rig />
      </Suspense>
    </Canvas>
  );
}
