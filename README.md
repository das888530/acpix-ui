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

## Notes

- This frontend expects the backend API to be available at `BACKEND_URL`.
- Session cookies are still issued by the frontend layer.
