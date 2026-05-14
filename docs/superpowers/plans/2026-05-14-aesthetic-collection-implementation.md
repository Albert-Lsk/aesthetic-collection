# Aesthetic Collection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js content site that works as an aesthetic website navigation page for humans and a structured design-resource dataset for AI agents.

**Architecture:** Use Next.js App Router with one typed data source in `src/data/sites.ts`. Generate human pages, `/data/sites.json`, `/llms.txt`, and JSON-LD from that data source. Keep filtering logic in pure functions and UI state in one client resource-library component.

**Tech Stack:** Next.js App Router, TypeScript, React, Vitest, React Testing Library, Playwright, CSS Modules/global CSS, npm scripts.

---

## Scope Check

The design spec covers one cohesive product: a curated content site with data endpoints and a screenshot utility. The screenshot utility is separate from rendering, but it supports the same dataset and can be implemented in the same plan because it is small, independently testable, and not a separate product.

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `tsconfig.json`: strict TypeScript config with `@/*` alias.
- Create `next.config.ts`: Next config and image remote allowances.
- Create `vitest.config.ts`: unit and component test config.
- Create `src/app/layout.tsx`: root metadata and shell.
- Create `src/app/page.tsx`: homepage composition.
- Create `src/app/globals.css`: global visual system.
- Create `src/app/sites/[slug]/page.tsx`: website detail pages.
- Create `src/app/types/[type]/page.tsx`: type aggregation pages.
- Create `src/app/data/sites.json/route.ts`: JSON data endpoint.
- Create `src/app/llms.txt/route.ts`: LLM guide endpoint.
- Create `src/components/ResourceLibrary.tsx`: client search, filter, keyboard behavior.
- Create `src/components/SiteCard.tsx`: reusable website card.
- Create `src/components/FeaturedSites.tsx`: editorial cover cards.
- Create `src/data/site-types.ts`: taxonomy and TypeScript types.
- Create `src/data/sites.ts`: the 15 curated website records.
- Create `src/data/site-utils.ts`: lookup, grouping, metadata helpers.
- Create `src/lib/filter-sites.ts`: pure search and filtering logic.
- Create `src/lib/llms.ts`: plain-text LLM guide builder.
- Create `src/lib/structured-data.ts`: JSON-LD builders.
- Create `src/lib/site-json.ts`: public JSON serialization.
- Create `src/test/setup.ts`: test setup.
- Create `src/**/*.test.ts` and `src/**/*.test.tsx`: unit and component tests.
- Create `scripts/capture-screenshots.ts`: Playwright screenshot capture.
- Create `scripts/capture-screenshots.test.ts`: screenshot helper tests.
- Create `public/screenshots/.gitkeep`: screenshot directory marker.

## Task 1: Project Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `public/screenshots/.gitkeep`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "aesthetic-collection",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "screenshots": "tsx scripts/capture-screenshots.ts"
  },
  "dependencies": {
    "next": "14.2.23",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "eslint": "^9.16.0",
    "eslint-config-next": "14.2.23",
    "jsdom": "^25.0.1",
    "playwright": "^1.49.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 3: Create TypeScript and test config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Create minimal app shell**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aesthetic Collection",
  description: "A curated navigation library of aesthetic and design inspiration websites."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="page-shell">
      <h1>Aesthetic Collection</h1>
      <p>审美网站收藏册正在搭建。</p>
    </main>
  );
}
```

Create `src/app/globals.css`:

```css
:root {
  color: #171717;
  background: #f7f2ea;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f7f2ea;
}

a {
  color: inherit;
}

button,
input {
  font: inherit;
}

.page-shell {
  min-height: 100vh;
  padding: 48px;
}
```

Create `public/screenshots/.gitkeep` as an empty file.

- [ ] **Step 5: Verify foundation**

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

Run: `npm run build`

Expected: PASS and `.next` is generated.

- [ ] **Step 6: Commit foundation**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts src/test/setup.ts src/app/layout.tsx src/app/page.tsx src/app/globals.css public/screenshots/.gitkeep
git commit -m "chore: scaffold Next.js app"
```

## Task 2: Typed Site Data

**Files:**
- Create: `src/data/site-types.ts`
- Create: `src/data/sites.ts`
- Create: `src/data/site-utils.ts`
- Test: `src/data/sites.test.ts`

- [ ] **Step 1: Write failing data integrity tests**

Create `src/data/sites.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { SITE_TYPES } from "./site-types";
import { sites } from "./sites";
import { getSiteBySlug, getSitesByType } from "./site-utils";

describe("sites data", () => {
  it("contains the 15 source websites", () => {
    expect(sites).toHaveLength(15);
  });

  it("uses unique slugs", () => {
    const slugs = sites.map((site) => site.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has valid required fields", () => {
    for (const site of sites) {
      expect(site.name.length).toBeGreaterThan(1);
      expect(site.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(() => new URL(site.url)).not.toThrow();
      expect(SITE_TYPES.map((type) => type.id)).toContain(site.type);
      expect(site.summary.length).toBeGreaterThan(12);
      expect(site.description.length).toBeGreaterThan(site.summary.length);
      expect(site.tags.length).toBeGreaterThan(0);
      expect(site.useCases.length).toBeGreaterThan(0);
      expect(site.strengths.length).toBeGreaterThan(0);
      expect(site.agentNotes.length).toBeGreaterThan(20);
      expect(site.sourceTweetUrl).toBe("https://x.com/xiaoerzhan/status/2050427465714352451");
    }
  });

  it("looks up sites by slug and type", () => {
    expect(getSiteBySlug("awwwards")?.name).toBe("Awwwards");
    expect(getSitesByType("community-platform").map((site) => site.slug)).toEqual([
      "pinterest",
      "dribbble",
      "designspiration"
    ]);
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- src/data/sites.test.ts`

Expected: FAIL because `src/data/site-types.ts`, `src/data/sites.ts`, and `src/data/site-utils.ts` do not exist.

- [ ] **Step 3: Create taxonomy and site data**

Create `src/data/site-types.ts`:

