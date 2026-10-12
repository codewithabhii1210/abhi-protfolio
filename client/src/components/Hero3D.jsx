import { lazy, Suspense } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Guard for the 3D hero visual.
 *
 * Three.js is by far the heaviest dependency in the bundle, so this component
 * (a) skips it entirely for reduced-motion users and (b) defers the actual
 * canvas to a separate lazy chunk that only downloads when the hero is ready.
 */
const Canvas3D = lazy(() => import('./_Hero3DCanvas.jsx'));

export default function Hero3D() {
  if (typeof window === 'undefined') return null;
  if (prefersReducedMotion()) return null;

  return (
    <Suspense fallback={null}>
      <Canvas3D />
    </Suspense>
  );
}
