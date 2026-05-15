import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SITE_TYPES } from "../data/site-types";
import { buildSitesJson } from "./site-json";

const sourceTweetUrl = "https://x.com/xiaoerzhan/status/2050427465714352451";
const originalCwd = process.cwd();

describe("buildSitesJson", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "site-json-test-"));
    await fs.mkdir(path.join(tempDir, "public", "screenshots"), { recursive: true });
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

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

  it("enriches site screenshot metadata from manifest and existing png files", async () => {
    await fs.writeFile(path.join(tempDir, "public", "screenshots", "pinterest.png"), "png");
    await fs.writeFile(path.join(tempDir, "public", "screenshots", "blog-deco-design.png"), "png");
    await fs.writeFile(
      path.join(tempDir, "public", "screenshots", "manifest.json"),
      `${JSON.stringify(
        {
          capturedAt: "2026-05-15T08:00:00.000Z",
          failures: [
            { slug: "awwwards", url: "https://www.awwwards.com/", error: "Timeout" },
            { slug: "blog-deco-design", url: "https://blogdecodesign.fr/", error: "Timeout" },
          ],
        },
        null,
        2,
      )}\n`,
    );

    const payload = buildSitesJson();
    const pinterest = payload.sites.find((site) => site.slug === "pinterest");
    const awwwards = payload.sites.find((site) => site.slug === "awwwards");
    const blogDecoDesign = payload.sites.find((site) => site.slug === "blog-deco-design");
    const behance = payload.sites.find((site) => site.slug === "behance");

    expect(pinterest?.screenshotStatus).toBe("captured");
    expect(pinterest?.screenshotCapturedAt).toBe("2026-05-15T08:00:00.000Z");
    expect(awwwards?.screenshotStatus).toBe("failed");
    expect(awwwards?.screenshotCapturedAt).toBeUndefined();
    expect(blogDecoDesign?.screenshotStatus).toBe("failed");
    expect(blogDecoDesign?.screenshotCapturedAt).toBeUndefined();
    expect(behance?.screenshotStatus).toBe("pending");
    expect(behance?.screenshotCapturedAt).toBeUndefined();
  });
});
