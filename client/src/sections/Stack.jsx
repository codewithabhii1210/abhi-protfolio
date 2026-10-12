import { STACK } from '../content/site.js';

export default function Stack() {
  return (
    <section id="stack" className="sec">
      <h2 className="big" data-reveal>
        Technologies I Work With
      </h2>

      <div className="grid">
        {Object.entries(STACK).map(([category, items]) => (
          <div key={category} className="card" data-tilt data-reveal>
            <h3>{category}</h3>
            <div className="chips">
              {items.map((tech) => (
                <span key={tech} className="chip">
                  <i>{tech[0]}</i>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
