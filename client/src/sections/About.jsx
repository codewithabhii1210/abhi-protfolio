import Counter from '../components/Counter.jsx';
import { PERSONAL, STATS } from '../content/site.js';

export default function About() {
  return (
    <section id="about" className="sec">
      <p className="tag" data-reveal>
        Who is {PERSONAL.shortName}?
      </p>
      <h2 className="big" data-reveal>
        Building. Solving. Learning.
      </h2>

      {PERSONAL.bio.map((paragraph, i) => (
        <p key={i} className="lead" data-reveal>
          {paragraph}
        </p>
      ))}

      <div className="stats">
        <Counter to={STATS.problemsSolved} suffix="+" label="Problems Solved" />
        <Counter to={STATS.streakDays} suffix=" Days" label="Coding Streak" />
        <div className="stat" data-reveal>
          <b>CSE</b>
          <small>Undergraduate</small>
        </div>
      </div>
    </section>
  );
}
