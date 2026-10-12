import { useEffect, useRef } from 'react';
import { gsap, hasFinePointer } from '../lib/motion.js';

/**
 * Custom cursor dot.
 *
 * Only mounts on hover-capable pointers — touch devices keep the native
 * cursor. The dot grows and shows a label over interactive elements, driven
 * by a single delegated `pointerover` listener.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!hasFinePointer()) return;

    const dot = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    const moveX = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3' });
    const moveY = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3' });

    const onMove = (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    const onOver = (event) => {
      const target = event.target.closest?.('[data-cursor], a, button, input, textarea');
      const state = target ? target.dataset.cursor || 'link' : '';
      dot.dataset.state = state;
      label.textContent = state === 'view' ? 'VIEW' : '';
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerover', onOver);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, []);

  return (
    <div ref={dotRef} className="cursor" aria-hidden="true">
      <span ref={labelRef} />
    </div>
  );
}
