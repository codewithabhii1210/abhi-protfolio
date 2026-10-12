import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion.js';
import Counter from '../components/Counter.jsx';
import { STATS } from '../content/site.js';

/**
 * Contribution-style heatmap plus the headline stats.
 *
 * The grid is decorative — the disclaimer below makes clear it is illustrative
 * rather than real per-day data, so it is marked `role="img"` with a label
 * instead of being read out cell by cell.
 */
const CELLS = 140;

export default function Journey() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('.cell', {
        opacity: 0,
        scale: 0,
        stagger: { each: 0.008 },
        duration: 0.4,
        scrollTrigger: { trigger: '.heat', start: 'top 85%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" ref={ref} className="sec">
      <h2 className="big" data-reveal>
        {STATS.problemsSolved}+ Problems Solved.
      </h2>

      <div className="stats">
        <Counter to={STATS.problemsSolved} suffix="+" label="Problems Solved" />
        <Counter to={STATS.streakDays} suffix="-Day" label="LeetCode Streak" />
      </div>

      <div
        className="heat"
        role="img"
        aria-label={`Illustrative visualization of a ${STATS.streakDays}-day coding streak`}
      >
        {Array.from({ length: CELLS }, (_, i) => (
          <span key={i} className={`cell${i < STATS.streakDays ? ' on' : ''}`} />
        ))}
      </div>

      <p className="note" data-reveal>
        Illustrative visualization of a {STATS.streakDays}-day streak. Not actual per-day data.
      </p>

      <p className="lead acc" data-reveal>
        Consistency &gt; Motivation.
      </p>
    </section>
  );
}
