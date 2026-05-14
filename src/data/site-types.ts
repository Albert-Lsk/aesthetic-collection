export const SITE_TYPES = [
  {
    id: "community-platform",
    label: "社区平台",
    description: "以用户收藏、发布和互动为核心，适合发现趋势、建立灵感板和观察真实偏好。",
  },
  {
    id: "portfolio-platform",
    label: "作品集平台",
    description: "设计师和团队展示完整作品的场所，适合研究项目表达、案例结构和专业呈现方式。",
  },
  {
    id: "media-magazine",
    label: "媒体杂志",
    description: "持续发布设计、艺术、商业和文化报道的编辑型媒体，适合跟踪语境与观点。",
  },
  {
    id: "award-directory",
    label: "奖项榜单",
    description: "通过评审、提名或榜单机制筛选优秀作品，适合寻找高完成度的标杆案例。",
  },
  {
    id: "vertical-archive",
    label: "垂直资料库",
    description: "围绕特定媒介或领域长期归档案例，适合做专项研究和建立可复用参考库。",
  },
  {
    id: "independent-case",
    label: "独立案例",
    description: "由独立团队、工作室或策展项目维护的案例集合，适合发现非主流但有辨识度的表达。",
  },
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
  agentNotes: string;
  sourceTweetUrl: string;
  updatedAt: string;
  screenshotPath: string;
  screenshotStatus: ScreenshotStatus;
  screenshotCapturedAt?: string;
};
