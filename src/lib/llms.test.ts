import { describe, expect, it } from "vitest";
import { buildLlmsText } from "./llms";

describe("buildLlmsText", () => {
  it("describes the collection and machine-readable data", () => {
    const text = buildLlmsText();

    expect(text).toContain("Aesthetic Collection");
    expect(text).toContain("/data/sites.json");
    expect(text).toContain("agentNotes");
    expect(text).toContain("Planned human route templates");
    expect(text).toContain("Treat /sites/[slug] and /types/[type] as planned route templates until those pages exist.");
  });
});
