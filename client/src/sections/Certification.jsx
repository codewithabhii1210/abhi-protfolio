import { useEffect, useRef, useState } from 'react';
import { CERTIFICATION } from '../content/site.js';

/**
 * Certification card that opens the full image in a modal.
 *
 * Accessibility notes:
 *  - Escape closes the dialog.
 *  - Focus moves into the dialog on open and back to the trigger on close.
 *  - The card is only interactive when there is actually an image to show;
 *    otherwise it renders as a plain div so it isn't a dead button.
 */
export default function Certification() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  const hasImage = Boolean(CERTIFICATION.imageUrl);

  useEffect(() => {
    if (!open) return;

    // Move focus into the dialog.
    dialogRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    // Lock background scroll while the modal is up.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      // Return focus to whatever opened the dialog.
      triggerRef.current?.focus();
    };
  }, [open]);

  const openModal = () => hasImage && setOpen(true);

  return (
    <section id="cert" className="sec">
      <h2 className="big" data-reveal>
        Certification
      </h2>

      {hasImage ? (
        <button
          ref={triggerRef}
          type="button"
          className="card certcard"
          data-tilt
          data-reveal
          data-cursor="view"
          onClick={openModal}
          aria-haspopup="dialog"
        >
          <small>Issued: {CERTIFICATION.issued}</small>
          <h3>{CERTIFICATION.title}</h3>
          <p>{CERTIFICATION.issuer}</p>
        </button>
      ) : (
        <div className="card certcard" data-tilt data-reveal>
          <small>Issued: {CERTIFICATION.issued}</small>
          <h3>{CERTIFICATION.title}</h3>
          <p>{CERTIFICATION.issuer}</p>
        </div>
      )}

      {open && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${CERTIFICATION.title} certificate`}
          tabIndex={-1}
          ref={dialogRef}
          onClick={() => setOpen(false)}
        >
          <img
            src={CERTIFICATION.imageUrl}
            alt={`${CERTIFICATION.title} certificate`}
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
}