```ts
export const SITE_TYPES = [
  { id: "community-platform", label: "社区平台", description: "适合发现、收藏、组织视觉灵感的社区型平台。" },
  { id: "portfolio-platform", label: "作品集平台", description: "适合查看设计师与团队的专业作品集。" },
  { id: "media-magazine", label: "媒体杂志", description: "适合阅读设计趋势、案例报道和创意文化内容。" },
  { id: "award-directory", label: "奖项榜单", description: "适合寻找高质量获奖网站、交互和视觉参考。" },
  { id: "vertical-archive", label: "垂直资料库", description: "适合按特定设计主题查找深度资料。" },
  { id: "independent-case", label: "独立案例", description: "适合研究单个高质量网站或创意项目。" }
] as const;

export type SiteType = (typeof SITE_TYPES)[number]["id"];

export type ScreenshotStatus = "pending" | "captured" | "failed";

export type Site = {
  name: string;
  slug: string;
  url: string;
  type: SiteType;
  summary: string;
  description: string;
  tags: string[];
  useCases: string[];
  strengths: string[];
  screenshotPath: string;
  screenshotStatus: ScreenshotStatus;
  screenshotCapturedAt?: string;
  agentNotes: string;
  sourceTweetUrl: string;
  updatedAt: string;
};
```

Create `src/data/sites.ts`:

