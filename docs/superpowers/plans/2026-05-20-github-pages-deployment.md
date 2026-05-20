# GitHub Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish Aesthetic Collection to GitHub Pages with an automated GitHub Actions workflow and a GitHub About preview link.

**Architecture:** Keep the Next.js App Router app as the source of truth and statically export it for GitHub Pages. Use a GitHub Pages build environment flag to apply the repository `basePath` only in Pages builds, while local development remains rooted at `/`.

**Tech Stack:** Next.js static export, GitHub Actions, GitHub Pages, GitHub CLI, Vitest, TypeScript.

---

### Task 1: Add Static Export Contract

**Files:**
- Create: `src/config/site.ts`
- Create: `src/config/site.test.ts`
- Modify: `next.config.mjs`
- Modify: `src/app/layout.tsx`

- [x] Add a typed site config that defines the repository name, public Pages URL, About description, topics, and the GitHub Pages base path.
- [x] Add a test proving the Pages URL and base path stay aligned with the `aesthetic-collection` repository name.
- [x] Configure Next.js static export with `output: "export"`, `images.unoptimized`, and conditional `basePath` / `assetPrefix` when `NEXT_PUBLIC_GITHUB_PAGES=true`.
- [x] Point app metadata at the GitHub Pages URL.

### Task 2: Add GitHub Pages Workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [x] Create a workflow triggered by pushes to `master` and manual dispatch.
- [x] Grant `contents: read`, `pages: write`, and `id-token: write` permissions.
- [x] Run install, tests, lint, typecheck, and static build before uploading `out/`.
- [x] Deploy with `actions/deploy-pages`.

### Task 3: Update Public Documentation

**Files:**
- Modify: `README.md`

- [x] Add the live preview URL.
- [x] Document that GitHub Pages is the primary deployment path.
- [x] Keep local development and screenshot notes intact.

### Task 4: Verify, Commit, Push, and Enable Repository Metadata

**Commands:**
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `test -f out/index.html`
- `test -f out/data/sites.json`
- `test -f out/llms.txt`
- `gh repo edit Albert-Lsk/aesthetic-collection --description "A magazine-style index of aesthetic and design reference websites, with structured data for humans and AI agents." --homepage "https://albert-lsk.github.io/aesthetic-collection/"`
- `gh repo edit Albert-Lsk/aesthetic-collection --add-topic design-resources --add-topic aesthetic --add-topic curation --add-topic nextjs --add-topic ai-agents --add-topic llms-txt`
- `git push`

- [x] Run all verification commands and inspect outputs.
- [x] Commit the deployment changes.
- [x] Push to `origin/master`.
- [x] Set GitHub About description, homepage, and topics.
