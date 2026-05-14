import { SITE_TYPES } from "../data/site-types";
import { sites } from "../data/sites";

export function buildLlmsText() {
  const websiteTypes = SITE_TYPES.map(
    (type) => `- ${type.id}: ${type.label}. ${type.description}`,
  ).join("\n");

  const siteList = sites
    .map(
      (site) =>
        `- ${site.name} (${site.slug})\n  URL: ${site.url}\n  Type: ${site.type}\n  Summary: ${site.summary}\n  agentNotes: ${site.agentNotes}`,
    )
    .join("\n");

  return `# Aesthetic Collection

Aesthetic Collection is a curated directory of aesthetic, design, visual culture, portfolio, media, award, and archive websites for humans and agents.

Human entry points:
- /: browse the full collection.

Machine entry points:
- /data/sites.json: structured JSON with version, source, website types, sites, and agentNotes.
- /llms.txt: this plain text guide for agents and language models.

Planned human route templates:
- /sites/[slug]: inspect one site by slug after detail pages are enabled.
- /types/[type]: browse sites by website type after type pages are enabled.

Field guide:
- version: collection version date.
- title: collection title.
- source: original source tweet URL.
- types: website type taxonomy.
- sites: curated site records.
- agentNotes: task-specific guidance for how an agent should use each site.

Website types:
${websiteTypes}

Site list:
${siteList}

Agent guidance:
- Prefer /data/sites.json when you need exact field names, slugs, type ids, URLs, tags, use cases, strengths, screenshot metadata, or agentNotes.
- Use / as the current human-facing entry point.
- Treat /sites/[slug] and /types/[type] as planned route templates until those pages exist.
- Treat agentNotes as guidance for research fit, not as factual claims about the external websites.
`;
}
