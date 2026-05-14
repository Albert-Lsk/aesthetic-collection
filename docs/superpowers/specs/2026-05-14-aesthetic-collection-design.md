# Aesthetic Collection Design

Date: 2026-05-14
Status: Draft for user review
Source: https://x.com/xiaoerzhan/status/2050427465714352451

## Goal

Build Aesthetic Collection as a Next.js content site for a curated set of aesthetic and design inspiration websites.

The first version serves two audiences:

- Human users who want a fast personal navigation page for frequently used design resources.
- AI agents and LLMs that need structured, reliable data about the collection.

The site should feel like an aesthetic magazine, but it must remain useful as a high-frequency resource launcher.

## Core Direction

Use the "magazine cover + commandable resource library" model.

The homepage opens with a visually strong editorial cover area and featured website screenshots. The main body is a searchable, filterable resource library with keyboard-friendly interactions. All pages and machine-readable outputs are generated from one structured site data source.

## First-Version Scope

Included:

- Next.js content site.
- Structured data for the 15 websites from the source tweet.
- Homepage with magazine cover area and searchable resource library.
- Website type filtering.
- Tag filtering.
- Keyboard shortcuts.
- Individual website detail pages.
- Website type aggregation pages.
- Automated screenshot capture script.
- Public `/data/sites.json` endpoint.
- Public `/llms.txt` file.
- Basic SEO metadata, Open Graph metadata, and JSON-LD.
- Screenshot fallback visual when capture fails.

Excluded:

- User accounts.
- Cloud-synced favorites.
- Open-frequency analytics.
- Admin CMS.
- MCP server implementation.
- Automatic recurring content summarization.
- Full multilingual switching.

## Site Taxonomy

The primary organization is by website type:

- Community platform.
- Portfolio platform.
- Media magazine.
- Award directory.
- Vertical archive.
- Independent case.

Initial mapping:

- Community platform: Pinterest, Dribbble, Designspiration.
- Portfolio platform: Behance.
- Media magazine: Fast Company Design, Designboom, Beautiful Life, It's Nice That, BLOG DECO DESIGN.
- Award directory: Awwwards.
- Vertical archive: Sgustok Design, Logo Design Love, Slideland, Godly.
- Independent case: Ukiby Non Editions.

Each site also has tags and use cases so users can search by intent, not only by type.

## Core Pages

### Homepage `/`

The homepage is the main work surface.

It contains:

- Top navigation with site name, type links, data links, and source link.
- Magazine cover area with title, short description, collection stats, and featured websites.
- Search input visible early on the page.
- Type segmented control.
- Multi-select tag chips.
- Screenshot-led website cards.
- Empty state with clear reset action when search and filters return no results.

Card behavior:

- The primary card action opens the external website in a new tab.
- The title or detail action opens the local detail page.

### Website Detail Page `/sites/[slug]`

Each website gets a local detail page.

It contains:

- Screenshot hero.
- Website name and canonical URL.
- Local summary and longer description.
- Website type.
- Tags.
- Use cases.
- Strengths.
- Agent notes.
- Source tweet reference.
- Last updated date.
- Same-type recommendations.
- JSON-LD describing the listed website.

### Type Page `/types/[type]`

Each type page lists all websites in that type and provides a short explanation of when that category is useful.

These pages improve public shareability and make the collection easier for search engines and agents to traverse.

### Data Endpoint `/data/sites.json`

Expose the full curated dataset as JSON.

This endpoint is a first-class product surface, not a debugging artifact. It should be stable enough for agents to read and for future MCP integration to reuse.

### LLM Guide `/llms.txt`

Provide an LLM-readable guide with:

- What the site is.
- Recommended human entry points.
- Recommended machine-readable entry points.
- Field definitions for `/data/sites.json`.
- Guidance for agents on how to use the dataset.
- Source attribution.

## Data Model

Maintain one source of truth in `src/data/sites.ts`.

Each site record should include:

```ts
type Site = {
  name: string;
  slug: string;
  url: string;
  type: SiteType;
  summary: string;
  description: string;
  tags: string[];
  useCases: string[];
  strengths: string[];
  screenshotPath: string;
  screenshotStatus: "pending" | "captured" | "failed";
  screenshotCapturedAt?: string;
  agentNotes: string;
  sourceTweetUrl: string;
  updatedAt: string;
};
```

Data model rules:

- `slug` must be unique.
- `url` must be canonical and externally openable.
- `type` must be one of the supported taxonomy values.
- `tags` should be useful to both humans and agents.
- `agentNotes` should explain how an AI agent should interpret or use the website.
- Screenshot fields should not be required for a successful site build.

