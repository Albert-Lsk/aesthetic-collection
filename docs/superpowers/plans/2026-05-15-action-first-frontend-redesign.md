# Action-First Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the frontend into the approved v3 action-first magazine index with restrained brutalist structure.

**Architecture:** Keep the existing Next.js App Router and single data source. Change homepage/resource-library markup only where needed for the action-first workflow, and make most visual changes in `src/app/globals.css`. Preserve all existing data routes, detail pages, type pages, and keyboard behavior.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, React Testing Library, CSS.

---

## File Structure

- Modify `.gitignore`: ignore `.superpowers/` visual companion artifacts.
- Modify `src/app/page.test.tsx`: protect the action-first homepage copy and type links.
- Modify `src/components/ResourceLibrary.test.tsx`: protect the action-oriented library heading.
- Modify `src/app/page.tsx`: add action-first hero, search prompt, type entry strip, and action rail.
- Modify `src/components/ResourceLibrary.tsx`: retitle the library as a filter desk and make results read as the next action.
- Modify `src/components/SiteCard.tsx`: expose card action labels that support the new visual design without changing behavior.
- Modify `src/app/globals.css`: replace the current soft editorial skin with the v3 palette, strong borders, grid, action panels, and scan-friendly cards.

## Task 1: Tests First

- [ ] Update `src/app/page.test.tsx` to expect `找一个审美参考入口`, `第一步：搜索或选择分类`, and all six type links.
- [ ] Update `src/components/ResourceLibrary.test.tsx` to expect `下一步：打开一个入口`.
- [ ] Run `npm test -- src/app/page.test.tsx src/components/ResourceLibrary.test.tsx`.
- [ ] Expected: FAIL because the production UI still uses the old copy.

## Task 2: Homepage Markup

- [ ] Update `src/app/page.tsx` hero copy and structure:
  - Keep top nav links.
  - Add action-first title.
  - Add first-step search prompt.
  - Add action rail.
  - Add type entry strip.
- [ ] Run `npm test -- src/app/page.test.tsx`.
- [ ] Expected: PASS.

## Task 3: Resource Library Markup

- [ ] Update `src/components/ResourceLibrary.tsx` section copy to "Filter Desk" and "下一步：打开一个入口".
- [ ] Keep search, filters, reset, keyboard, and card rendering behavior unchanged.
- [ ] Run `npm test -- src/components/ResourceLibrary.test.tsx`.
- [ ] Expected: PASS.

## Task 4: Visual System

- [ ] Update `src/app/globals.css` with the approved v3 style:
  - Cream paper background.
  - Mustard, pink, mint, navy accents.
  - Strong black borders and hard shadows.
  - Prominent search action panel.
  - Category strip.
  - Scan-friendly card grid.
  - Responsive mobile layout.
- [ ] Run `npm run lint` and `npm run typecheck`.
- [ ] Expected: PASS.

## Task 5: Full Verification

- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Start or reuse local dev server and manually check `/`, `/sites/awwwards`, `/types/vertical-archive`, `/data/sites.json`, and `/llms.txt`.
- [ ] Expected: all checks pass and homepage clearly communicates the next action.
