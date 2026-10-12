import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';

/**
 * Lenis smooth scrolling wired into GSAP's ticker.
 *
 * Also intercepts in-page anchor clicks so `#section` links glide with the
 * same easing as the wheel, instead of snapping instantly (the default
 * browser behaviour, which clashed with Lenis).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis's virtual scroll position.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so both share one rAF loop.
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      if (!anchor) return;

      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -20 });
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
