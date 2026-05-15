import fs from "fs/promises";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET } from "./route";

const originalCwd = process.cwd();

describe("GET /data/sites.json", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "sites-route-test-"));
    await fs.mkdir(path.join(tempDir, "public", "screenshots"), { recursive: true });
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("returns JSON site data with cache headers", async () => {
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

    const response = GET();
    const payload = await response.json();
    const pinterest = payload.sites.find((site: { slug: string }) => site.slug === "pinterest");
    const awwwards = payload.sites.find((site: { slug: string }) => site.slug === "awwwards");
    const blogDecoDesign = payload.sites.find((site: { slug: string }) => site.slug === "blog-deco-design");

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(payload.sites).toHaveLength(15);
    expect(pinterest.screenshotStatus).toBe("captured");
    expect(awwwards.screenshotStatus).toBe("failed");
    expect(blogDecoDesign.screenshotStatus).toBe("failed");
  });
});
