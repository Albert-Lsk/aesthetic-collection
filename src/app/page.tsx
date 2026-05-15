import Link from "next/link";
import { FeaturedSites } from "../components/FeaturedSites";
import { ResourceLibrary } from "../components/ResourceLibrary";
import { SITE_TYPES } from "../data/site-types";
import { getAllTags } from "../data/site-utils";
import { getSitesWithScreenshotMetadata } from "../lib/screenshot-metadata";

const actionRail = [
  {
    label: "Search by task",
    description: "输入网站名、用途或标签，按 / 可直接聚焦搜索。",
  },
  {
    label: "Filter by type",
    description: "不知道搜什么时，先从社区、作品集、媒体或资料库进入。",
  },
  {
    label: "Open site",
    description: "卡片主按钮直达外站，适合高频导航。",
  },
  {
    label: "Read detail",
    description: "详情页保留用途、标签和 Agent 可读说明。",
  },
] as const;

export default function HomePage() {
  const sites = getSitesWithScreenshotMetadata();
  const sourceTweetUrl = sites[0]?.sourceTweetUrl ?? "https://x.com/xiaoerzhan/status/2050427465714352451";
  const stats = [
    { label: "Sites", value: sites.length },
    { label: "Types", value: SITE_TYPES.length },
    { label: "Tags", value: getAllTags().length },
  ];

  return (
    <main className="page-shell">
      <nav className="site-nav" aria-label="主页导航">
        <Link href="/">Aesthetic Collection</Link>
        {SITE_TYPES.map((siteType) => (
          <Link href={`/types/${siteType.id}`} key={siteType.id}>
            {siteType.label}
          </Link>
        ))}
        <Link href="/data/sites.json">/data/sites.json</Link>
        <Link href="/llms.txt">/llms.txt</Link>
        <a href={sourceTweetUrl} target="_blank" rel="noreferrer">
          来源推文
        </a>
      </nav>

      <section className="cover-section" aria-labelledby="home-title">
        <div className="cover-section__content">
          <p className="cover-section__kicker">Aesthetic Collection / Issue 01</p>
          <h1 id="home-title" aria-label="找一个审美参考入口">
            <span>找一个</span>
            <span>审美参考入口</span>
          </h1>
          <p>
            这是给人和 Agent 共用的审美资源索引：前端负责快速查找和打开网站，背后保留结构化数据、详情页和可扩展的机器可读出口。
          </p>
          <div className="cover-section__actions" aria-label="首页主要操作">
            <a className="cover-action cover-action--primary" href="#site-search">
              开始搜索
            </a>
            <a className="cover-action" href="#type-index">
              浏览分类
            </a>
          </div>
        </div>

        <aside className="cover-task-panel" aria-label="行动入口">
          <p className="cover-task-panel__eyebrow">第一步：搜索或选择分类</p>
          <a className="cover-search-link" href="#site-search">
            <span>搜索网站</span>
            <strong>输入任务、网站名、标签或用途</strong>
            <small>快捷键 /</small>
          </a>
          <ol className="action-rail" aria-label="使用流程">
            {actionRail.map((item, index) => (
              <li className="action-rail__item" key={item.label}>
                <span className="action-rail__index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section id="type-index" className="type-entry-strip" aria-labelledby="type-entry-title">
        <div className="type-entry-strip__heading">
          <p className="section-kicker">Browse By Type</p>
          <h2 id="type-entry-title">不知道搜什么，先选一个类型</h2>
        </div>
        <div className="type-entry-strip__grid">
          {SITE_TYPES.map((siteType) => (
            <Link
              className="type-entry"
              href={`/types/${siteType.id}`}
              aria-label={`查看${siteType.label}分类`}
              key={siteType.id}
            >
              <span>{siteType.label}</span>
              <small>{siteType.description}</small>
            </Link>
          ))}
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
