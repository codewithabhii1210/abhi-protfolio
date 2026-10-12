import { ACHIEVEMENTS } from '../content/site.js';

export default function Achievements() {
  return (
    <section id="achievements" className="sec">
      <h2 className="big" data-reveal>
        Achievements
      </h2>

      <div className="grid">
        {ACHIEVEMENTS.map(({ metric, title, description }) => (
          <div key={title} className="card" data-tilt data-reveal>
            <b className="num">{metric}</b>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
