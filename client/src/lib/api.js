/**
 * Minimal typed wrapper around fetch for the portfolio API.
 *
 * Design notes:
 *  - Every call goes through one `request()` so error handling, content type,
 *    and auth headers are defined exactly once.
 *  - The token lives in sessionStorage so it disappears when the tab closes.
 *  - `requireAuth` is a flag rather than a separate code path.
 */

const BASE = '/api';
const TOKEN_KEY = 'auth_token';

const getToken = () => sessionStorage.getItem(TOKEN_KEY);
const setToken = (t) => sessionStorage.setItem(TOKEN_KEY, t);
const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body, requireAuth = false } = {}) {
  const headers = {};

  // FormData must be sent untouched so the browser sets the multipart boundary.
  const isForm = body instanceof FormData;
  if (body && !isForm) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const token = getToken();
  if (requireAuth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { method, body, headers });

  // Some responses (e.g. 204) have no body; never throw on a missing payload.
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    // Surface a 401 distinctly so the admin UI can prompt a re-login.
    const error = new Error(json?.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }

  return json;
}

/* ----------------------------- Auth ------------------------------ */

export async function login(email, password) {
  const { token } = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  setToken(token);
  return token;
}

export function logout() {
  clearToken();
}

export const isLoggedIn = () => Boolean(getToken());

/* --------------------------- Projects ---------------------------- */

export const getProjects = () => request('/projects');

export const saveProject = (project) =>
  project._id
    ? request(`/projects/${project._id}`, { method: 'PUT', body: project, requireAuth: true })
    : request('/projects', { method: 'POST', body: project, requireAuth: true });

export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: 'DELETE', requireAuth: true });

/* ---------------------------- Contact ---------------------------- */

export const sendContact = (data) =>
  request('/contact', { method: 'POST', body: data });

export const getMessages = () => request('/contact', { requireAuth: true });

/* ----------------------------- Upload ---------------------------- */

export const uploadImage = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return request('/upload', { method: 'POST', body: fd, requireAuth: true });
};
