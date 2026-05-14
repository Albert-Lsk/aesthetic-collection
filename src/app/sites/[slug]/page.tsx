import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteCard } from "../../../components/SiteCard";
import { sites } from "../../../data/sites";
import { getSiteBySlug, getSitesByType, getTypeLabel } from "../../../data/site-utils";
import { buildSiteJsonLd, serializeJsonLd } from "../../../lib/structured-data";

type SiteDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return sites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: SiteDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSiteBySlug(slug);

  if (!site) {
    return {};
  }

  return {
    title: `${site.name} | Aesthetic Collection`,
    description: site.summary,
    openGraph: {
      title: `${site.name} | Aesthetic Collection`,
      description: site.summary,
      images: [site.screenshotPath],
    },
  };
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const { slug } = await params;
  const site = getSiteBySlug(slug);

  if (!site) {
    notFound();
  }

  const typeLabel = getTypeLabel(site.type);
  const relatedSites = getSitesByType(site.type)
    .filter((relatedSite) => relatedSite.slug !== site.slug)
    .slice(0, 3);
  const jsonLd = buildSiteJsonLd(site);

  return (
    <main className="page-shell detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <Link className="back-link" href="/">
        返回收藏册
      </Link>

      <article className="site-detail" data-site-slug={site.slug} data-site-type={site.type}>
        <div className="site-detail__hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- Screenshot paths are local data records and may be pending placeholders. */}
          <img className="site-detail__image" src={site.screenshotPath} alt={`${site.name} 网站截图`} />
        </div>

        <div className="site-detail__intro">
          <Link className="type-label" href={`/types/${site.type}`}>
            {typeLabel}
          </Link>
          <h1>{site.name}</h1>
          <p>{site.summary}</p>
          <a
            className="primary-action"
            href={site.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`打开 ${site.name} 网站，新窗口`}
          >
            打开网站
          </a>
        </div>

        <section className="detail-section" aria-labelledby="why-title">
          <h2 id="why-title">为什么值得收藏</h2>
          <p>{site.description}</p>
          <ul className="pill-list" aria-label={`${site.name} 优势`}>
            {site.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section" aria-labelledby="use-cases-title">
          <h2 id="use-cases-title">适合用途</h2>
          <ul className="detail-list">
            {site.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </section>

        <section className="detail-section" aria-labelledby="agent-notes-title">
          <h2 id="agent-notes-title">Agent notes</h2>
          <p>{site.agentNotes}</p>
        </section>
      </article>

      {relatedSites.length > 0 ? (
        <section className="related-sites" aria-labelledby="related-sites-title">
          <div className="section-heading">
            <p className="section-kicker">Related</p>
            <h2 id="related-sites-title">同类型推荐</h2>
          </div>
          <div className="featured-sites__grid">
            {relatedSites.map((relatedSite) => (
              <SiteCard key={relatedSite.slug} site={relatedSite} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
