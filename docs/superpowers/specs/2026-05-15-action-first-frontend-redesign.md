# Action-First Frontend Redesign

Date: 2026-05-15
Status: Approved for implementation

## Goal

Refactor the Aesthetic Collection frontend from a decorative editorial layout into an action-first public resource index.

The user should understand the next step immediately:

- Search by task, website, tag, or use case.
- Pick a type when they do not know what to search.
- Open a site or read its local detail page from the result cards.

## Visual Direction

Use the approved v3 direction: action-first magazine index with restrained brutalist structure.

Keep:

- Editorial cover energy.
- Wes Anderson-inspired palette: pink, mint, mustard, cream, navy.
- Strong black borders, hard shadows, exposed grid, issue/index language.

Avoid:

- Abstract title treatments that require decoding.
- Oversized decorative typography that hides the workflow.
- Brutalist styling that makes cards hard to scan.

## Homepage Requirements

The first viewport must show:

- A clear title: "找一个审美参考入口".
- A short explanation of what the site does.
- A prominent search action area labeled as the first step.
- A visible category/type entry area.
- A short action rail explaining the flow: search, filter, open, detail.

The resource library must keep existing behavior:

- Search.
- Type filtering.
- Tag filtering.
- Reset.
- Keyboard shortcuts.
- External open action.
- Local detail page action.

## Data And Route Requirements

This is a visual and layout refactor only. Do not remove or weaken:

- `/data/sites.json`.
- `/llms.txt`.
- `/sites/[slug]`.
- `/types/[type]`.
- JSON-LD on detail pages.
- Screenshot fallback behavior.

## Testing Requirements

Update tests so they protect the new user-facing workflow:

- Homepage exposes the action-first title and first-step search prompt.
- Homepage exposes all six type links.
- Resource library exposes "下一步：打开一个入口".
- Search, filters, keyboard, and route/data tests remain passing.

