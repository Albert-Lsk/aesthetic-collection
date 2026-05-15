# Aesthetic Collection

Aesthetic Collection is a Next.js content site for curated aesthetic and design inspiration websites.

It has two surfaces:

- A human-facing navigation page with search, filters, screenshots, and detail pages.
- Agent-readable data through `/data/sites.json` and `/llms.txt`.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run typecheck
npm run build
```

## Screenshots

```bash
npx playwright install chromium
npm run screenshots
```

Screenshots are written to `public/screenshots/`. Capture failures are recorded in `public/screenshots/manifest.json`.
