import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * The actual Three.js scene behind the hero.
 *
 * Kept in its own file and lazily imported so the ~600 KB Three.js chunk never
 * blocks first paint. Two small optimisations matter here:
 *
 *  1. `frameloop` flips to 'never' when the hero scrolls out of view, so the
 *     GPU is released instead of rendering 60 invisible frames a second.
 *  2. Geometry detail and particle count scale down on small screens.
 */

// Evaluated once at module load — the hero doesn't resize across breakpoints
// in a way that justifies a resize listener.
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches;

const ORBIT_RADIUS = 1.75;
const SEGMENTS = isMobile ? 8 : 14;

/** Four satellites orbiting a slowly rotating ring. */
function OrbitRing() {
  const group = useRef();

  useFrame(({ pointer }, delta) => {
    if (!group.current) return;

    group.current.rotation.z += delta * 0.18;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.45 + (pointer?.y || 0) * 0.3,
      0.05
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      (pointer?.x || 0) * 0.4,
      0.05
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[ORBIT_RADIUS, 0.006, 8, isMobile ? 48 : 96]} />
        <meshBasicMaterial color="#7cf5c8" transparent opacity={0.5} />
      </mesh>

      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * ORBIT_RADIUS, Math.sin(angle) * ORBIT_RADIUS, 0]}
          >
            <sphereGeometry args={[0.09, SEGMENTS, SEGMENTS]} />
            <meshBasicMaterial color="#f2f2ee" />
          </mesh>
        );
      })}
    </group>
  );
}

/** Slowly drifting dust to give the background some depth. */
function Particles() {
  const count = isMobile ? 40 : 140;

  // Generated once; `count` is constant for the lifetime of the component.
  const positions = useMemo(
    () => Float32Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 7),
    [count]
  );

  const points = useRef();

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8a8a85" sizeAttenuation />
    </points>
  );
}

export default function Hero3DCanvas() {
  const box = useRef(null);
  // Render continuously only while the hero is actually on screen.
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!box.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="hero3d" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ antialias: !isMobile, powerPreference: 'high-performance' }}
      >
        <OrbitRing />
        <Particles />
      </Canvas>
    </div>
  );
}
