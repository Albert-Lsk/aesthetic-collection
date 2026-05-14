import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /data/sites.json", () => {
  it("returns JSON site data with cache headers", async () => {
    const response = GET();
    const payload = await response.json();

    expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
    expect(payload.sites).toHaveLength(15);
  });
});
