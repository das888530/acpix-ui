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

## Cloudflare

- The checked-in Worker config is [frontend/wrangler.jsonc](/c:/project/ACPIX/frontend/wrangler.jsonc:1).
- The Worker name is set to `acpix-ui`.
- `WORKER_SELF_REFERENCE` is bound to `acpix-ui` so it does not drift to the old `acpix-frontend` name.
- `IMAGES` is declared as a Worker binding in config.
- If you deploy with direct Wrangler/OpenNext output instead of Cloudflare's framework build, uncomment the `main` and `assets` section in `wrangler.jsonc` and point them at the generated output paths.

## Notes

- This frontend expects the backend API to be available at `BACKEND_URL`.
- Session cookies are still issued by the frontend layer.
- Admin media uploads are sent to the backend and served from the backend `/uploads/...` path.
