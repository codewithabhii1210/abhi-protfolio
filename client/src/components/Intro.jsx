import { useEffect, useRef, useState } from 'react';

/**
 * Two-line intro overlay: a progress ring counts to 100%, then the curtains
 * split to reveal the page.
 *
 * `onDone` is fired mid-animation (when the curtains start opening) so the
 * hero can begin its own entrance in parallel rather than after a hard cut.
 */
export default function Intro({ onDone }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const numRef = useRef(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Render nothing extra for reduced-motion users; just hand control back.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDismissed(true);
      onDone?.();
      return;
    }

    let tl;

    // Dynamic import keeps GSAP out of the critical path for reduced-motion
    // users, and more importantly defers the whole timeline until after paint.
    import('gsap').then(({ gsap }) => {
      if (!rootRef.current) return;

      // Lock scroll while the overlay is up.
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const counter = { v: 0 };

      tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          setDismissed(true);
        },
      });

      tl.from('.loader', { scale: 0.8, opacity: 0, duration: 0.45, ease: 'power3.out' })
        .from('.intro-name span', { yPercent: 110, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.15)
        .to(
          counter,
          {
            v: 100,
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate: () => {
              const value = Math.round(counter.v);
              if (numRef.current) numRef.current.textContent = value;
              if (barRef.current) barRef.current.style.strokeDashoffset = 100 - counter.v;
            },
          },
          0.15
        )
        .to('.loader', { scale: 0.75, opacity: 0, duration: 0.35, ease: 'power3.in' }, '+=0.08')
        .to('.intro-name span', { yPercent: -110, duration: 0.3, stagger: 0.02, ease: 'power3.in' }, '<')
        .addLabel('open', '-=0.05')
        // Hand off to the hero right as the curtains begin to part.
        .add(() => onDone?.(), 'open')
        .to('.curtain.top', { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 'open')
        .to('.curtain.bot', { yPercent: 100, duration: 0.85, ease: 'expo.inOut' }, 'open');
    });

    return () => {
      tl?.kill();
      document.body.style.overflow = '';
    };
  }, [onDone]);

  // Nothing to render once the timeline has finished.
  if (dismissed) return null;

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <div className="curtain top" />
      <div className="curtain bot" />

      <div className="loader">
        <svg viewBox="0 0 120 120">
          <circle className="trk" cx="60" cy="60" r="54" />
          <circle ref={barRef} className="bar" cx="60" cy="60" r="54" pathLength="100" />
        </svg>
        <i className="orbit" />
        <p className="pct">
          <span ref={numRef}>0</span>
          <small>%</small>
        </p>
      </div>

      <p className="intro-name">
        {'ABHI SINGH'.split('').map((ch, i) => (
          <i key={i}>
            <span>{ch === ' ' ? '\u00a0' : ch}</span>
          </i>
        ))}
      </p>
    </div>
  );
}
