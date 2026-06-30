"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Mesh, Group, PointLight } from "three";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeOutBack = (p: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

const COLLIDE = 0.85; // to'qnashuv vaqti (soniya)

/* Markaziy "shisha" blob — to'qnashuvdan keyin paydo bo'ladi, so'ng sekin aylanadi */
function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    const grow = clamp((t - COLLIDE) / 0.7);
    mesh.current.scale.setScalar(Math.max(0, 1.55 * easeOutBack(grow)));
    mesh.current.rotation.y = t * 0.16;
    mesh.current.rotation.x = Math.sin(t * 0.25) * 0.12;
  });
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={mesh} scale={0}>
        <icosahedronGeometry args={[1, 28]} />
        <MeshDistortMaterial color="#f97316" emissive="#9a3412" emissiveIntensity={0.18} roughness={0.22} metalness={0.25} distort={0.4} speed={1.7} />
      </mesh>
    </Float>
  );
}

/* Ikki shar chetlardan uchib kelib markazda TO'QNASHADI, so'ng yo'qoladi */
function Colliders() {
  const left = useRef<Mesh>(null);
  const right = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const fly = easeOutCubic(clamp(t / COLLIDE));
    const xL = -5.5 + 5.5 * fly;
    const xR = 5.5 - 5.5 * fly;
    const shrink = clamp((t - COLLIDE) / 0.22);
    const s = Math.max(0, 0.55 * (1 - shrink));
    if (left.current) { left.current.position.x = xL; left.current.scale.setScalar(s); }
    if (right.current) { right.current.position.x = xR; right.current.scale.setScalar(s); }
  });
  return (
    <>
      <mesh ref={left} position={[-5.5, 0, 0]} scale={0.55}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={0.45} roughness={0.25} metalness={0.3} />
      </mesh>
      <mesh ref={right} position={[5.5, 0, 0]} scale={0.55}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fdba74" emissive="#c2410c" emissiveIntensity={0.45} roughness={0.25} metalness={0.3} />
      </mesh>
    </>
  );
}

/* To'qnashuv chaqnashi (yorug'lik portlashi) */
function Flash() {
  const light = useRef<PointLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    const d = Math.abs(state.clock.elapsedTime - COLLIDE);
    light.current.intensity = d < 0.4 ? 16 * (1 - d / 0.4) : 0;
  });
  return <pointLight ref={light} position={[0, 0, 1.6]} color="#fff7ed" intensity={0} distance={14} />;
}

/* Kichik orbita sharlari — to'qnashuvdan keyin paydo bo'ladi */
function Orbiters() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.3;
    group.current.scale.setScalar(easeOutCubic(clamp((t - 1.1) / 0.8)));
  });
  return (
    <group ref={group} scale={0}>
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
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  // Ko'rinmaganda renderni to'xtatamiz — GPU bo'shaydi, scroll silliq qoladi.
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.04 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 3]} intensity={1.7} color="#fff7ed" />
          <pointLight position={[-3, -2, -2]} intensity={2.2} color="#ea580c" />
          <pointLight position={[2.5, -3, 2]} intensity={1.3} color="#fdba74" />
          <Flash />
          <Colliders />
          <Blob />
          <Orbiters />
          <Sparkles count={45} scale={7} size={2.2} speed={0.35} color="#fdba74" opacity={0.55} />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}
