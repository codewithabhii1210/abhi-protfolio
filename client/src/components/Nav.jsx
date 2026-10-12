import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '../content/site.js';

/**
 * Fixed header with a scroll-progress bar, hide-on-scroll-down behaviour, and
 * a full-screen menu on small screens.
 *
 * The scroll listener is passive and writes straight to a transform, so it
 * never triggers layout.
 */
export default function Nav() {
  const barRef = useRef(null);
  const headerRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }

      // Only auto-hide on the way down, and never while the menu is open.
      if (headerRef.current) {
        headerRef.current.classList.toggle('hide', y > last && y > 200 && !open);
      }

      last = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={headerRef} className={`nav${open ? ' open' : ''}`}>
      <span ref={barRef} className="progress" />

      <a href="#top" className="logo" aria-label="Back to top" onClick={close}>
        AS
      </a>

      <button
        type="button"
        className={`nav-toggle${open ? ' active' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav id="primary-nav" aria-label="Primary navigation" className={open ? 'active' : ''}>
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={href} onClick={close}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
