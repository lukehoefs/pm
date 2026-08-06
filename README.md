# Upshore PM

Local-first project management for civil and construction work.

## Features

- **Projects** — name, client, location, status, dates, description
- **Kanban board** — Backlog → To Do → In Progress → Review → Done
- **Tasks** — priority, assignee, due date, move between columns
- **Submittal generator** — upload a waterworks quote PDF, parse its line
  items, match them to library products, and generate a submittal package
  (cover page, transmittal/TOC with approval boxes, section dividers, and
  merged manufacturer cut sheets) as a single PDF
- **Product library** — manufacturer cut sheet PDFs tagged with keywords
  that drive automatic quote-line matching
- **Local JSON store** — data lives in `data/db.json` (auto-seeded on first
  run); uploaded PDFs live in `data/datasheets/` and `data/quotes/`

## Submittal workflow

1. Add products (with cut sheet PDFs) under **Products**. Keywords control
   how quote lines auto-match.
2. Under **Submittals**, click **New from quote PDF** and pick a text-based
   quote PDF. Line items are parsed and matched automatically.
3. Review the draft: fix quantities/descriptions, change matches, exclude
   lines, and fill in project/contractor/engineer info.
4. Click **Generate package** to download the assembled submittal PDF.

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
