import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sites } from "../data/sites";
import { ResourceLibrary } from "./ResourceLibrary";

describe("ResourceLibrary", () => {
  it("renders all sites by default", () => {
    render(<ResourceLibrary sites={sites} />);

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
});
