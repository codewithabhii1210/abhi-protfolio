import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion.js';
import Profile from '../components/Profile.jsx';
import { PERSONAL } from '../content/site.js';

// Deferred: the 3D chunk is heavy and only needed once the intro finishes.
const Hero3D = lazy(() => import('../components/Hero3D.jsx'));

export default function Hero({ ready }) {
  const sectionRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Cycle through the role headlines.
  useEffect(() => {
    const timer = setInterval(
      () => setRoleIndex((i) => (i + 1) % PERSONAL.roles.length),
          2400
        );
    return () => clearInterval(timer);
  }, []);

  // Entrance animation, gated on `ready` so it doesn't play under the intro.
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('.h-line span', { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
        .from('.h-fade', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, '-=.6')
        .from('.photo, .hero3d', { opacity: 0, scale: 0.85, duration: 1.2, ease: 'power3.out' }, 0.2);
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={sectionRef} className="hero" id="top">
      <div className="hero-copy">
        <p className="h-fade tag">
          <b className="dot" />
          {PERSONAL.availability}
        </p>

        <h1>
          <span className="h-line">
            <span>{PERSONAL.tagline}</span>
          </span>
          <span className="h-line">
            <span>{PERSONAL.headline}</span>
          </span>
        </h1>

        <p className="h-fade role" aria-live="polite">
          <span key={roleIndex}>{PERSONAL.roles[roleIndex]}</span>
        </p>

        <p className="h-fade lead">
          Hi, I&apos;m {PERSONAL.shortName}. Computer Science undergraduate focused on building
          modern web applications, solving problems and continuously improving my development
          skills.
        </p>

        <div className="h-fade row">
          <a data-mag className="btn primary" href="#work">
            View My Work
          </a>
          <a data-mag className="btn" href="#contact">
            Let&apos;s Connect
          </a>
        </div>
      </div>

      <div className="hero-visual">
        {ready && (
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
        )}
        <Profile />
      </div>
    </section>
  );
}
