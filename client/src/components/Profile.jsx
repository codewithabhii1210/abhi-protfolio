import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion, hasFinePointer } from '../lib/motion.js';
import { PERSONAL } from '../content/site.js';

/**
 * Circular profile photo with a rotating conic ring, a soft halo, and a
 * subtle parallax that follows the pointer.
 *
 * Falls back to the user's initials if the image fails to load, so a broken
 * or missing photo never leaves a hole in the hero.
 */
export default function Profile() {
  const [imageOk, setImageOk] = useState(true);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!imageOk || !img) return;
    if (!hasFinePointer() || prefersReducedMotion()) return;

    gsap.set(img, { scale: 1.15 });

    const moveX = gsap.quickTo(img, 'x', { duration: 0.8 });
    const moveY = gsap.quickTo(img, 'y', { duration: 0.8 });

    const onMove = (event) => {
      moveX((event.clientX / window.innerWidth - 0.5) * -18);
      moveY((event.clientY / window.innerHeight - 0.5) * -18);
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [imageOk]);

  return (
    <div className="photo" data-tilt>
      <span className="halo" />
      <div className="disc">
        {imageOk ? (
          <img
            ref={imgRef}
            src={PERSONAL.photo}
            alt={`${PERSONAL.name} profile photo`}
            width="460"
            height="460"
            decoding="async"
            fetchPriority="high"
            onError={() => setImageOk(false)}
          />
        ) : (
          <span className="initials" aria-hidden="true">
            {PERSONAL.initials}
          </span>
        )}
        <i className="sheen" />
      </div>
    </div>
  );
}
