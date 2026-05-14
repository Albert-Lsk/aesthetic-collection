import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("returns plain text guidance with cache headers", async () => {
    const response = GET();
    const text = await response.text();

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(response.headers.get("Content-Type")).toContain("text/plain");
    expect(text).toContain("/data/sites.json");
  });
});
