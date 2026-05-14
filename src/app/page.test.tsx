import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the initial collection shell", () => {
    render(createElement(HomePage));

    expect(screen.getByRole("heading", { name: "Aesthetic Collection" })).toBeInTheDocument();
    expect(screen.getByText("审美网站收藏册正在搭建。")).toBeInTheDocument();
  });
});
