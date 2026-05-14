import { describe, expect, it } from "vitest";
import { sites } from "../data/sites";
import { filterSites } from "./filter-sites";

describe("filterSites", () => {
  it("searches by name", () => {
    const result = filterSites(sites, { query: "awwwards", type: "all", tags: [] });

    expect(result.map((site) => site.slug)).toEqual(["awwwards"]);
  });

  it("searches by use case and tag in Chinese", () => {
    const result = filterSites(sites, { query: "日本", type: "all", tags: [] });

    expect(result.map((site) => site.slug)).toContain("slideland");
  });

  it("filters by type", () => {
    const result = filterSites(sites, { query: "", type: "award-directory", tags: [] });

    expect(result.map((site) => site.slug)).toEqual(["awwwards"]);
  });

  it("requires every selected tag to match", () => {
    const result = filterSites(sites, { query: "", type: "all", tags: ["网页设计", "动效"] });

    expect(result.map((site) => site.slug)).toEqual(["awwwards"]);
  });
});
