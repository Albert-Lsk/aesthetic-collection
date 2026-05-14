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
- /sites/[slug]: inspect one site by slug.
- /types/[type]: browse sites by website type.

Machine entry points:
- /data/sites.json: structured JSON with version, source, website types, sites, and agentNotes.
- /llms.txt: this plain text guide for agents and language models.

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
- Use /, /sites/[slug], and /types/[type] as current human-facing entry points.
- Treat agentNotes as guidance for research fit, not as factual claims about the external websites.
`;
}
