import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sites } from "../data/sites";
import { SiteCard } from "./SiteCard";

describe("SiteCard", () => {
  it("renders a polished placeholder when screenshot capture failed", () => {
    render(<SiteCard site={{ ...sites[0], screenshotStatus: "failed" }} />);

    expect(screen.getByText("截图暂不可用")).toBeInTheDocument();
    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Pinterest 网站截图" })).not.toBeInTheDocument();
  });

  it("falls back to the placeholder when the screenshot image fails to load", () => {
    render(<SiteCard site={{ ...sites[0], screenshotStatus: "captured" }} />);

    const image = screen.getByRole("img", { name: "Pinterest 网站截图" });
    fireEvent.error(image);

    expect(screen.getByText("仍可查看详情与访问原站")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Pinterest 网站截图" })).not.toBeInTheDocument();
  });
});
