import path from "path";
import { describe, expect, it } from "vitest";
import {
  buildScreenshotPath,
  getManifestPath,
  getScreenshotDir,
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
});
