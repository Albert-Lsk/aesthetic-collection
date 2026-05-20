import path from "path";
import { describe, expect, it } from "vitest";
import {
  buildScreenshotPath,
  getNavigationWaitUntil,
  getManifestPath,
  getScreenshotDir,
  getPageStabilizationDelay,
  shouldRenderFallbackPoster,
  shouldRecordCaptureFailure,
  shouldCaptureSite,
} from "./capture-screenshots";

describe("capture screenshot helpers", () => {
  it("builds a screenshot output path from a slug", () => {
    expect(buildScreenshotPath("awwwards")).toBe("public/screenshots/awwwards.png");
  });

  it("captures pending and failed sites but skips captured sites", () => {
    expect(shouldCaptureSite({ screenshotStatus: "pending" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "failed" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "captured" })).toBe(false);
  });

  it("resolves screenshot and manifest directories from the repo root", () => {
    expect(getScreenshotDir()).toBe(path.join(process.cwd(), "public", "screenshots"));
    expect(getManifestPath()).toBe(path.join(process.cwd(), "public", "screenshots", "manifest.json"));
  });

  it("uses a resilient navigation strategy for screenshot captures", () => {
    expect(getNavigationWaitUntil()).toBe("commit");
    expect(getPageStabilizationDelay()).toBeGreaterThanOrEqual(3000);
    expect(getPageStabilizationDelay({ slug: "pinterest" })).toBeGreaterThanOrEqual(9000);
  });

  it("keeps an existing screenshot if a later recapture fails", () => {
    expect(shouldRecordCaptureFailure({ hasExistingScreenshot: true })).toBe(false);
    expect(shouldRecordCaptureFailure({ hasExistingScreenshot: false })).toBe(true);
  });

  it("uses a local fallback poster for automation-restricted sites", () => {
    expect(shouldRenderFallbackPoster({ slug: "fast-company-design" })).toBe(true);
    expect(shouldRenderFallbackPoster({ slug: "pinterest" })).toBe(false);
  });
});
