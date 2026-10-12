# My Portfolio

A production-ready MERN portfolio, rebuilt from scratch with an emphasis on
small, readable, efficient code.

## What changed vs. the previous version

| Area | Before | Now |
|---|---|---|
| Public project data | Hardcoded only — the API and database were never used by the site | **API-first with embedded fallback** — the site reads `/api/projects` and falls back to local content if the API is down |
| CORS in production | Silent failure if `CLIENT_ORIGIN` was unset | Validated at startup, warned loudly, documented |
| Rate limiting | Shared one bucket for all visitors (`trust proxy` unset) | Per-visitor, `trust proxy` set in production |
| Environment checks | `JWT_SECRET` only | All required vars validated on boot with clear messages |
| GSAP setup | `registerPlugin` duplicated across 5 files | Registered once in `lib/motion.js` |
| Pointer effects | A listener per element | Two delegated listeners on `document` |
| Content | Sprinkled through components | Centralised in `content/site.js` |
| CSS | One 935-line file | Split by concern, driven by design tokens |
| Admin panel | One 120-line component | Split into `LoginForm` / `Dashboard` / `ProjectForm` |
| Errors | Generic "something went wrong" | Server messages surfaced, client mirrors server validation |
| Anchor links | Instant jump against smooth scroll | Intercepted and eased by Lenis |

## Tech stack

- **Frontend:** React 18, Vite, GSAP, Lenis, Three.js / @react-three/fiber
- **Backend:** Node.js, Express (runs locally *and* as a Vercel serverless function)
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **Uploads:** Cloudinary

## Project structure

```
├── api/[...path].js      Vercel serverless entry — wraps the Express app
├── client/
│   ├── src/
│   │   ├── components/   Reusable UI (Nav, Cursor, Intro, Profile, Hero3D…)
│   │   ├── content/      All site copy and data in one file
│   │   ├── hooks/        useSmoothScroll, useInteractions
│   │   ├── lib/          api.js (fetch wrapper), motion.js (GSAP setup)
│   │   ├── pages/        Admin panel
│   │   ├── sections/     One file per page section
│   │   └── styles/       Split CSS, token-driven
│   └── public/
└── server/
    ├── config/           Env validation, database connection
    ├── controllers/      Route handlers
    ├── middleware/       auth, error handling, validation
    ├── models/           User, Project, Contact
    ├── routes/           All routes + rate limiting + upload
    └── scripts/seed.js   Creates admin + seeds a project
```

## Local development

### 1. Install dependencies

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Configure the environment

```bash
cp .env.example server/.env
# then edit server/.env with your real values
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start both dev servers

```bash
npm run dev:server    # terminal 1 — API on :5000
npm run dev:client    # terminal 2 — frontend on :5173
```

Open http://localhost:5173

## Environment variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Minimum 32 characters. `openssl rand -hex 32` |
| `CLIENT_ORIGIN` | ⚠️ prod | Comma-separated allowed origins. **Without this the deployed contact form and admin login will fail.** |
| `PORT` | — | Server port (default `5000`) |
| `NODE_ENV` | — | `development` or `production` |
| `CLOUDINARY_CLOUD_NAME` | for uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | for uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | for uploads | Cloudinary API secret |
| `ADMIN_EMAIL` | seed only | Admin login email |
| `ADMIN_PASSWORD` | seed only | Admin login password |

> Never put these in `VITE_*` variables — anything prefixed `VITE_` is
> bundled into the browser build and is public.

### `client/.env` (optional overrides)

`VITE_GITHUB_URL`, `VITE_LINKEDIN_URL`, `VITE_EMAIL`, `VITE_PHOTO`,
`VITE_SEHATSAARTHI_GITHUB`, `VITE_SEHATSAARTHI_LIVE`, `VITE_BMW_URL`,
`VITE_APPLE_URL`, `VITE_NETFLIX_URL`, `VITE_CLOTHING_URL`, `VITE_CERT_IMAGE`

Anything unset falls back to the defaults in `client/src/content/site.js`.

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Liveness check |
| `POST` | `/api/auth/login` | — | Returns a JWT |
| `GET` | `/api/projects` | — | List projects |
| `GET` | `/api/projects/:id` | — | Single project |
| `POST` | `/api/projects` | ✅ | Create project |
| `PUT` | `/api/projects/:id` | ✅ | Update project |
| `DELETE` | `/api/projects/:id` | ✅ | Delete project |
| `POST` | `/api/contact` | — | Submit the contact form |
| `GET` | `/api/contact` | ✅ | Read messages |
| `POST` | `/api/upload` | ✅ | Upload an image (≤5 MB) |

`/api/auth/login` and `/api/contact` are rate limited to **20 requests per
15 minutes per IP**.

## Vercel deployment

1. Push this repository to GitHub.
2. Import it into Vercel. Keep the **root directory** at the repo root.
3. Add every variable from `server/.env` in *Settings → Environment Variables*.
4. Deploy.

Vercel builds `client/dist` as the static site and routes `/api/*` to
`api/[...path].js`. See `DEPLOYMENT.md` for details.

## Admin panel

Visit `/admin` to manage projects and read contact messages. Credentials come
from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`. Run `npm run seed`
once to create the account.
