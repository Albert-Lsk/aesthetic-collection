import { describe, expect, it } from "vitest";
import { SITE_TYPES } from "./site-types";
import { sites } from "./sites";
import { getSiteBySlug, getSitesByType } from "./site-utils";

const sourceTweetUrl = "https://x.com/xiaoerzhan/status/2050427465714352451";
const siteTypeIds = new Set(SITE_TYPES.map((type) => type.id));
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("curated site data", () => {
  it("contains 15 sites", () => {
    expect(sites).toHaveLength(15);
  });

  it("uses unique slugs", () => {
    const slugs = sites.map((site) => site.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("fills required fields for every site", () => {
    for (const site of sites) {
      expect(site.name.length).toBeGreaterThan(1);
      expect(site.slug).toMatch(slugPattern);
      expect(() => new URL(site.url)).not.toThrow();
      expect(siteTypeIds.has(site.type)).toBe(true);
      expect(site.summary.length).toBeGreaterThan(12);
      expect(site.description.length).toBeGreaterThan(site.summary.length);
      expect(site.tags.length).toBeGreaterThan(0);
      expect(site.useCases.length).toBeGreaterThan(0);
      expect(site.strengths.length).toBeGreaterThan(0);
      expect(site.agentNotes.length).toBeGreaterThan(20);
      expect(site.sourceTweetUrl).toBe(sourceTweetUrl);
    }
  });

  it("finds Awwwards by slug", () => {
    expect(getSiteBySlug("awwwards")?.name).toBe("Awwwards");
  });

  it("returns community platforms in curated order", () => {
    expect(getSitesByType("community-platform").map((site) => site.slug)).toEqual([
      "pinterest",
      "dribbble",
      "designspiration",
    ]);
  });
});