```ts
import type { Site } from "./site-types";

const sourceTweetUrl = "https://x.com/xiaoerzhan/status/2050427465714352451";
const updatedAt = "2026-05-14";

export const sites: Site[] = [
  {
    name: "Pinterest",
    slug: "pinterest",
    url: "https://www.pinterest.com/",
    type: "community-platform",
    summary: "视觉发现和 moodboard 收藏平台，适合快速搜集图片灵感。",
    description: "Pinterest 是面向广泛创意场景的视觉发现引擎。它适合用来搜集图片、建立 moodboard、追踪风格方向，也适合在项目早期快速扩展视觉参考。",
    tags: ["图片灵感", "Moodboard", "视觉发现", "收藏"],
    useCases: ["找图片参考", "建立 moodboard", "收集风格方向"],
    strengths: ["内容规模大", "收藏流程顺手", "适合横向扩展灵感"],
    screenshotPath: "/screenshots/pinterest.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 识别灵感主题和视觉关键词；不应默认抓取或复用原站图片素材。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Dribbble",
    slug: "dribbble",
    url: "https://dribbble.com/",
    type: "community-platform",
    summary: "UI、UX 和图形设计作品社区，适合查看精致的小尺寸设计展示。",
    description: "Dribbble 聚集了大量 UI、UX、图形设计和品牌视觉作品。它适合快速查看高完成度视觉片段，也适合寻找设计师、团队与岗位信息。",
    tags: ["UI", "UX", "图形设计", "作品展示"],
    useCases: ["查看界面灵感", "寻找设计师", "研究视觉风格"],
    strengths: ["作品精致", "社区活跃", "适合快速浏览"],
    screenshotPath: "/screenshots/dribbble.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 总结 UI 风格和界面趋势；外部内容授权需要回到原站确认。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Behance",
    slug: "behance",
    url: "https://www.behance.net/",
    type: "portfolio-platform",
    summary: "Adobe 旗下专业作品集平台，适合研究完整项目和设计师 portfolio。",
    description: "Behance 收录大量完整的设计项目、品牌系统、视觉叙事和创意作品集。相比单张灵感图，它更适合研究项目过程、系列化呈现和专业履历。",
    tags: ["作品集", "Adobe", "品牌", "创意项目"],
    useCases: ["研究完整案例", "寻找创作者", "查看品牌系统"],
    strengths: ["项目完整", "专业度高", "适合招聘与背调"],
    screenshotPath: "/screenshots/behance.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 读取项目标题、作者、领域和摘要；详细内容应以原站当前页面为准。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Fast Company Design",
    slug: "fast-company-design",
    url: "https://www.fastcompany.com/co-design",
    type: "media-magazine",
    summary: "欧美设计资讯栏目，适合阅读趋势、创新案例和商业设计报道。",
    description: "Fast Company Design 关注设计、商业、创新和文化之间的关系。它适合用来补充案例背后的商业语境，而不只是收集视觉表层参考。",
    tags: ["设计资讯", "商业设计", "趋势", "创新"],
    useCases: ["阅读趋势", "寻找商业案例", "补充观点材料"],
    strengths: ["报道视角成熟", "商业语境强", "更新稳定"],
    screenshotPath: "/screenshots/fast-company-design.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 提取文章标题、趋势主题和商业案例线索；文章原文摘要应标注来源。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "BLOG DECO DESIGN",
    slug: "blog-deco-design",
    url: "https://blogdecodesign.fr/",
    type: "media-magazine",
    summary: "法国设计博客，适合查看产品设计、室内与生活方式相关灵感。",
    description: "BLOG DECO DESIGN 是偏欧洲语境的设计博客，内容覆盖产品、家居、空间和生活方式设计。它适合补充法语和欧洲设计媒体视角。",
    tags: ["产品设计", "法国设计", "家居", "生活方式"],
    useCases: ["寻找产品灵感", "查看欧洲设计", "补充空间设计参考"],
    strengths: ["地域视角鲜明", "产品与生活方式内容丰富", "审美温和"],
    screenshotPath: "/screenshots/blog-deco-design.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 识别欧洲产品与空间设计案例；法语内容需要翻译或双语摘要。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Designboom",
    slug: "designboom",
    url: "https://www.designboom.com",
    type: "media-magazine",
    summary: "艺术、设计和建筑媒体，适合跟踪创意项目与建筑艺术报道。",
    description: "Designboom 长期报道设计、建筑、艺术和技术交叉项目。它适合在寻找创意方向、展览项目、空间设计和实验性作品时使用。",
    tags: ["设计媒体", "建筑", "艺术", "创意项目"],
    useCases: ["跟踪创意报道", "研究建筑与艺术", "寻找跨界项目"],
    strengths: ["覆盖面广", "国际化强", "案例数量大"],
    screenshotPath: "/screenshots/designboom.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 按主题检索案例和报道；引用时应保留原文链接和发布日期。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Beautiful Life",
    slug: "beautiful-life",
    url: "https://www.beautifullife.info/",
    type: "media-magazine",
    summary: "艺术、设计和生活方式网络杂志，适合发现独特创意与高质感项目。",
    description: "Beautiful Life 收录艺术、设计、奢华生活方式和创意产品内容。它适合寻找较轻松但视觉完成度高的灵感材料。",
    tags: ["艺术", "生活方式", "创意设计", "产品"],
    useCases: ["发现趣味项目", "寻找视觉素材方向", "补充生活方式案例"],
    strengths: ["题材轻盈", "视觉吸引力强", "适合泛设计浏览"],
    screenshotPath: "/screenshots/beautiful-life.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 提取创意产品和生活方式主题；应避免把娱乐化内容误判为专业设计标准。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Sgustok Design",
    slug: "sgustok-design",
    url: "https://sgustokdesign.com/",
    type: "vertical-archive",
    summary: "现代设计作品数字目录，适合按建筑、室内、工业、时尚和平面分类浏览。",
    description: "Sgustok Design 更接近一个干净的现代设计目录，按领域组织视觉项目。它适合进行低干扰的分类浏览和参考收集。",
    tags: ["设计目录", "建筑", "工业设计", "平面"],
    useCases: ["按领域浏览", "收集现代设计案例", "低干扰找参考"],
    strengths: ["分类清楚", "展示克制", "广告干扰少"],
    screenshotPath: "/screenshots/sgustok-design.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 按类别整理案例清单；需要访问原站确认项目详情和外部来源。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Awwwards",
    slug: "awwwards",
    url: "https://www.awwwards.com/",
    type: "award-directory",
    summary: "网页设计奖项与榜单平台，适合寻找高水平交互、动效和视觉网站。",
    description: "Awwwards 收录全球获奖和提名网站，是网页视觉、交互、动效和前端表现的重要参考库。它适合网页项目启动时寻找标杆案例。",
    tags: ["网页设计", "交互", "动效", "奖项"],
    useCases: ["寻找网页标杆", "研究交互动效", "查看获奖网站"],
    strengths: ["质量门槛高", "网页案例集中", "分类和评分有参考价值"],
    screenshotPath: "/screenshots/awwwards.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 读取网站标题、奖项、分类和技术线索；外部获奖站点状态可能随时间变化。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "It's Nice That",
    slug: "its-nice-that",
    url: "https://www.itsnicethat.com/",
    type: "media-magazine",
    summary: "英国独立创意媒体，适合发现插画、摄影、实验艺术和新锐创作者。",
    description: "It's Nice That 关注独立创意文化和新锐创作者，内容覆盖插画、摄影、平面、艺术和实验项目。它适合寻找更前卫和人文的视觉灵感。",
    tags: ["创意媒体", "插画", "摄影", "实验艺术"],
    useCases: ["发现新锐创作者", "寻找前卫视觉", "研究创意文化"],
    strengths: ["编辑眼光强", "创作者发现能力好", "文化气质鲜明"],
    screenshotPath: "/screenshots/its-nice-that.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 提取创作者、媒介和项目主题；人物与作品信息应回链原文确认。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Logo Design Love",
    slug: "logo-design-love",
    url: "https://www.logodesignlove.com/",
    type: "vertical-archive",
    summary: "Logo 与品牌识别案例站，适合研究标志、符号和设计故事。",
    description: "Logo Design Love 专注 logo、符号、图标和品牌识别案例。它适合在做品牌视觉、标志推导和符号分析时查看案例故事。",
    tags: ["Logo", "品牌识别", "符号", "案例故事"],
    useCases: ["研究 logo 案例", "寻找品牌识别参考", "分析符号设计"],
    strengths: ["主题聚焦", "案例叙事清楚", "品牌设计价值高"],
    screenshotPath: "/screenshots/logo-design-love.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 整理品牌案例和设计推导要点；商标图形不可默认复用。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Slideland",
    slug: "slideland",
    url: "https://www.slideland.tech/en",
    type: "vertical-archive",
    summary: "日本企业真实 PPT 资料库，适合研究商业演示、年报和品牌手册。",
    description: "Slideland 收集日本企业真实演示材料，包括年报、文化手册、商业计划书等。它适合学习日本商业美学、版式节奏和信息表达。",
    tags: ["PPT", "日本设计", "商业演示", "版式"],
    useCases: ["找 PPT 参考", "研究商业表达", "学习日本版式"],
    strengths: ["真实商业材料", "筛选维度实用", "日本美学特征明显"],
    screenshotPath: "/screenshots/slideland.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 按行业、颜色和风格总结演示材料；具体文件授权和下载条件需看原站。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Godly",
    slug: "godly",
    url: "http://godly.website",
    type: "vertical-archive",
    summary: "高质量网页设计灵感库，适合查找 portfolio、AI、Web3 和品牌官网案例。",
    description: "Godly 收录大量高质量网页设计案例，覆盖作品集、AI 网站、Web3、品牌官网和实验交互。它适合在网页设计项目中快速建立质量基准。",
    tags: ["网页设计", "Portfolio", "AI 网站", "Web3"],
    useCases: ["找网页灵感", "建立设计标杆", "研究品牌官网"],
    strengths: ["案例质量高", "领域覆盖新", "适合网页项目启动"],
    screenshotPath: "/screenshots/godly.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 按网页类型建立案例清单；原站链接和案例可用性需要当前访问确认。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Designspiration",
    slug: "designspiration",
    url: "https://www.designspiration.com/",
    type: "community-platform",
    summary: "设计师向灵感平台，适合按颜色和视觉主题搜索平面、字体、包装和 UI。",
    description: "Designspiration 更聚焦设计师的视觉灵感发现，覆盖平面、字体、排版、摄影、海报、包装、Logo 和 UI。颜色搜索和情绪板能力适合做风格探索。",
    tags: ["设计灵感", "颜色搜索", "排版", "包装"],
    useCases: ["按颜色找灵感", "建立视觉方向", "收集平面参考"],
    strengths: ["设计相关性高", "搜索体验聚焦", "适合 moodboard"],
    screenshotPath: "/screenshots/designspiration.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 识别颜色、风格和设计类别；素材复用必须回到原站确认来源。",
    sourceTweetUrl,
    updatedAt
  },
  {
    name: "Ukiby Non Editions",
    slug: "ukiby-non-editions",
    url: "https://ukibynoneditions.com/",
    type: "independent-case",
    summary: "日本设计审美网站个案，适合研究单站视觉、动效和叙事体验。",
    description: "Ukiby Non Editions 是一个独立网站案例，适合被当作完整体验研究对象。它适合观察视觉节奏、页面结构、交互细节和日本设计气质。",
    tags: ["日本设计", "独立案例", "网页体验", "动效"],
    useCases: ["研究单站体验", "学习日本网页审美", "分析动效与叙事"],
    strengths: ["个案完整", "视觉气质强", "适合深度拆解"],
    screenshotPath: "/screenshots/ukiby-non-editions.png",
    screenshotStatus: "pending",
    agentNotes: "适合让 Agent 做单站结构拆解和视觉语言总结；不要把它当成可泛化的资料库。",
    sourceTweetUrl,
    updatedAt
  }
];
```

