import fs from "fs";
import path from "path";
import type { Site } from "../data/site-types";
import { sites } from "../data/sites";

type ScreenshotManifestFailure = {
  slug: string;
  url: string;
  error: string;
};

type ScreenshotManifest = {
  capturedAt?: string;
  failures?: ScreenshotManifestFailure[];
};

function getScreenshotsDirectory() {
  return path.join(process.cwd(), "public", "screenshots");
}

function readScreenshotManifest(): ScreenshotManifest {
  const manifestPath = path.join(getScreenshotsDirectory(), "manifest.json");

  if (!fs.existsSync(manifestPath)) {
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as ScreenshotManifest;
  } catch {
    return {};
  }
}

function hasScreenshotFile(slug: string) {
  return fs.existsSync(path.join(getScreenshotsDirectory(), `${slug}.png`));
}

export function getSitesWithScreenshotMetadata(): Site[] {
  const manifest = readScreenshotManifest();
  const failedSlugs = new Set((manifest.failures ?? []).map((failure) => failure.slug));

  return sites.map((site) => {
    if (failedSlugs.has(site.slug)) {
      return {
        ...site,
        screenshotStatus: "failed" as const,
        screenshotCapturedAt: undefined,
      };
    }

    if (hasScreenshotFile(site.slug)) {
      return {
        ...site,
        screenshotStatus: "captured" as const,
        screenshotCapturedAt: manifest.capturedAt,
      };
    }

    return {
      ...site,
      screenshotStatus: "pending" as const,
      screenshotCapturedAt: undefined,
    };
  });
}
