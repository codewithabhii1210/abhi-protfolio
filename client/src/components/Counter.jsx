import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';

/**
 * Animated number that counts up when scrolled into view.
 *
 * Without JS (or with reduced motion) the final value is shown immediately,
 * so the stat is never blank.
 */
export default function Counter({ to, suffix = '', label }) {
  const numRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el || prefersReducedMotion()) return;

    const state = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          value: to,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            if (numRef.current) numRef.current.textContent = `${Math.round(state.value)}${suffix}`;
          },
        }),
    });

    return () => trigger.kill();
  }, [to, suffix]);

  return (
    <div className="stat" data-reveal>
      <b ref={numRef}>
        {to}
        {suffix}
      </b>
      <small>{label}</small>
    </div>
  );
}
