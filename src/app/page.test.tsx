import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the resource library homepage", () => {
    render(createElement(HomePage));

    expect(screen.getByRole("heading", { name: "审美网站收藏册" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "精选入口" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "资源库" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "搜索网站" })).toBeInTheDocument();
    expect(screen.getByLabelText("收藏统计")).toHaveTextContent("15");
    expect(screen.getByLabelText("收藏统计")).toHaveTextContent("6");
  });
});
