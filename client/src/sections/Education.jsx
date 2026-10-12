import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import { EDUCATION } from '../content/site.js';

/**
 * Education timeline.
 *
 * The vertical rule scales from 0 to 1 in lockstep with scroll position,
 * which reads as the line being "drawn" as you move down the list.
 */
export default function Education() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tl-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="education" ref={ref} className="sec">
      <h2 className="big" data-reveal>
        Education
      </h2>

      <div className="tl">
        <span className="tl-line" />

        {EDUCATION.map(({ year, institution, degree, note }) => (
          <div key={institution} className="tl-item" data-reveal>
            <small>{year}</small>
            <h3>{institution}</h3>
            <p>{degree}</p>
            {note && <p className="acc">{note}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
