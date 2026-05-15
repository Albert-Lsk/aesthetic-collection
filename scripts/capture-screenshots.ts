import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import { sites } from "../src/data/sites";

type ScreenshotStatus = "pending" | "captured" | "failed";
type ScreenshotSite = {
  name: string;
  slug: string;
  url: string;
  screenshotStatus: ScreenshotStatus;
};

const scriptFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptFilePath), "..");
const screenshotDir = path.join(repoRoot, "public", "screenshots");
const manifestPath = path.join(screenshotDir, "manifest.json");

export function getScreenshotDir(): string {
  return screenshotDir;
}

export function getManifestPath(): string {
  return manifestPath;
}

export function buildScreenshotPath(slug: string): string {
  return path.join("public", "screenshots", `${slug}.png`);
}

function toAbsoluteOutputPath(slug: string) {
  return path.join(repoRoot, buildScreenshotPath(slug));
}

export function shouldCaptureSite(site: { screenshotStatus: ScreenshotStatus }): boolean {
  return site.screenshotStatus !== "captured";
}

export async function captureScreenshots(): Promise<void> {
  await fs.mkdir(screenshotDir, { recursive: true });

  const failures: Array<{ slug: string; url: string; error: string }> = [];
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });

    for (const site of sites.filter(shouldCaptureSite) as ScreenshotSite[]) {
      const outputPath = toAbsoluteOutputPath(site.slug);

      try {
        await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: outputPath, fullPage: false });
        console.log(`Captured ${site.name}: ${buildScreenshotPath(site.slug)}`);
      } catch (error) {
        const message = error instanceof Error ? error.message.replace(/\u001b\[[0-9;]*m/g, "") : String(error);
        failures.push({ slug: site.slug, url: site.url, error: message });
        console.error(`Failed ${site.name}: ${message}`);
      }
    }
  } finally {
    await browser.close();
  }

  await fs.writeFile(
    manifestPath,
    `${JSON.stringify({ capturedAt: new Date().toISOString(), failures }, null, 2)}\n`,
  );

  if (failures.length > 0) {
    console.error(`Screenshot capture completed with ${failures.length} failure(s).`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptFilePath) {
  captureScreenshots().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
