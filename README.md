# Shortime

Production-minded monorepo scaffold for an adult content subscription platform.

## Workspace layout

- `apps/web` - Next.js 14+ frontend
- `apps/api` - Express + TypeScript API
- `packages/shared` - shared types/constants

## Quick start

1. Install dependencies:
   - `npm install`
2. Configure API env:
   - copy `apps/api/.env.example` to `apps/api/.env`
3. Start apps in separate terminals:
   - `npm run dev:api`
   - `npm run dev:web`

## Phase 1 implemented

- JWT auth (`register`, `login`, `refresh`, `logout`)
- Adult confirmation endpoint (`POST /api/confirm-adult`)
- `GET /api/me` and `PATCH /api/me`
- Creator profile create/update/read
- Admin creator approval endpoint

## Scripts

- `npm run typecheck`
- `npm run lint`
- `npm run build`
