# Vercel deployment

Import this repository into Vercel and keep the project **root directory** set
to the repository root.

Vercel then:

- installs `client/` and `server/` from their own lockfiles,
- builds the React client into `client/dist` and serves it as the static site,
- routes `/api/*` to the serverless function at `api/[...path].js`, which wraps
  the same Express app used for local development.

## Environment variables

Set these in *Project → Settings → Environment Variables*:

| Variable | Notes |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string. Create a dedicated database user and allow Vercel's IPs in Atlas *Network Access*. |
| `JWT_SECRET` | A long random secret used to sign admin tokens. |
| `CLIENT_ORIGIN` | **Required.** Your deployed origin, e.g. `https://abhisingh.vercel.app`. Comma-separate multiple origins. |
| `ADMIN_EMAIL` | Initial admin login, used by `npm run seed`. |
| `ADMIN_PASSWORD` | Initial admin password, used by `npm run seed`. |
| `CLOUDINARY_CLOUD_NAME` | Only needed for image uploads in the admin area. |
| `CLOUDINARY_API_KEY` | Only needed for image uploads. |
| `CLOUDINARY_API_SECRET` | Only needed for image uploads. |
| `NODE_ENV` | Set to `production`. Enables the CORS allow-list and per-visitor rate limiting. |

### Why `CLIENT_ORIGIN` matters

The API only accepts requests whose `Origin` header is in the allow-list. On
Vercel the browser sends an `Origin` header on every POST — including
same-origin ones — so if `CLIENT_ORIGIN` is missing or wrong, the contact form
and the admin login will both fail with a CORS error. The server logs a
warning at boot if it is unset.

### Security notes

- Do **not** prefix secrets with `VITE_`. Anything `VITE_*` is inlined into the
  browser bundle and is public.
- `server/.env` is gitignored. Never commit it.
- The server validates its environment on boot and refuses to start if
  `MONGO_URI` or `JWT_SECRET` is missing or still set to a placeholder.

## Seeding

Run the seed once against the target database before using admin login:

```bash
npm run seed --prefix server
```

With `vercel env pull .env` you can run the same command locally against the
production database.

## After deploying

Verify the deployment:

```bash
curl https://<your-domain>/api/health
# → {"status":"ok","uptime":...}
```

If that returns a 503, the function could not reach MongoDB — check
`MONGO_URI` and Atlas network access.

The contact form posts to `POST /api/contact`; the server validates the
submission and stores it in the `contacts` collection. Authenticated admins
can read messages at `/admin`.
