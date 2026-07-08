# Upshore PM

Local-first project management for civil and construction work.

## Features

- **Projects** — name, client, location, status, dates, description
- **Kanban board** — Backlog → To Do → In Progress → Review → Done
- **Tasks** — priority, assignee, due date, move between columns
- **Local JSON store** — data lives in `data/db.json` (auto-seeded on first run)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server (Turbopack)   |
| `npm run build`| Production build         |
| `npm start`    | Run production server    |
| `npm run lint` | ESLint                   |

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- File-backed JSON API (no external database required)

## Working on this repo

Clone path used on this machine:

```text
C:\Users\luket\projects\pm
```

Remote: https://github.com/lukehoefs/pm
