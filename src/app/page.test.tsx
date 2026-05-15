import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the resource library homepage", () => {
    render(createElement(HomePage));

    expect(screen.getByRole("link", { name: "Aesthetic Collection" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "社区平台" })).toHaveAttribute(
      "href",
      "/types/community-platform",
    );
    expect(screen.getByRole("link", { name: "作品集平台" })).toHaveAttribute(
      "href",
      "/types/portfolio-platform",
    );
    expect(screen.getByRole("link", { name: "媒体杂志" })).toHaveAttribute(
      "href",
      "/types/media-magazine",
    );
    expect(screen.getByRole("link", { name: "奖项榜单" })).toHaveAttribute(
      "href",
      "/types/award-directory",
    );
    expect(screen.getByRole("link", { name: "垂直资料库" })).toHaveAttribute(
      "href",
      "/types/vertical-archive",
    );
    expect(screen.getByRole("link", { name: "独立案例" })).toHaveAttribute(
      "href",
      "/types/independent-case",
    );
    expect(screen.getByRole("link", { name: "/data/sites.json" })).toHaveAttribute(
      "href",
      "/data/sites.json",
    );
    expect(screen.getByRole("link", { name: "/llms.txt" })).toHaveAttribute("href", "/llms.txt");
    expect(screen.getByRole("link", { name: "来源推文" })).toHaveAttribute(
      "href",
      "https://x.com/xiaoerzhan/status/2050427465714352451",
    );
    expect(screen.getByRole("heading", { name: "审美网站收藏册" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "精选入口" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "资源库" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "搜索网站" })).toBeInTheDocument();
    expect(screen.getByLabelText("收藏统计")).toHaveTextContent("15");
    expect(screen.getByLabelText("收藏统计")).toHaveTextContent("6");
  });
});
