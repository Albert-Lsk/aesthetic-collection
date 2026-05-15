import { FeaturedSites } from "../components/FeaturedSites";
import { ResourceLibrary } from "../components/ResourceLibrary";
import { SITE_TYPES } from "../data/site-types";
import { getAllTags } from "../data/site-utils";
import { getSitesWithScreenshotMetadata } from "../lib/screenshot-metadata";

export default function HomePage() {
  const sites = getSitesWithScreenshotMetadata();
  const stats = [
    { label: "Sites", value: sites.length },
    { label: "Types", value: SITE_TYPES.length },
    { label: "Tags", value: getAllTags().length },
  ];

  return (
    <main className="page-shell">
      <nav className="site-nav" aria-label="主页导航">
        <a href="#featured-sites-title">精选</a>
        <a href="#resource-library-title">资源库</a>
      </nav>

      <section className="cover-section" aria-labelledby="home-title">
        <div className="cover-section__content">
          <p className="cover-section__kicker">Aesthetic Collection</p>
          <h1 id="home-title">审美网站收藏册</h1>
          <p>
            为设计、内容和产品工作整理的灵感入口。按类型、标签和关键词快速筛选，找到适合当前任务的参考源。
          </p>
        </div>
      </section>

      <section className="collection-stats" aria-label="收藏统计">
        {stats.map((stat) => (
          <div className="collection-stats__item" key={stat.label}>
            <span className="collection-stats__value">{stat.value}</span>
            <span className="collection-stats__label">{stat.label}</span>
          </div>
        ))}
      </section>

      <FeaturedSites sites={sites} />
      <ResourceLibrary sites={sites} />
    </main>
  );
}
