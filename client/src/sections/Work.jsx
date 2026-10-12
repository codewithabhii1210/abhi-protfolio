import { useEffect, useState } from 'react';
import { getProjects } from '../lib/api.js';
import { FEATURED_FALLBACK } from '../content/site.js';

/**
 * The featured project section.
 *
 * Data source is API-first with a hard-coded fallback:
 *   1. Try GET /api/projects and use the `featured` record (or the newest one).
 *   2. If the API is slow, down, or empty, fall back to FEATURED_FALLBACK.
 *
 * This is what makes the admin panel meaningful — edits made there show up on
 * the public site — while guaranteeing the section is never blank, even if
 * MongoDB is unreachable or the visitor is offline.
 *
 * The fallback object supplies `highlights`, which the API doesn't store, so
 * it is merged underneath the remote record.
 */
export default function Work() {
  const [project, setProject] = useState(FEATURED_FALLBACK);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const projects = await getProjects();
        if (cancelled || !Array.isArray(projects) || projects.length === 0) return;

        const featured = projects.find((p) => p.featured) || projects[0];
        setProject((prev) => ({ ...prev, ...featured }));
        setSource('live');
      } catch {
        // Network/DB failure — keep the fallback silently. The section still
        // renders correctly, so there is nothing useful to tell the visitor.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const { title, year, description, highlights, technologies, githubUrl, liveUrl } = project;
  const tag = `Featured Project${year ? ` · ${year}` : ''}`;

  return (
    <section id="work" className="sec">
      <p className="tag" data-reveal>
        {tag}
      </p>

      <h2 className="big" data-reveal>
        {String(title).toUpperCase()}
      </h2>

      <div className="stage" data-reveal>
        <div className="pcard" data-tilt data-cursor="view">
          <span>Project visual</span>
        </div>
      </div>

      <p className="lead" data-reveal>
        {description}
      </p>

      {highlights?.length > 0 && (
        <ul className="list" data-reveal>
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}

      {technologies?.length > 0 && (
        <div className="tags" data-reveal>
          {technologies.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
      )}

      <div className="row" data-reveal>
        <a data-mag className="btn primary" href="#architecture">
          View Case Study
        </a>
        {/* Only render links that actually point somewhere. */}
        {githubUrl && githubUrl !== '#' && (
          <a data-mag className="btn" href={githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
        {liveUrl && liveUrl !== '#' && (
          <a data-mag className="btn" href={liveUrl} target="_blank" rel="noopener noreferrer">
            Live Demo
          </a>
        )}
      </div>

      {source === 'live' && (
        <p className="note" data-reveal>
          Live from the portfolio API.
        </p>
      )}
    </section>
  );
}