Create `src/data/site-utils.ts`:

```ts
import { SITE_TYPES, type SiteType } from "./site-types";
import { sites } from "./sites";

export function getSiteBySlug(slug: string) {
  return sites.find((site) => site.slug === slug);
}

export function getSitesByType(type: SiteType) {
  return sites.filter((site) => site.type === type);
}

export function getTypeLabel(type: SiteType) {
  return SITE_TYPES.find((item) => item.id === type)?.label ?? type;
}

export function getTypeDescription(type: SiteType) {
  return SITE_TYPES.find((item) => item.id === type)?.description ?? "";
}

export function getAllTags() {
  return Array.from(new Set(sites.flatMap((site) => site.tags))).sort((a, b) => a.localeCompare(b, "zh-CN"));
}
```

- [ ] **Step 4: Run data tests**

Run: `npm test -- src/data/sites.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit data model**

```bash
git add src/data/site-types.ts src/data/sites.ts src/data/site-utils.ts src/data/sites.test.ts
git commit -m "feat: add curated site data"
```

## Task 3: Search And Filtering Logic

**Files:**
- Create: `src/lib/filter-sites.ts`
- Test: `src/lib/filter-sites.test.ts`

- [ ] **Step 1: Write failing filter tests**

Create `src/lib/filter-sites.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sites } from "@/data/sites";
import { filterSites } from "./filter-sites";

