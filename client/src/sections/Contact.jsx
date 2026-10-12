import { useState } from 'react';
import { sendContact } from '../lib/api.js';
import { PERSONAL } from '../content/site.js';

/** Mirrors the server's express-validator rules so we fail fast in the browser. */
function validate({ name, email, message }) {
  if (!name.trim()) return 'Please enter your name.';
  if (name.length > 100) return 'Name must be 100 characters or fewer.';
  if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';
  if (message.trim().length < 5) return 'Message must be at least 5 characters.';
  if (message.length > 2000) return 'Message must be 2000 characters or fewer.';
  return null;
}

export default function Contact() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));

    const problem = validate(data);
    if (problem) {
      setError(problem);
      setStatus('error');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      await sendContact(data);
      setStatus('sent');
      form.reset();
    } catch (err) {
      // Surface the server's message when there is one — it is more specific
      // than a generic failure notice.
      setError(err?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="sec">
      <h2 className="big" data-reveal>
        Let&apos;s Build Something.
      </h2>
      <p className="lead" data-reveal>
        Have an idea, opportunity or project in mind? Let&apos;s connect.
      </p>

      <form onSubmit={handleSubmit} className="form" noValidate>
        <input
          name="name"
          placeholder="Name"
          required
          maxLength={100}
          aria-label="Your name"
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          maxLength={200}
          aria-label="Your email"
          autoComplete="email"
        />
        <textarea
          name="message"
          placeholder="Message"
          rows="5"
          required
          maxLength={2000}
          aria-label="Your message"
        />

        <button data-mag className="btn primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
        </button>

        <p role="status" aria-live="polite">
          {status === 'sent' && 'Thanks — message sent!'}
          {status === 'error' && error}
        </p>
      </form>

      <div className="row">
        <a
          data-mag
          className="btn"
          href={PERSONAL.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          data-mag
          className="btn"
          href={PERSONAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a data-mag className="btn" href={`mailto:${PERSONAL.email}`}>
          Email
        </a>
      </div>
    </section>
  );
}
