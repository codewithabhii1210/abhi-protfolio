import { MORE_WORK } from '../content/site.js';

/**
 * Grid of secondary projects.
 *
 * Each entry may or may not have a live URL. Without one we render a plain
 * card rather than an anchor, because an `<a>` with no `href` is not
 * keyboard-focusable and misleading to screen readers.
 */
export default function MoreWork() {
  return (
    <section id="more" className="sec">
      <p className="tag" data-reveal>
        More Work · Vibe Coding
      </p>
      <h2 className="big" data-reveal>
        Web Experiments.
      </h2>

      <div className="grid">
        {MORE_WORK.map(({ name, url }) =>
          url ? (
            <a
              key={name}
              className="card"
              data-tilt
              data-reveal
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3>{name}</h3>
              <p>View project ↗</p>
            </a>
          ) : (
            <div key={name} className="card" data-tilt data-reveal>
              <h3>{name}</h3>
              <p>Link coming soon</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
