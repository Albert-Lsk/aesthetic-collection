import { SITE_TYPES } from "../data/site-types";
import { sites } from "../data/sites";

const version = "2026-05-14";
const title = "Aesthetic Collection";
const source = "https://x.com/xiaoerzhan/status/2050427465714352451";

export function buildSitesJson() {
  return {
    version,
    title,
    source,
    types: SITE_TYPES,
    sites,
  };
}
