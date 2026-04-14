# Frontend

This is the standalone Next.js frontend for ACPIX.

## Required env

Create `.env` with:

- `AUTH_SECRET`
- `BACKEND_URL`

Example:

```env
AUTH_SECRET="replace-with-a-long-random-secret"
BACKEND_URL="http://localhost:4000"
```

## Run

- `npm install`
- `npm run dev`

## Build

- `npm run build`
- `npm run start`

For a plain Next.js production build without OpenNext output:

- `npm run build:next`

## Cloudflare

- The checked-in Worker config is [frontend/wrangler.jsonc](/c:/project/ACPIX/frontend/wrangler.jsonc:1).
- The Worker name is set to `acpix-ui`.
- `WORKER_SELF_REFERENCE` is bound to `acpix-ui` so it does not drift to the old `acpix-frontend` name.
- `IMAGES` is declared as a Worker binding in config.
- `ASSETS` is bound to `.open-next/assets`.
- The OpenNext adapter config is [frontend/open-next.config.ts](/c:/project/ACPIX/frontend/open-next.config.ts:1).
- Cloudflare should use `npm run build` in `frontend/`, which now generates the OpenNext output needed by deploy.
- You can also run `npm run cf:deploy` locally after install.
- Keep installs deterministic by using the committed lockfile and `npm ci` where possible.

## Notes

- This frontend expects the backend API to be available at `BACKEND_URL`.
- Session cookies are still issued by the frontend layer.
- Admin media uploads are sent to the backend and served from the backend `/uploads/...` path.
