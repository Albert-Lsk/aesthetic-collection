import { describe, expect, it } from "vitest";
import { buildScreenshotPath, shouldCaptureSite } from "./capture-screenshots";

describe("capture screenshot helpers", () => {
  it("builds a screenshot output path from a slug", () => {
    expect(buildScreenshotPath("awwwards")).toBe("public/screenshots/awwwards.png");
  });

  it("captures pending and failed sites but skips captured sites", () => {
    expect(shouldCaptureSite({ screenshotStatus: "pending" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "failed" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "captured" })).toBe(false);
  });
});