describe("filterSites", () => {
  it("searches by name", () => {
    expect(filterSites(sites, { query: "awwwards", type: "all", tags: [] }).map((site) => site.slug)).toEqual(["awwwards"]);
  });

  it("searches by use case and tag in Chinese", () => {
    expect(filterSites(sites, { query: "日本", type: "all", tags: [] }).map((site) => site.slug)).toContain("slideland");
  });

  it("filters by type", () => {
    expect(filterSites(sites, { query: "", type: "award-directory", tags: [] }).map((site) => site.slug)).toEqual(["awwwards"]);
  });

  it("requires every selected tag to match", () => {
    expect(filterSites(sites, { query: "", type: "all", tags: ["网页设计", "动效"] }).map((site) => site.slug)).toEqual(["awwwards"]);
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- src/lib/filter-sites.test.ts`

Expected: FAIL because `filter-sites.ts` does not exist.

- [ ] **Step 3: Implement filter logic**

Create `src/lib/filter-sites.ts`:

```ts
import type { Site, SiteType } from "@/data/site-types";

export type SiteFilter = {
  query: string;
  type: SiteType | "all";
  tags: string[];
};

function normalize(value: string) {
  return value.trim().toLocaleLowerCase();
}

function siteSearchText(site: Site) {
  return [
    site.name,
    site.slug,
    site.type,
    site.summary,
    site.description,
    ...site.tags,
    ...site.useCases,
    ...site.strengths,
    site.agentNotes
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function filterSites(allSites: Site[], filter: SiteFilter) {
  const query = normalize(filter.query);

  return allSites.filter((site) => {
    const typeMatches = filter.type === "all" || site.type === filter.type;
    const tagsMatch = filter.tags.every((tag) => site.tags.includes(tag));
    const queryMatches = query.length === 0 || siteSearchText(site).includes(query);

    return typeMatches && tagsMatch && queryMatches;
  });
}
```

- [ ] **Step 4: Run filter tests**

Run: `npm test -- src/lib/filter-sites.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit filter logic**

```bash
git add src/lib/filter-sites.ts src/lib/filter-sites.test.ts
git commit -m "feat: add site filtering logic"
```

## Task 4: Machine-Readable Outputs

**Files:**
- Create: `src/lib/site-json.ts`
- Create: `src/lib/llms.ts`
- Create: `src/app/data/sites.json/route.ts`
- Create: `src/app/llms.txt/route.ts`
- Test: `src/lib/site-json.test.ts`
- Test: `src/lib/llms.test.ts`

- [ ] **Step 1: Write failing output tests**

Create `src/lib/site-json.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildSitesJson } from "./site-json";

describe("buildSitesJson", () => {
  it("serializes all sites with metadata", () => {
    const payload = buildSitesJson();
    expect(payload.version).toBe("2026-05-14");
    expect(payload.source).toBe("https://x.com/xiaoerzhan/status/2050427465714352451");
    expect(payload.sites).toHaveLength(15);
    expect(payload.sites[0]).toHaveProperty("agentNotes");
  });
});
```

Create `src/lib/llms.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildLlmsText } from "./llms";

describe("buildLlmsText", () => {
  it("describes agent entry points", () => {
    const text = buildLlmsText();
    expect(text).toContain("Aesthetic Collection");
    expect(text).toContain("/data/sites.json");
    expect(text).toContain("agentNotes");
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- src/lib/site-json.test.ts src/lib/llms.test.ts`

Expected: FAIL because `site-json.ts` and `llms.ts` do not exist.

- [ ] **Step 3: Implement output builders and routes**

Create `src/lib/site-json.ts`:

```ts
import { SITE_TYPES } from "@/data/site-types";
import { sites } from "@/data/sites";

export function buildSitesJson() {
  return {
    version: "2026-05-14",
    title: "Aesthetic Collection",
    source: "https://x.com/xiaoerzhan/status/2050427465714352451",
    types: SITE_TYPES,
    sites
  };
}
```

Create `src/lib/llms.ts`:

```ts
import { SITE_TYPES } from "@/data/site-types";
import { sites } from "@/data/sites";

export function buildLlmsText() {
  const typeLines = SITE_TYPES.map((type) => `- ${type.id}: ${type.label} - ${type.description}`).join("\n");
  const siteLines = sites.map((site) => `- ${site.name} (${site.slug}): ${site.summary} URL: ${site.url}`).join("\n");

  return `# Aesthetic Collection

Aesthetic Collection is a curated navigation library of aesthetic and design inspiration websites.

Human entry points:
- /
- /sites/[slug]
- /types/[type]

Machine-readable entry points:
- /data/sites.json
- /llms.txt

Field guide for /data/sites.json:
- name: display name
- slug: stable local identifier
- url: canonical external website URL
- type: one of the supported website type IDs
- summary: short human-readable description
- description: longer local editorial description
- tags: searchable labels
- useCases: practical reasons to open the website
- strengths: why the website is valuable
- screenshotPath: local screenshot path
- screenshotStatus: pending, captured, or failed
- agentNotes: guidance for AI agents
- sourceTweetUrl: source collection reference
- updatedAt: local data update date

Website types:
${typeLines}

Sites:
${siteLines}

Agent guidance:
Prefer /data/sites.json for complete structured data. Use detail pages for human-readable context. Visit external URLs only when current source content is required.
`;
}
```

Create `src/app/data/sites.json/route.ts`:

```ts
import { buildSitesJson } from "@/lib/site-json";

export function GET() {
  return Response.json(buildSitesJson(), {
    headers: {
      "Cache-Control": "public, max-age=3600"
    }
  });
}
```

Create `src/app/llms.txt/route.ts`:

```ts
import { buildLlmsText } from "@/lib/llms";

export function GET() {
  return new Response(buildLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
```

- [ ] **Step 4: Run output tests**

Run: `npm test -- src/lib/site-json.test.ts src/lib/llms.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit machine-readable outputs**

```bash
git add src/lib/site-json.ts src/lib/llms.ts src/app/data/sites.json/route.ts src/app/llms.txt/route.ts src/lib/site-json.test.ts src/lib/llms.test.ts
git commit -m "feat: expose agent-readable site data"
```

## Task 5: Homepage Resource Library

**Files:**
- Create: `src/components/SiteCard.tsx`
- Create: `src/components/FeaturedSites.tsx`
- Create: `src/components/ResourceLibrary.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Test: `src/components/ResourceLibrary.test.tsx`

- [ ] **Step 1: Write failing component tests**

Create `src/components/ResourceLibrary.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sites } from "@/data/sites";
import { ResourceLibrary } from "./ResourceLibrary";

describe("ResourceLibrary", () => {
  it("renders all sites by default", () => {
    render(<ResourceLibrary sites={sites} />);
    expect(screen.getByText("Pinterest")).toBeInTheDocument();
    expect(screen.getByText("Ukiby Non Editions")).toBeInTheDocument();
  });

  it("filters by search query", () => {
    render(<ResourceLibrary sites={sites} />);
    fireEvent.change(screen.getByLabelText("搜索网站"), { target: { value: "Slideland" } });
    expect(screen.getByText("Slideland")).toBeInTheDocument();
    expect(screen.queryByText("Pinterest")).not.toBeInTheDocument();
  });

  it("filters by type button", () => {
    render(<ResourceLibrary sites={sites} />);
    fireEvent.click(screen.getByRole("button", { name: "奖项榜单" }));
    expect(screen.getByText("Awwwards")).toBeInTheDocument();
    expect(screen.queryByText("Behance")).not.toBeInTheDocument();
  });

  it("clears filters", () => {
    render(<ResourceLibrary sites={sites} />);
    fireEvent.change(screen.getByLabelText("搜索网站"), { target: { value: "no-match-value" } });
    expect(screen.getByText("没有找到匹配的网站")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "清空筛选" }));
    expect(screen.getByText("Pinterest")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run component tests and confirm failure**

Run: `npm test -- src/components/ResourceLibrary.test.tsx`

Expected: FAIL because `ResourceLibrary.tsx` does not exist.

- [ ] **Step 3: Implement components**

Create `src/components/SiteCard.tsx`:

```tsx
import Link from "next/link";
import type { Site } from "@/data/site-types";
import { getTypeLabel } from "@/data/site-utils";

export function SiteCard({ site, focused }: { site: Site; focused?: boolean }) {
  return (
    <article className={focused ? "site-card is-focused" : "site-card"} data-site-slug={site.slug} data-site-type={site.type}>
      <div className="site-card__image" aria-label={`${site.name} 网站预览图`}>
        <img src={site.screenshotPath} alt={`${site.name} screenshot`} />
      </div>
      <div className="site-card__body">
        <div className="site-card__meta">{getTypeLabel(site.type)}</div>
        <h3>
          <Link href={`/sites/${site.slug}`}>{site.name}</Link>
        </h3>
        <p>{site.summary}</p>
        <div className="site-card__tags">
          {site.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="site-card__actions">
          <a href={site.url} target="_blank" rel="noreferrer" aria-label={`打开 ${site.name}，新窗口`}>
            打开网站
          </a>
          <Link href={`/sites/${site.slug}`}>详情</Link>
        </div>
      </div>
    </article>
  );
}
```

Create `src/components/FeaturedSites.tsx`:

```tsx
import { SiteCard } from "./SiteCard";
import type { Site } from "@/data/site-types";

const featuredSlugs = ["awwwards", "designspiration", "slideland"];

export function FeaturedSites({ sites }: { sites: Site[] }) {
  const featured = featuredSlugs.map((slug) => sites.find((site) => site.slug === slug)).filter((site): site is Site => Boolean(site));

  return (
    <section className="featured-sites" aria-label="精选网站">
      {featured.map((site) => (
        <SiteCard key={site.slug} site={site} />
      ))}
    </section>
  );
}
```

Create `src/components/ResourceLibrary.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SITE_TYPES, type Site, type SiteType } from "@/data/site-types";
import { getAllTags } from "@/data/site-utils";
import { filterSites, type SiteFilter } from "@/lib/filter-sites";
import { SiteCard } from "./SiteCard";

export function ResourceLibrary({ sites }: { sites: Site[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SiteFilter["type"]>("all");
  const [tags, setTags] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const allTags = useMemo(() => getAllTags(), []);
  const filteredSites = useMemo(() => filterSites(sites, { query, type, tags }), [sites, query, type, tags]);

  useEffect(() => {
    setFocusedIndex(0);
  }, [query, type, tags]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setQuery("");
        setTags([]);
        setType("all");
      }

      if (!isTyping && event.key === "ArrowRight") {
        setFocusedIndex((index) => Math.min(index + 1, Math.max(filteredSites.length - 1, 0)));
      }

      if (!isTyping && event.key === "ArrowLeft") {
        setFocusedIndex((index) => Math.max(index - 1, 0));
      }

      const focusedSite = filteredSites[focusedIndex];
      if (!isTyping && focusedSite && event.key === "Enter") {
        window.open(focusedSite.url, "_blank", "noopener,noreferrer");
      }

      if (!isTyping && focusedSite && event.key.toLocaleLowerCase() === "d") {
        window.location.href = `/sites/${focusedSite.slug}`;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filteredSites, focusedIndex]);

  function toggleTag(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  function clearFilters() {
    setQuery("");
    setTags([]);
    setType("all");
  }

  return (
    <section className="library" aria-label="网站资源库">
      <div className="library__controls">
        <label>
          <span>搜索网站</span>
          <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、用途、标签或描述" />
        </label>
        <div className="segmented" aria-label="网站类型">
          <button type="button" aria-pressed={type === "all"} onClick={() => setType("all")}>
            全部
          </button>
          {SITE_TYPES.map((item) => (
            <button key={item.id} type="button" aria-pressed={type === item.id} onClick={() => setType(item.id as SiteType)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="tag-filter" aria-label="标签筛选">
          {allTags.map((tag) => (
            <button key={tag} type="button" aria-pressed={tags.includes(tag)} onClick={() => toggleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="library__summary">{filteredSites.length} / {sites.length} 个网站</div>

      {filteredSites.length === 0 ? (
        <div className="empty-state">
          <p>没有找到匹配的网站</p>
          <button type="button" onClick={clearFilters}>清空筛选</button>
        </div>
      ) : (
        <div className="site-grid">
          {filteredSites.map((site, index) => (
            <SiteCard key={site.slug} site={site} focused={index === focusedIndex} />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Replace homepage with magazine cover and library**

Modify `src/app/page.tsx`:

```tsx
import { FeaturedSites } from "@/components/FeaturedSites";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { sites } from "@/data/sites";

export default function HomePage() {
  return (
    <main>
      <nav className="top-nav" aria-label="主导航">
        <a href="/">Aesthetic Collection</a>
        <a href="/data/sites.json">Data</a>
        <a href="/llms.txt">LLMs</a>
        <a href="https://x.com/xiaoerzhan/status/2050427465714352451" target="_blank" rel="noreferrer">Source</a>
      </nav>
      <header className="cover">
        <div>
          <p className="eyebrow">Design resources for humans and agents</p>
          <h1>审美网站收藏册</h1>
          <p className="cover__intro">15 个设计灵感网站，按网站类型整理，支持快速搜索、筛选和 AI 读取。</p>
          <div className="cover__stats">
            <span>15 sites</span>
            <span>6 types</span>
            <span>JSON + llms.txt</span>
          </div>
        </div>
        <FeaturedSites sites={sites} />
      </header>
      <ResourceLibrary sites={sites} />
    </main>
  );
}
```

Append to `src/app/globals.css`:

```css
.top-nav {
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  padding: 24px 36px;
  background: #f7f2ea;
  border-bottom: 1px solid rgba(23, 23, 23, 0.1);
}

.cover {
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
  gap: 32px;
  min-height: 78vh;
  padding: 56px 36px 28px;
  align-items: end;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0;
  font-size: 13px;
  color: #776b5d;
}

.cover h1 {
  margin: 0;
  max-width: 780px;
  font-size: clamp(48px, 8vw, 112px);
  line-height: 0.96;
}

.cover__intro {
  max-width: 580px;
  font-size: 20px;
  line-height: 1.6;
  color: #554d44;
}

.cover__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cover__stats span,
.site-card__tags span,
.tag-filter button,
.segmented button {
  border: 1px solid rgba(23, 23, 23, 0.16);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.5);
}

.featured-sites,
.site-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.library {
  padding: 24px 36px 64px;
}

.library__controls {
  position: sticky;
  top: 0;
  z-index: 2;
  display: grid;
  gap: 16px;
  padding: 18px 0;
  background: #f7f2ea;
}

.library__controls label {
  display: grid;
  gap: 8px;
}

.library__controls input {
  width: 100%;
  border: 1px solid rgba(23, 23, 23, 0.18);
  border-radius: 8px;
  padding: 14px 16px;
  background: #fffaf2;
}

.segmented,
.tag-filter,
.site-card__tags,
.site-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segmented button[aria-pressed="true"],
.tag-filter button[aria-pressed="true"] {
  color: #fffaf2;
  background: #171717;
}

.library__summary {
  margin: 16px 0;
  color: #776b5d;
}

.site-card {
  overflow: hidden;
  border: 1px solid rgba(23, 23, 23, 0.14);
  border-radius: 8px;
  background: #fffaf2;
}

.site-card.is-focused {
  outline: 3px solid #171717;
  outline-offset: 3px;
}

.site-card__image {
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #242424, #d5c4aa);
}

.site-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.site-card__body {
  display: grid;
  gap: 12px;
  padding: 16px;
}

.site-card__meta {
  color: #776b5d;
  font-size: 13px;
}

.site-card h3 {
  margin: 0;
  font-size: 22px;
}

.site-card p {
  margin: 0;
  color: #554d44;
  line-height: 1.55;
}

.site-card__actions a {
  border-radius: 6px;
  padding: 10px 12px;
  color: #fffaf2;
  background: #171717;
  text-decoration: none;
}

.site-card__actions a + a {
  color: #171717;
  background: transparent;
  border: 1px solid rgba(23, 23, 23, 0.18);
}

.empty-state {
  border: 1px solid rgba(23, 23, 23, 0.14);
  border-radius: 8px;
  padding: 32px;
  background: #fffaf2;
}

@media (max-width: 760px) {
  .top-nav {
    justify-content: flex-start;
    overflow-x: auto;
  }

  .cover {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 36px;
  }
}
```

- [ ] **Step 5: Run component tests**

Run: `npm test -- src/components/ResourceLibrary.test.tsx`

Expected: PASS.

- [ ] **Step 6: Run typecheck**

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 7: Commit homepage library**

```bash
git add src/components/SiteCard.tsx src/components/FeaturedSites.tsx src/components/ResourceLibrary.tsx src/components/ResourceLibrary.test.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: build searchable resource library"
```

## Task 6: Detail Pages, Type Pages, And Structured Data

**Files:**
- Create: `src/lib/structured-data.ts`
- Create: `src/lib/structured-data.test.ts`
- Create: `src/app/sites/[slug]/page.tsx`
- Create: `src/app/types/[type]/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write failing structured-data tests**

Create `src/lib/structured-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { sites } from "@/data/sites";
import { buildSiteJsonLd } from "./structured-data";

describe("buildSiteJsonLd", () => {
  it("builds JSON-LD for a listed website", () => {
    const jsonLd = buildSiteJsonLd(sites[0]);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.name).toBe("Pinterest");
    expect(jsonLd.url).toBe("https://www.pinterest.com/");
    expect(jsonLd.keywords).toContain("Moodboard");
  });
});
```

- [ ] **Step 2: Run test and confirm failure**

Run: `npm test -- src/lib/structured-data.test.ts`

Expected: FAIL because `structured-data.ts` does not exist.

- [ ] **Step 3: Implement structured data helper**

Create `src/lib/structured-data.ts`:

```ts
import type { Site } from "@/data/site-types";

export function buildSiteJsonLd(site: Site) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    keywords: site.tags,
    about: site.useCases,
    isPartOf: {
      "@type": "CollectionPage",
      name: "Aesthetic Collection"
    }
  };
}
```

- [ ] **Step 4: Create detail page**

Create `src/app/sites/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sites } from "@/data/sites";
import { getSiteBySlug, getSitesByType, getTypeLabel } from "@/data/site-utils";
import { buildSiteJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
  return sites.map((site) => ({ slug: site.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const site = getSiteBySlug(params.slug);
  if (!site) return {};
  return {
    title: `${site.name} | Aesthetic Collection`,
    description: site.summary,
    openGraph: {
      title: `${site.name} | Aesthetic Collection`,
      description: site.summary,
      images: [site.screenshotPath]
    }
  };
}

export default function SiteDetailPage({ params }: { params: { slug: string } }) {
  const site = getSiteBySlug(params.slug);
  if (!site) notFound();

  const recommendations = getSitesByType(site.type).filter((item) => item.slug !== site.slug).slice(0, 3);

  return (
    <main className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSiteJsonLd(site)) }} />
      <a className="back-link" href="/">返回首页</a>
      <article data-site-slug={site.slug} data-site-type={site.type}>
        <div className="detail-hero">
          <img src={site.screenshotPath} alt={`${site.name} screenshot`} />
        </div>
        <p className="eyebrow">{getTypeLabel(site.type)}</p>
        <h1>{site.name}</h1>
        <p className="detail-summary">{site.summary}</p>
        <a className="primary-link" href={site.url} target="_blank" rel="noreferrer">打开网站</a>
        <section>
          <h2>为什么值得收藏</h2>
          <p>{site.description}</p>
        </section>
        <section>
          <h2>适合用途</h2>
          <ul>{site.useCases.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h2>Agent notes</h2>
          <p>{site.agentNotes}</p>
        </section>
        <section>
          <h2>同类型推荐</h2>
          <ul>{recommendations.map((item) => <li key={item.slug}><a href={`/sites/${item.slug}`}>{item.name}</a></li>)}</ul>
        </section>
      </article>
    </main>
  );
}
```

- [ ] **Step 5: Create type page**

Create `src/app/types/[type]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { SiteCard } from "@/components/SiteCard";
import { SITE_TYPES, type SiteType } from "@/data/site-types";
import { getSitesByType } from "@/data/site-utils";

export function generateStaticParams() {
  return SITE_TYPES.map((type) => ({ type: type.id }));
}

export default function TypePage({ params }: { params: { type: SiteType } }) {
  const type = SITE_TYPES.find((item) => item.id === params.type);
  if (!type) notFound();

  const typedSites = getSitesByType(type.id);

  return (
    <main className="type-page">
      <a className="back-link" href="/">返回首页</a>
      <header>
        <p className="eyebrow">Website type</p>
        <h1>{type.label}</h1>
        <p>{type.description}</p>
      </header>
      <div className="site-grid">
        {typedSites.map((site) => <SiteCard key={site.slug} site={site} />)}
      </div>
    </main>
  );
}
```

Append to `src/app/globals.css`:

```css
.detail-page,
.type-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 36px;
}

.back-link {
  display: inline-flex;
  margin-bottom: 24px;
}

.detail-hero {
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 16 / 8;
  background: linear-gradient(135deg, #242424, #d5c4aa);
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-page h1,
.type-page h1 {
  margin: 12px 0;
  font-size: clamp(42px, 7vw, 88px);
  line-height: 1;
}

.detail-summary,
.type-page header p {
  max-width: 760px;
  font-size: 20px;
  line-height: 1.65;
  color: #554d44;
}

.primary-link {
  display: inline-flex;
  margin: 12px 0 28px;
  border-radius: 6px;
  padding: 12px 14px;
  color: #fffaf2;
  background: #171717;
  text-decoration: none;
}

.detail-page section {
  margin: 36px 0;
  max-width: 760px;
}
```

- [ ] **Step 6: Run tests and build**

Run: `npm test -- src/lib/structured-data.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: PASS and static params generate for 15 site pages and 6 type pages.

- [ ] **Step 7: Commit pages**

```bash
git add src/lib/structured-data.ts src/lib/structured-data.test.ts src/app/sites/[slug]/page.tsx src/app/types/[type]/page.tsx src/app/globals.css
git commit -m "feat: add detail and type pages"
```

## Task 7: Screenshot Capture Script

**Files:**
- Create: `scripts/capture-screenshots.ts`
- Create: `scripts/capture-screenshots.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing script helper tests**

Create `scripts/capture-screenshots.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildScreenshotPath, shouldCaptureSite } from "./capture-screenshots";

describe("screenshot helpers", () => {
  it("builds screenshot paths by slug", () => {
    expect(buildScreenshotPath("awwwards")).toBe("public/screenshots/awwwards.png");
  });

  it("captures pending and failed sites", () => {
    expect(shouldCaptureSite({ screenshotStatus: "pending" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "failed" })).toBe(true);
    expect(shouldCaptureSite({ screenshotStatus: "captured" })).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- scripts/capture-screenshots.test.ts`

Expected: FAIL because `capture-screenshots.ts` does not exist.

- [ ] **Step 3: Implement screenshot script**

Create `scripts/capture-screenshots.ts`:

```ts
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { sites } from "../src/data/sites";

type CaptureCandidate = {
  screenshotStatus: "pending" | "captured" | "failed";
};

export function buildScreenshotPath(slug: string) {
  return `public/screenshots/${slug}.png`;
}

export function shouldCaptureSite(site: CaptureCandidate) {
  return site.screenshotStatus !== "captured";
}

async function captureScreenshots() {
  await fs.mkdir("public/screenshots", { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const failures: Array<{ slug: string; url: string; message: string }> = [];

  for (const site of sites.filter(shouldCaptureSite)) {
    const outputPath = buildScreenshotPath(site.slug);
    try {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(1500);
      await page.screenshot({ path: outputPath, fullPage: false });
      console.log(`captured ${site.slug} -> ${outputPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ slug: site.slug, url: site.url, message });
      console.error(`failed ${site.slug}: ${message}`);
    }
  }

  await browser.close();

  const manifestPath = path.join("public", "screenshots", "manifest.json");
  await fs.writeFile(
    manifestPath,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        failures
      },
      null,
      2
    )
  );

  if (failures.length > 0) {
    console.error(`${failures.length} screenshot captures failed. See ${manifestPath}.`);
  }
}

if (process.argv[1]?.endsWith("capture-screenshots.ts")) {
  captureScreenshots().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
```

- [ ] **Step 4: Run script helper tests**

Run: `npm test -- scripts/capture-screenshots.test.ts`

Expected: PASS.

- [ ] **Step 5: Install Playwright browser and run one screenshot pass**

Run: `npx playwright install chromium`

Expected: Chromium browser is installed.

Run: `npm run screenshots`

Expected: The command creates `public/screenshots/manifest.json` and captures at least one `.png` file in `public/screenshots/`. Some external sites can fail; failures are listed in the manifest.

- [ ] **Step 6: Commit screenshot script**

```bash
git add scripts/capture-screenshots.ts scripts/capture-screenshots.test.ts public/screenshots/.gitkeep package.json package-lock.json
git add public/screenshots/manifest.json public/screenshots/*.png
git commit -m "feat: add screenshot capture workflow"
```

## Task 8: Final Verification And Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Create README**

Create `README.md`:

````md
# Aesthetic Collection

Aesthetic Collection is a Next.js content site for curated aesthetic and design inspiration websites.

It has two surfaces:

- A human-facing navigation page with search, filters, screenshots, and detail pages.
- Agent-readable data through `/data/sites.json` and `/llms.txt`.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run typecheck
npm run build
```

## Screenshots

```bash
npx playwright install chromium
npm run screenshots
```

Screenshots are written to `public/screenshots/`. Capture failures are recorded in `public/screenshots/manifest.json`.
````

- [ ] **Step 2: Run full verification**

Run: `npm test`

Expected: PASS for all Vitest suites.

Run: `npm run typecheck`

Expected: PASS with no TypeScript errors.

Run: `npm run build`

Expected: PASS with homepage, detail pages, type pages, `/data/sites.json`, and `/llms.txt`.

- [ ] **Step 3: Manually verify local routes**

Run: `npm run dev`

Expected: Next.js dev server starts and prints a local URL, usually `http://localhost:3000`.

Open these routes:

- `http://localhost:3000/`
- `http://localhost:3000/sites/awwwards`
- `http://localhost:3000/types/vertical-archive`
- `http://localhost:3000/data/sites.json`
- `http://localhost:3000/llms.txt`

Expected:

- Homepage shows cover, search, filters, and cards.
- Awwwards detail page shows screenshot area, content, external link, and Agent notes.
- Vertical archive page lists Sgustok Design, Logo Design Love, Slideland, and Godly.
- JSON endpoint returns 15 site records.
- LLM text endpoint explains fields and agent usage.

- [ ] **Step 4: Commit README and final verified state**

```bash
git add README.md
git commit -m "docs: add project usage guide"
```

## Self-Review Notes

- Spec coverage: this plan covers Next.js site setup, 15-site data, homepage, search, type filter, tag filter, keyboard interactions, detail pages, type pages, screenshot capture, `/data/sites.json`, `/llms.txt`, SEO metadata via page metadata, JSON-LD, and verification commands.
- Scope boundary: account features, cloud sync, analytics, CMS, MCP server, recurring summaries, and full multilingual switching are excluded.
- Type consistency: `Site`, `SiteType`, `ScreenshotStatus`, `filterSites`, `buildSitesJson`, `buildLlmsText`, and `buildSiteJsonLd` are defined before use.
