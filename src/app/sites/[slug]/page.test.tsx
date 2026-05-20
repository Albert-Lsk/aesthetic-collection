import fs from "fs/promises";
import os from "os";
import path from "path";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import SiteDetailPage, { generateMetadata } from "./page";

const originalCwd = process.cwd();
const originalGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES;

describe("SiteDetailPage", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "site-detail-page-test-"));
    await fs.mkdir(path.join(tempDir, "public", "screenshots"), { recursive: true });
    await fs.writeFile(path.join(tempDir, "public", "screenshots", "pinterest.png"), "");
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
    process.env.NEXT_PUBLIC_GITHUB_PAGES = originalGitHubPages;
  });

  it("renders a screenshot placeholder when a site's capture failed", async () => {
    const page = await SiteDetailPage({
      params: Promise.resolve({ slug: "awwwards" }),
    });

    render(page);

    expect(screen.getByRole("link", { name: "https://www.awwwards.com/" })).toHaveAttribute(
      "href",
      "https://www.awwwards.com/",
    );
    expect(screen.getByText("网页设计")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "来源推文" })).toHaveAttribute(
      "href",
      "https://x.com/xiaoerzhan/status/2050427465714352451",
    );
    expect(screen.getByText("2026-05-14")).toBeInTheDocument();
    expect(screen.getByText("截图暂不可用")).toBeInTheDocument();
    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
  });

  it("omits open graph images when the screenshot capture failed", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "awwwards" }),
    });

    expect(metadata.openGraph?.images).toBeUndefined();
  });

  it("keeps open graph images for a captured screenshot", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "pinterest" }),
    });

    expect(metadata.openGraph?.images).toEqual(["/screenshots/pinterest.png"]);
  });

  it("prefixes open graph images for GitHub Pages builds", async () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = "true";

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "pinterest" }),
    });

    expect(metadata.openGraph?.images).toEqual(["/aesthetic-collection/screenshots/pinterest.png"]);
  });
});
