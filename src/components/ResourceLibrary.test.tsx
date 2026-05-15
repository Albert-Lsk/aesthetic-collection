import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sites } from "../data/sites";
import { ResourceLibrary } from "./ResourceLibrary";

const originalLocation = window.location;

describe("ResourceLibrary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("renders all sites by default", () => {
    render(<ResourceLibrary sites={sites} />);

    expect(screen.getByRole("heading", { name: "下一步：打开一个入口" })).toBeInTheDocument();
    expect(screen.getByText("Filter Desk")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pinterest" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ukiby Non Editions" })).toBeInTheDocument();
  });

  it("filters by search query", () => {
    render(<ResourceLibrary sites={sites} />);

    fireEvent.change(screen.getByLabelText("搜索网站"), { target: { value: "Slideland" } });

    expect(screen.getByRole("heading", { name: "Slideland" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pinterest" })).not.toBeInTheDocument();
  });

  it("filters by type button", () => {
    render(<ResourceLibrary sites={sites} />);

    fireEvent.click(screen.getByRole("button", { name: "奖项榜单" }));

    expect(screen.getByRole("heading", { name: "Awwwards" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Behance" })).not.toBeInTheDocument();
  });

  it("clears filters after a no-match query", () => {
    render(<ResourceLibrary sites={sites} />);

    fireEvent.change(screen.getByLabelText("搜索网站"), {
      target: { value: "site that does not exist" },
    });

    expect(screen.getByText("没有找到匹配的网站")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pinterest" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "清空筛选" }));

    expect(screen.getByRole("heading", { name: "Pinterest" })).toBeInTheDocument();
    expect(screen.queryByText("没有找到匹配的网站")).not.toBeInTheDocument();
  });

  it("limits rendered tags in each card to three", () => {
    render(<ResourceLibrary sites={sites} />);

    const awwwardsCard = screen.getByTestId("site-card-awwwards");
    const tags = within(awwwardsCard).getAllByTestId("site-tag");

    expect(tags).toHaveLength(3);
  });

  it("focuses search with slash and clears filters with Escape", () => {
    render(<ResourceLibrary sites={sites} />);

    fireEvent.keyDown(window, { key: "/" });
    expect(screen.getByLabelText("搜索网站")).toHaveFocus();

    fireEvent.change(screen.getByLabelText("搜索网站"), { target: { value: "Slideland" } });
    expect(screen.queryByRole("heading", { name: "Pinterest" })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("heading", { name: "Pinterest" })).toBeInTheDocument();
  });

  it("only activates card-grid keyboard shortcuts after the grid has focus", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, assign: vi.fn() },
    });

    render(<ResourceLibrary sites={sites} />);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("site-card-dribbble")).not.toHaveFocus();

    screen.getByTestId("site-card-pinterest").focus();
    expect(screen.getByTestId("site-card-pinterest")).toHaveFocus();

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByTestId("site-card-dribbble")).toHaveFocus();

    fireEvent.keyDown(window, { key: "Enter" });
    expect(openSpy).toHaveBeenCalledWith("https://dribbble.com/", "_blank", "noreferrer");

    fireEvent.keyDown(window, { key: "D" });
    expect(window.location.assign).toHaveBeenCalledWith("/sites/dribbble");
  });

  it("does not hijack Enter from focused buttons", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<ResourceLibrary sites={sites} />);

    const awardButton = screen.getByRole("button", { name: "奖项榜单" });
    awardButton.focus();
    fireEvent.keyDown(awardButton, { key: "Enter", bubbles: true });

    expect(openSpy).not.toHaveBeenCalled();
  });
});
