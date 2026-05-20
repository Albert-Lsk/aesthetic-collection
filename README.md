# Aesthetic Collection

Aesthetic Collection is a curated index of design and aesthetic reference websites.

It is built as a human-facing resource page and an agent-readable dataset at the same time. The frontend is optimized for fast search, filtering, and opening external sites. The backend data is kept structured so the same collection can later be reused by AI tools, MCP servers, or other automation.

## What It Includes

- A magazine-style homepage for browsing curated design resources.
- Search, type filters, tag filters, and keyboard shortcuts.
- Website cards with preview screenshots, external links, and local detail pages.
- Type pages for community platforms, portfolio platforms, media magazines, award directories, vertical archives, and independent cases.
- Machine-readable endpoints at `/data/sites.json` and `/llms.txt`.
- A Playwright screenshot capture script for refreshing website previews.

## Data Model

The canonical site list lives in `src/data/sites.ts`.

Each record includes:

- Name, slug, URL, and type.
- Summary, longer description, tags, use cases, and strengths.
- Agent notes for machine-readable context.
- Source tweet URL and update date.
- Screenshot path and capture status.

Derived surfaces include:

- `/` for the homepage and searchable library.
- `/sites/[slug]` for detail pages.
- `/types/[type]` for category pages.
- `/data/sites.json` for structured JSON.
- `/llms.txt` for LLM-readable context.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` unless Next.js prints another port.

## Screenshots

Install the Playwright browser once:

```bash
npx playwright install chromium
```

Refresh screenshots:

```bash
npm run screenshots
```

Screenshots are written to `public/screenshots/`. Capture metadata is written to `public/screenshots/manifest.json`.

Some sites block automated browsers or render inconsistently by region. The capture script keeps existing screenshots when a later recapture fails, and uses a local fallback poster for sites that restrict automated screenshots.

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Deployment

This is a standard Next.js app and can be deployed to Vercel or any Node-compatible host.

Recommended Vercel settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`

## Screenshot Notice

Preview screenshots are used only as navigation references for the linked third-party websites. The original websites, brands, logos, and visual materials belong to their respective owners.

If a screenshot should be removed or replaced, update the corresponding file in `public/screenshots/` or rerun the screenshot capture script after changing the site data.