## Initial Website List

- Pinterest: https://www.pinterest.com/
- Dribbble: https://dribbble.com/
- Behance: https://www.behance.net/
- Fast Company Design: https://www.fastcompany.com/co-design
- BLOG DECO DESIGN: https://blogdecodesign.fr/
- Designboom: https://www.designboom.com
- Beautiful Life: https://www.beautifullife.info/
- Sgustok Design: https://sgustokdesign.com/
- Awwwards: https://www.awwwards.com/
- It's Nice That: https://www.itsnicethat.com/
- Logo Design Love: https://www.logodesignlove.com/
- Slideland: https://www.slideland.tech/en
- Godly: http://godly.website
- Designspiration: https://www.designspiration.com/
- Ukiby Non Editions: https://ukibynoneditions.com/

## Interaction Design

Homepage interactions:

- Search matches name, type, tags, use cases, strengths, summary, and description.
- Type filter uses a segmented control.
- Tags use multi-select chips.
- Users can combine search, type, and tags.
- Reset action clears all filters.

Keyboard shortcuts:

- `/` focuses search.
- `Esc` clears search or exits the current focused filter state.
- `Tab` follows normal browser focus order.
- Arrow keys move focus between resource cards when the card grid is active.
- `Enter` opens the focused card's external website.
- `D` opens the focused card's detail page.

Accessibility requirements:

- Search input has a visible label or accessible label.
- Filter controls expose pressed or selected state.
- External-link buttons communicate that they open a new tab.
- Cards have stable focus styles.
- Screenshot images have descriptive alt text.

## Visual Direction

The visual direction is editorial and image-led.

Principles:

- The first viewport should immediately show the collection identity and at least part of the resource library.
- Screenshot images carry the visual weight.
- Typography should feel like a design magazine but remain readable and compact inside cards.
- Cards should use restrained radius and avoid nested-card layouts.
- The resource library should be scan-friendly for repeated use.

Avoid:

- A marketing-only landing page.
- Decorative visual noise that competes with website screenshots.
- A purely monochrome or one-hue palette.
- Oversized text inside compact tool controls.

## Screenshot Capture

Provide a script at `scripts/capture-screenshots.ts`.

The script should:

- Read sites from the structured data source or a generated JSON equivalent.
- Use Playwright to visit each site.
- Capture a consistent desktop screenshot.
- Save images to `public/screenshots/{slug}.png`.
- Produce or update screenshot status metadata.
- Report failures clearly.

Screenshot failures must not block the app from rendering. Missing screenshots should fall back to a polished placeholder visual.

## AI And Agent Friendliness

Agent-readable surfaces:

- Semantic HTML on all public pages.
- Stable attributes such as `data-site-slug` and `data-site-type` on cards or articles.
- `/data/sites.json` with complete site records.
- `/llms.txt` with usage guidance.
- JSON-LD on detail pages.

Agent guidance:

- Agents should prefer `/data/sites.json` for complete structured data.
- Agents should use detail pages for human-readable context.
- Agents should use external URLs only when they need current information from the original source.

## Error Handling

- Missing screenshot: render fallback visual and keep the card usable.
- Failed external site: keep local detail page available and preserve the URL.
- No search results: show a reset action and suggest clearing filters.
- Invalid site data: fail the build or tests, because data integrity is core to the product.
- Missing `/data/sites.json`: fail verification, because machine-readable access is a core requirement.

## Testing Strategy

Data tests:

- Every site has required fields.
- Slugs are unique.
- URLs are valid.
- Types match the allowed taxonomy.
- At least one tag and one use case exist for every site.

Page tests:

- Homepage builds.
- Every detail page builds.
- Every type page builds.
- `/data/sites.json` returns complete valid JSON.
- `/llms.txt` returns useful plain text.

Interaction tests:

- Search by name works.
- Search by tag works.
- Search by use case works.
- Type filtering works.
- Tag filtering works.
- Reset clears all filters.
- Keyboard shortcuts do not break normal form behavior.

Screenshot script tests:

- The script can generate at least one screenshot in a local run.
- Failures are reported without corrupting existing data.

## Open Decisions For Implementation Planning

- Exact Next.js version and project template.
- Whether to use Tailwind CSS or plain CSS modules.
- Whether screenshot status is stored in `sites.ts`, a generated manifest, or both.
- Exact visual palette and type scale.
- Whether to include a GitHub link before a remote repository exists.

