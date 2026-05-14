import { FeaturedSites } from "../components/FeaturedSites";
import { ResourceLibrary } from "../components/ResourceLibrary";
import { sites } from "../data/sites";

export default function HomePage() {
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

      <FeaturedSites sites={sites} />
      <ResourceLibrary sites={sites} />
    </main>
  );
}
