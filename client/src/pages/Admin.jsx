import { useCallback, useEffect, useState } from 'react';
import * as api from '../lib/api.js';

const EMPTY = {
  title: '',
  description: '',
  technologies: '',
  githubUrl: '',
  liveUrl: '',
  year: new Date().getFullYear(),
  featured: false,
  image: '',
};

/**
 * Admin panel: login, project CRUD, image upload, and the contact inbox.
 *
 * Split into three small components (LoginForm / Dashboard / ProjectForm)
 * rather than one large file with interleaved state. The auth token lives in
 * sessionStorage via lib/api.js, so a 401 anywhere simply drops us back to
 * the login screen.
 */

function LoginForm({ onSuccess }) {
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(event.target));
    try {
      await api.login(email, password);
      setError('');
      onSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <input name="email" type="email" placeholder="Email" required autoComplete="username" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="current-password"
        />
        <button className="btn primary" type="submit">
          Login
        </button>
        {error && (
          <p role="alert" className="err">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

function ProjectForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (event) =>
    setForm((f) => ({
      ...f,
      [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    }));

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await api.uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await api.saveProject({
        ...form,
        technologies: String(form.technologies)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setError('');
      setForm(EMPTY);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{form._id ? 'Edit' : 'Add'} Project</h3>

      <input placeholder="Title" value={form.title} onChange={update('title')} required />
      <textarea
        placeholder="Description"
        rows="3"
        value={form.description}
        onChange={update('description')}
      />
      <input
        placeholder="Technologies (comma-separated)"
        value={form.technologies}
        onChange={update('technologies')}
      />
      <input placeholder="GitHub URL" value={form.githubUrl} onChange={update('githubUrl')} />
      <input placeholder="Live URL" value={form.liveUrl} onChange={update('liveUrl')} />
      <input type="number" placeholder="Year" value={form.year} onChange={update('year')} />

      <label className="check">
        <input type="checkbox" checked={!!form.featured} onChange={update('featured')} />
        Featured
      </label>

      <input type="file" accept="image/*" onChange={handleUpload} />
      {form.image && <img src={form.image} alt="Project preview" width="160" />}

      {error && (
        <p role="alert" className="err">
          {error}
        </p>
      )}

      <div className="row">
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? 'Saving…' : 'Save'}
        </button>
        {form._id && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [projs, msgs] = await Promise.all([api.getProjects(), api.getMessages()]);
      setProjects(Array.isArray(projs) ? projs : []);
      setMessages(Array.isArray(msgs) ? msgs : []);
      setError('');
    } catch (err) {
      // A 401 means the token expired — drop back to login.
      if (err.status === 401) return onLogout();
      setError(err.message);
    }
  }, [onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      load();
    } catch (err) {
      if (err.status === 401) return onLogout();
      setError(err.message);
    }
  };

  return (
    <div className="admin">
      <header className="row">
        <h2>Admin Panel</h2>
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
        <a className="btn" href="/">
          View Site
        </a>
      </header>

      {error && (
        <p role="alert" className="err">
          {error}
        </p>
      )}

      <ProjectForm initial={editing} onSaved={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />

      <section>
        <h3>Projects ({projects.length})</h3>
        {projects.length === 0 && <p className="note">No projects yet.</p>}
        {projects.map((project) => (
          <div key={project._id} className="card row admin-row">
            <b>{project.title}</b>
            <span>{project.year}</span>
            {project.featured && <span className="badge">Featured</span>}
            <button className="btn" onClick={() => setEditing({ ...project, technologies: (project.technologies || []).join(', ') })}>
              Edit
            </button>
            <button className="btn" onClick={() => handleDelete(project._id)}>
              Delete
            </button>
          </div>
        ))}
      </section>

      <section>
        <h3>Messages ({messages.length})</h3>
        {messages.length === 0 && <p className="note">No messages yet.</p>}
        {messages.map((message) => (
          <div key={message._id} className="card">
            <b>{message.name}</b> · {message.email}
            <p>{message.message}</p>
            <small>{new Date(message.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(api.isLoggedIn());
  const logout = useCallback(() => {
    api.logout();
    setAuthed(false);
  }, []);

  return authed ? <Dashboard onLogout={logout} /> : <LoginForm onSuccess={() => setAuthed(true)} />;
}
