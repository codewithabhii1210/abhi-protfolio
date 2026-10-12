import { MARQUEE_WORDS } from '../content/site.js';

/**
 * Infinite scrolling word strip.
 *
 * The list is rendered twice and the track translates by exactly -50%, which
 * loops seamlessly without any JS. Pauses on hover via CSS.
 */
export default function Marquee() {
  const doubled = [...MARQUEE_WORDS, ...MARQUEE_WORDS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {doubled.map((word, i) => (
          <span key={`${word}-${i}`}>
            {word}
            <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
