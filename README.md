# Pasco Pipe Supply — PM & Submittals

Local-first project management and submittal generation for
[Pasco Pipe Supply](https://www.pascopipesupply.com/), waterworks
distribution since 1976.

## Features

- **Projects** — name, client, location, status, dates, description
- **Kanban board** — Backlog → To Do → In Progress → Review → Done
- **Tasks** — priority, assignee, due date, move between columns
- **Submittal generator** — upload a waterworks quote PDF, parse its line
  items, match them to library products, and generate a Pasco-branded
  submittal package (cover page with logo and contact info, transmittal/TOC
  with approval boxes, section dividers, and merged manufacturer cut
  sheets) as a single PDF
- **Product library** — seeded with the Pasco vendor line card (McWane
  Ductile, Kennedy Valve, M&H Valve, EBAA Iron, ROMAC, JCM, Total Piping
  Solutions, Star Pipe, AY McDonald, ADS, Liberty Pumps, GPK, Sigma,
  National Pipe & Plastics, Sanderson Pipe, Multi Fittings — 58 products),
  each linked to the vendor's published submittal PDF; cut sheets can be
  fetched straight from the vendor with one click or uploaded manually
- **Local JSON store** — data lives in `data/db.json` (auto-seeded on first
  run); uploaded PDFs live in `data/datasheets/` and `data/quotes/`

## Submittal workflow

1. Under **Products**, click **Fetch missing cut sheets** to pull vendor
   submittal PDFs into the library (or add your own products; keywords
   control how quote lines auto-match).
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
