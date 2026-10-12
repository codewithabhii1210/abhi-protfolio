import { BEYOND } from '../content/site.js';

export default function Beyond() {
  return (
    <section id="beyond" className="sec">
      <h2 className="big" data-reveal>
        Beyond the Code.
      </h2>

      <div className="grid">
        {BEYOND.highlights.map(({ title, description }) => (
          <div key={title} className="card" data-tilt data-reveal>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>

      <div className="grid">
        <div className="card" data-reveal>
          <h3>Strengths</h3>
          <div className="chips">
            {BEYOND.strengths.map((strength) => (
              <span key={strength} className="chip">
                {strength}
              </span>
            ))}
          </div>
        </div>

        <div className="card" data-reveal>
          <h3>Interests</h3>
          <div className="chips">
            {BEYOND.interests.map((interest) => (
              <span key={interest} className="chip">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
