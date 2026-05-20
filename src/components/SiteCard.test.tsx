import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { sites } from "../data/sites";
import { SiteCard } from "./SiteCard";

const originalGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES;

describe("SiteCard", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = originalGitHubPages;
  });

  it("renders a polished placeholder when screenshot capture failed", () => {
    render(<SiteCard site={{ ...sites[0], screenshotStatus: "failed" }} />);

    expect(screen.getByText("截图暂不可用")).toBeInTheDocument();
    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Pinterest 网站截图暂不可用" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Pinterest 网站截图" })).not.toBeInTheDocument();
  });

  it("falls back to the placeholder when the screenshot image fails to load", () => {
    render(<SiteCard site={{ ...sites[0], screenshotStatus: "captured" }} />);

    const image = screen.getByRole("img", { name: "Pinterest 网站截图" });
    fireEvent.error(image);

    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Pinterest 网站截图" })).not.toBeInTheDocument();
  });

  it("prefixes screenshot images for GitHub Pages builds", () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES = "true";

    render(<SiteCard site={{ ...sites[0], screenshotStatus: "captured" }} />);

    expect(screen.getByRole("img", { name: "Pinterest 网站截图" })).toHaveAttribute(
      "src",
      "/aesthetic-collection/screenshots/pinterest.png",
    );
  });
});
