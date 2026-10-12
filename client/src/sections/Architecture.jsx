import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion.js';
import { ARCHITECTURE_FLOWS } from '../content/site.js';

/**
 * Vertical flow diagrams showing how the featured app is wired together.
 *
 * The section gets a `.live` class when scrolled into view, which switches the
 * connector animations from paused to running via CSS. Nodes fade in with a
 * stagger at the same moment.
 */
export default function Architecture() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      // Show everything immediately; the CSS animation is disabled anyway.
      el?.classList.add('live');
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        el.classList.add('live');
        gsap.from('.arch-node', {
          opacity: 0,
          y: 30,
          stagger: 0.18,
          duration: 0.7,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="architecture" ref={ref} className="sec">
      <p className="tag">System Architecture</p>
      <h2 className="big">How SehatSaarthi talks.</h2>

      <div className="arch">
        {ARCHITECTURE_FLOWS.map((flow) => (
          <div key={flow.title} className="flow">
            <small>{flow.title}</small>

            {flow.nodes.map((node, i) => (
              <div key={node} className="flow-step">
                {i > 0 && (
                  <span className="arch-link">
                    <i />
                  </span>
                )}
                <div className="arch-node">{node}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
