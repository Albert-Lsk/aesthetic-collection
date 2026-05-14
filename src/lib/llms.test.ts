import { describe, expect, it } from "vitest";
import { buildLlmsText } from "./llms";

describe("buildLlmsText", () => {
  it("describes the collection and machine-readable data", () => {
    const text = buildLlmsText();

    expect(text).toContain("Aesthetic Collection");
    expect(text).toContain("/data/sites.json");
    expect(text).toContain("agentNotes");
  });
});
