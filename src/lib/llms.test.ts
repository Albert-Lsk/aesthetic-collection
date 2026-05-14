import { describe, expect, it } from "vitest";
import { buildLlmsText } from "./llms";

describe("buildLlmsText", () => {
  it("describes the collection and machine-readable data", () => {
    const text = buildLlmsText();

    expect(text).toContain("Aesthetic Collection");
    expect(text).toContain("/data/sites.json");
    expect(text).toContain("agentNotes");
    expect(text).toContain("/sites/[slug]: inspect one site by slug.");
    expect(text).toContain("/types/[type]: browse sites by website type.");
    expect(text).not.toContain("Planned human route templates");
    expect(text).toContain("Use /, /sites/[slug], and /types/[type] as current human-facing entry points.");
  });
});
