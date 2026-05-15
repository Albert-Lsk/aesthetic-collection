import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteCard } from "../../../components/SiteCard";
import { SITE_TYPES, type SiteType } from "../../../data/site-types";
import { getSitesWithScreenshotMetadata } from "../../../lib/screenshot-metadata";

type TypePageProps = {
  params: Promise<{
    type: string;
  }>;
};

function getSiteType(type: string) {
  return SITE_TYPES.find((siteType) => siteType.id === type);
}

export function generateStaticParams() {
  return SITE_TYPES.map((siteType) => ({ type: siteType.id }));
}

export default async function TypePage({ params }: TypePageProps) {
  const { type } = await params;
  const siteType = getSiteType(type);

  if (!siteType) {
    notFound();
  }

  const typedSites = getSitesWithScreenshotMetadata().filter((site) => site.type === (siteType.id as SiteType));

  return (
    <main className="page-shell type-page">
      <Link className="back-link" href="/">
        返回收藏册
      </Link>

      <header className="type-page__header">
        <p className="section-kicker">Website type</p>
        <h1>{siteType.label}</h1>
        <p>{siteType.description}</p>
      </header>

      <section className="type-page__sites" aria-label={`${siteType.label} 网站`}>
        <div className="site-grid">
          {typedSites.map((site) => (
            <SiteCard key={site.slug} site={site} />
          ))}
        </div>
      </section>
    </main>
  );
}
