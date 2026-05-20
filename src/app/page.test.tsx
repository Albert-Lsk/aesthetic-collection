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
    expect(screen.getByRole("heading", { name: "找一个审美参考入口" })).toBeInTheDocument();
    expect(screen.getByText("第一步：搜索或选择分类")).toBeInTheDocument();
    expect(screen.getByText("Search by task")).toBeInTheDocument();
    expect(screen.getByText("Filter by type")).toBeInTheDocument();
    expect(screen.getByText("Open site")).toBeInTheDocument();
    expect(screen.getByText("Read detail")).toBeInTheDocument();
    expect(screen.getByLabelText("精选视觉索引墙")).toHaveTextContent("Awwwards");
    expect(screen.getByLabelText("精选视觉索引墙")).toHaveTextContent("Designspiration");
    expect(screen.getByLabelText("精选视觉索引墙")).toHaveTextContent("Slideland");
    expect(screen.getByLabelText("结构化数据摘要")).toHaveTextContent("15");
    expect(screen.getByRole("link", { name: "Agent readable" })).toHaveAttribute("href", "/llms.txt");
    expect(screen.getByRole("heading", { name: "精选入口" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "下一步：打开一个入口" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "搜索网站" })).toBeInTheDocument();
  });
});
