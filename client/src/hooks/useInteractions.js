import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, hasFinePointer } from '../lib/motion.js';

/**
 * All scroll-reveal and pointer-driven effects for the public site.
 *
 * Runs once at mount and returns a single cleanup. Rather than attaching a
 * listener per element, pointer effects are delegated to `document` and
 * resolved with `closest()`, so the cost is flat regardless of how many
 * magnetic/tilt targets exist.
 */
export function useInteractions() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fine = hasFinePointer();
    const cleanups = [];

    /* ---------------- Scroll reveals ---------------- */

    if (!reduced) {
      gsap.set('[data-reveal]', { opacity: 0, y: 40 });

      const batch = ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        once: true,
        onEnter: (elements) =>
          gsap.to(elements, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }),
      });

      cleanups.push(() => batch.forEach((trigger) => trigger.kill()));
    }

    /* --------------- Pointer-driven effects --------------- */

    if (fine && !reduced) {
      let activeMag = null;
      let activeTilt = null;

      const resetMag = (el) => {
        if (el) gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,.4)' });
      };
      const resetTilt = (el) => {
        if (el) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6 });
      };

      const onMove = (event) => {
        // Magnetic buttons — pull toward the cursor.
        const mag = event.target.closest?.('[data-mag]');
        if (mag !== activeMag) {
          resetMag(activeMag);
          activeMag = mag;
        }
        if (mag) {
          const box = mag.getBoundingClientRect();
          gsap.to(mag, {
            x: (event.clientX - box.left - box.width / 2) * 0.3,
            y: (event.clientY - box.top - box.height / 2) * 0.3,
            duration: 0.4,
          });
        }

        // Tilted cards — rotate based on pointer position.
        const tilt = event.target.closest?.('[data-tilt]');
        if (tilt !== activeTilt) {
          resetTilt(activeTilt);
          activeTilt = tilt;
        }
        if (tilt) {
          const box = tilt.getBoundingClientRect();
          gsap.to(tilt, {
            transformPerspective: 800,
            rotateY: ((event.clientX - box.left) / box.width - 0.5) * 10,
            rotateX: -((event.clientY - box.top) / box.height - 0.5) * 10,
            duration: 0.4,
          });
        }

        // Spotlight — expose cursor position to CSS via custom properties.
        const card = event.target.closest?.('.card');
        if (card) {
          const box = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${event.clientX - box.left}px`);
          card.style.setProperty('--my', `${event.clientY - box.top}px`);
        }
      };

      document.addEventListener('pointermove', onMove, { passive: true });
      cleanups.push(() => {
        document.removeEventListener('pointermove', onMove);
        resetMag(activeMag);
        resetTilt(activeTilt);
      });
    }

    /* --------------- Layout sanity --------------- */

    // Lazy sections and web fonts change document height after load.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    cleanups.push(() => window.removeEventListener('load', refresh));

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
