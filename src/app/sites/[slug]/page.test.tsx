import fs from "fs/promises";
import os from "os";
import path from "path";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SiteDetailPage from "./page";

const originalCwd = process.cwd();

describe("SiteDetailPage", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "site-detail-page-test-"));
    await fs.mkdir(path.join(tempDir, "public", "screenshots"), { recursive: true });
    await fs.writeFile(
      path.join(tempDir, "public", "screenshots", "manifest.json"),
      `${JSON.stringify(
        {
          capturedAt: "2026-05-15T08:00:00.000Z",
          failures: [{ slug: "awwwards", url: "https://www.awwwards.com/", error: "Timeout" }],
        },
        null,
        2,
      )}\n`,
    );
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("renders a screenshot placeholder when a site's capture failed", async () => {
    const page = await SiteDetailPage({
      params: Promise.resolve({ slug: "awwwards" }),
    });

    render(page);

    expect(screen.getByText("截图暂不可用")).toBeInTheDocument();
    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
  });
});
