import Link from "next/link";
import type { Site } from "../data/site-types";
import { getTypeLabel } from "../data/site-utils";
import { ScreenshotFrame } from "./ScreenshotFrame";

type SiteCardProps = {
  site: Site;
  isFocused?: boolean;
};

export function SiteCard({ site, isFocused = false }: SiteCardProps) {
  const detailHref = `/sites/${site.slug}`;

  return (
    <article
      className="site-card"
      data-site-slug={site.slug}
      data-site-type={site.type}
      data-focused={isFocused ? "true" : "false"}
      data-testid={`site-card-${site.slug}`}
    >
      <Link className="site-card__image-link" href={detailHref} aria-label={`查看 ${site.name} 详情`}>
        <ScreenshotFrame site={site} imageClassName="site-card__image" />
      </Link>
      <div className="site-card__body">
        <div className="site-card__meta">
          <span className="site-card__type">{getTypeLabel(site.type)}</span>
        </div>
        <h3 className="site-card__title">
          <Link href={detailHref}>{site.name}</Link>
        </h3>
        <p className="site-card__summary">{site.summary}</p>
        <ul className="site-card__tags" aria-label={`${site.name} 标签`}>
          {site.tags.slice(0, 3).map((tag) => (
            <li className="site-card__tag" data-testid="site-tag" key={tag}>
              {tag}
            </li>
          ))}
        </ul>
        <div className="site-card__actions">
          <a
            className="site-card__external"
            href={site.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`打开 ${site.name} 网站，新窗口`}
          >
            打开网站
          </a>
          <Link className="site-card__detail" href={detailHref}>
            详情
          </Link>
        </div>
      </div>
    </article>
  );
}
