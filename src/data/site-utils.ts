import { SITE_TYPES, type SiteType } from "./site-types";
import { sites } from "./sites";

export function getSiteBySlug(slug: string) {
  return sites.find((site) => site.slug === slug);
}

export function getSitesByType(type: SiteType) {
  return sites.filter((site) => site.type === type);
}

export function getTypeLabel(type: SiteType) {
  return SITE_TYPES.find((siteType) => siteType.id === type)?.label ?? type;
}

export function getTypeDescription(type: SiteType) {
  return SITE_TYPES.find((siteType) => siteType.id === type)?.description ?? "";
}

export function getAllTags() {
  return Array.from(new Set(sites.flatMap((site) => site.tags))).sort((first, second) =>
    first.localeCompare(second, "zh-Hans-CN"),
  );
}
