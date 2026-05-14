import type { Site } from "../data/site-types";
import { SiteCard } from "./SiteCard";

type FeaturedSitesProps = {
  sites: readonly Site[];
};

const featuredSlugs = ["awwwards", "designspiration", "slideland"] as const;

export function FeaturedSites({ sites }: FeaturedSitesProps) {
  const featuredSites = featuredSlugs
    .map((slug) => sites.find((site) => site.slug === slug))
    .filter((site): site is Site => Boolean(site));

  return (
    <section className="featured-sites" aria-labelledby="featured-sites-title">
      <div className="section-heading">
        <p className="section-kicker">Featured</p>
        <h2 id="featured-sites-title">精选入口</h2>
      </div>
      <div className="featured-sites__grid">
        {featuredSites.map((site) => (
          <SiteCard key={site.slug} site={site} />
        ))}
      </div>
    </section>
  );
}
