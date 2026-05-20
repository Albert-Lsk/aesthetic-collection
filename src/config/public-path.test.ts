import { afterEach, describe, expect, it } from "vitest";
import { resolvePublicPath } from "./public-path";

const originalGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES;

describe("resolvePublicPath", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = originalGitHubPages;
  });

  it("keeps public paths rooted locally by default", () => {
    delete process.env.NEXT_PUBLIC_GITHUB_PAGES;

    expect(resolvePublicPath("/screenshots/pinterest.png")).toBe("/screenshots/pinterest.png");
  });

  it("prefixes public paths for GitHub Pages builds", () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = "true";

    expect(resolvePublicPath("/screenshots/pinterest.png")).toBe(
      "/aesthetic-collection/screenshots/pinterest.png",
    );
  });

  it("does not alter external or relative paths", () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = "true";

    expect(resolvePublicPath("https://example.com/image.png")).toBe("https://example.com/image.png");
    expect(resolvePublicPath("screenshots/pinterest.png")).toBe("screenshots/pinterest.png");
  });
});
