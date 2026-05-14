import { describe, expect, it } from "vitest";
import { sites } from "../data/sites";
import { buildSiteJsonLd, serializeJsonLd } from "./structured-data";

describe("buildSiteJsonLd", () => {
  it("builds WebSite JSON-LD for a curated site", () => {
    const jsonLd = buildSiteJsonLd(sites[0]);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.name).toBe("Pinterest");
    expect(jsonLd.url).toBe("https://www.pinterest.com/");
    expect(jsonLd.keywords).toContain("灵感板");
    expect(jsonLd.description).toBe(sites[0].description);
  });

  it("serializes JSON-LD safely for script injection", () => {
    expect(serializeJsonLd({ value: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
