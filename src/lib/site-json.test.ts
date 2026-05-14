import { describe, expect, it } from "vitest";
import { SITE_TYPES } from "../data/site-types";
import { buildSitesJson } from "./site-json";

const sourceTweetUrl = "https://x.com/xiaoerzhan/status/2050427465714352451";

describe("buildSitesJson", () => {
  it("builds agent-readable site data", () => {
    const payload = buildSitesJson();

    expect(payload.version).toBe("2026-05-14");
    expect(payload.title).toBe("Aesthetic Collection");
    expect(payload.source).toBe(sourceTweetUrl);
    expect(payload.types).toBe(SITE_TYPES);
    expect(payload.sites).toHaveLength(15);

    for (const site of payload.sites) {
      expect(site.sourceTweetUrl).toBe(sourceTweetUrl);
      expect(site.agentNotes.length).toBeGreaterThan(0);
    }
  });
});
