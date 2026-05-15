"use client";

import { useState } from "react";
import type { Site } from "../data/site-types";

type ScreenshotFrameProps = {
  site: Site;
  className?: string;
  imageClassName?: string;
};

function ScreenshotPlaceholder({ site }: { site: Site }) {
  const statusLabel =
    site.screenshotStatus === "failed"
      ? "抓取失败"
      : site.screenshotStatus === "pending"
        ? "等待截图"
        : "加载失败";

  return (
    <div
      className="screenshot-placeholder"
      data-screenshot-status={site.screenshotStatus}
      role="img"
      aria-label={`${site.name} 网站截图暂不可用`}
    >
      <div className="screenshot-placeholder__badge">{statusLabel}</div>
      <div className="screenshot-placeholder__body">
        <strong>{site.name}</strong>
        <p>截图暂不可用</p>
        <span>仍可查看详情与访问原站</span>
      </div>
    </div>
  );
}

export function ScreenshotFrame({ site, className, imageClassName }: ScreenshotFrameProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowPlaceholder =
    site.screenshotStatus !== "captured" || hasImageError;

  return (
    <div className={className}>
      {shouldShowPlaceholder ? (
        <ScreenshotPlaceholder site={site} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- Screenshot paths are local data records and can fail at runtime, so this keeps a client-side fallback.
        <img
          className={imageClassName}
          src={site.screenshotPath}
          alt={`${site.name} 网站截图`}
          onError={() => setHasImageError(true)}
        />
      )}
    </div>
  );
}
