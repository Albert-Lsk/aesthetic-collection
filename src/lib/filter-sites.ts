import type { Site, SiteType } from "../data/site-types";

export type SiteFilter = {
  query: string;
  type: SiteType | "all";
  tags: string[];
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getSearchableText(site: Site) {
  return normalize(
    [
      site.name,
      site.slug,
      site.type,
      site.summary,
      site.description,
      ...site.tags,
      ...site.useCases,
      ...site.strengths,
      site.agentNotes,
    ].join(" "),
  );
}

export function filterSites(sites: readonly Site[], filter: SiteFilter) {
  const query = normalize(filter.query);
  const selectedTags = filter.tags.map(normalize);

  return sites.filter((site) => {
    const matchesType = filter.type === "all" || site.type === filter.type;
    const siteTags = site.tags.map(normalize);
    const matchesTags = selectedTags.every((tag) => siteTags.includes(tag));
    const matchesQuery = query === "" || getSearchableText(site).includes(query);

    return matchesType && matchesTags && matchesQuery;
  });
}
