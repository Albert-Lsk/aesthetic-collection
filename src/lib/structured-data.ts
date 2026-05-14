import type { Site } from "../data/site-types";

export function buildSiteJsonLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    keywords: site.tags,
    about: site.useCases,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Aesthetic Collection",
    },
  };
}
