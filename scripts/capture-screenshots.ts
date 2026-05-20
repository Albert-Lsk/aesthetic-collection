import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium, type Page } from "playwright";
import { sites } from "../src/data/sites";

type ScreenshotStatus = "pending" | "captured" | "failed";
type ScreenshotSite = {
  name: string;
  slug: string;
  url: string;
  screenshotStatus: ScreenshotStatus;
};
type NavigationWaitUntil = "load" | "domcontentloaded" | "networkidle" | "commit";

const scriptFilePath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptFilePath), "..");
const screenshotDir = path.join(repoRoot, "public", "screenshots");
const manifestPath = path.join(screenshotDir, "manifest.json");
const pageStabilizationDelay = 3500;
const siteStabilizationDelays: Record<string, number> = {
  pinterest: 10000,
};
const fallbackPosterSlugs = new Set(["fast-company-design"]);

export function getScreenshotDir(): string {
  return screenshotDir;
}

export function getManifestPath(): string {
  return manifestPath;
}

export function buildScreenshotPath(slug: string): string {
  return path.join("public", "screenshots", `${slug}.png`);
}

export function getNavigationWaitUntil(): NavigationWaitUntil {
  return "commit";
}

export function getPageStabilizationDelay(site?: { slug: string }): number {
  if (!site) {
    return pageStabilizationDelay;
  }

  return siteStabilizationDelays[site.slug] ?? pageStabilizationDelay;
}

function toAbsoluteOutputPath(slug: string) {
  return path.join(repoRoot, buildScreenshotPath(slug));
}

export function shouldCaptureSite(site: { screenshotStatus: ScreenshotStatus }): boolean {
  return site.screenshotStatus !== "captured";
}

export function shouldRenderFallbackPoster(site: { slug: string }): boolean {
  return fallbackPosterSlugs.has(site.slug);
}

export function shouldRecordCaptureFailure({
  hasExistingScreenshot,
}: {
  hasExistingScreenshot: boolean;
}): boolean {
  return !hasExistingScreenshot;
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return character;
    }
  });
}

async function renderFallbackPoster(page: Page, site: ScreenshotSite, outputPath: string) {
  await page.setContent(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              width: 1440px;
              height: 1000px;
              overflow: hidden;
              background:
                linear-gradient(rgb(17 17 17 / 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgb(17 17 17 / 0.05) 1px, transparent 1px),
                #fff5e1;
              background-size: 40px 40px;
              color: #111;
              font-family: Futura, "Avenir Next", Arial, sans-serif;
            }
            main {
              display: grid;
              grid-template-columns: 1fr 360px;
              gap: 28px;
              width: 100%;
              height: 100%;
              padding: 70px;
            }
            .poster {
              display: grid;
              align-content: space-between;
              border: 5px solid #111;
              padding: 54px;
              background:
                linear-gradient(135deg, rgb(244 182 194 / 0.88), rgb(255 245 225 / 0.94)),
                repeating-linear-gradient(45deg, rgb(17 17 17 / 0.12) 0 3px, transparent 3px 26px);
              box-shadow: 16px 16px 0 #111;
            }
            .eyebrow,
            .badge {
              display: inline-flex;
              width: max-content;
              border: 4px solid #111;
              padding: 12px 16px;
              background: #f2c94c;
              font-size: 28px;
              font-weight: 900;
              line-height: 1;
              text-transform: uppercase;
            }
            h1 {
              max-width: 720px;
              margin: 0;
              font-size: 124px;
              font-weight: 950;
              line-height: 0.9;
              text-decoration: underline;
              text-decoration-thickness: 8px;
              text-underline-offset: 12px;
            }
            .summary {
              max-width: 760px;
              margin: 0;
              font-size: 36px;
              font-weight: 800;
              line-height: 1.25;
            }
            aside {
              display: grid;
              gap: 18px;
              align-content: end;
            }
            .panel {
              border: 4px solid #111;
              padding: 28px;
              background: #a8d5ba;
              box-shadow: 10px 10px 0 #111;
            }
            .panel strong {
              display: block;
              margin-bottom: 10px;
              font-size: 32px;
              line-height: 1;
            }
            .panel span {
              display: block;
              font-size: 22px;
              font-weight: 800;
              line-height: 1.35;
            }
          </style>
        </head>
        <body>
          <main>
            <section class="poster">
              <span class="eyebrow">Media Magazine</span>
              <h1>${escapeHtml(site.name)}</h1>
              <p class="summary">Editorial design, business culture, innovation and visual trend references.</p>
            </section>
            <aside>
              <span class="badge">Local Preview</span>
              <div class="panel">
                <strong>Capture Note</strong>
                <span>The source site restricts automated screenshots. This fallback keeps the card visual while the external link remains unchanged.</span>
              </div>
            </aside>
          </main>
        </body>
      </html>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: outputPath, fullPage: false });
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
        if (shouldRenderFallbackPoster(site)) {
          await renderFallbackPoster(page, site, outputPath);
          console.log(`Rendered fallback ${site.name}: ${buildScreenshotPath(site.slug)}`);
          continue;
        }

        await page.goto(site.url, { waitUntil: getNavigationWaitUntil(), timeout: 30000 });
        await page.waitForTimeout(getPageStabilizationDelay(site));
        await page.screenshot({ path: outputPath, fullPage: false });
        console.log(`Captured ${site.name}: ${buildScreenshotPath(site.slug)}`);
      } catch (error) {
        const message = error instanceof Error ? error.message.replace(/\u001b\[[0-9;]*m/g, "") : String(error);
        const hasExistingScreenshot = await fileExists(outputPath);

        if (shouldRecordCaptureFailure({ hasExistingScreenshot })) {
          failures.push({ slug: site.slug, url: site.url, error: message });
          console.error(`Failed ${site.name}: ${message}`);
        } else {
          console.warn(`Kept ${site.name}: existing screenshot retained after capture failure.`);
        }
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
