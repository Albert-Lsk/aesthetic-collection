import { describe, expect, it } from "vitest";
import {
  githubPagesBasePath,
  githubPagesUrl,
  repositoryDescription,
  repositoryName,
  repositoryOwner,
  repositoryTopics,
} from "./site";

describe("site publishing config", () => {
  it("keeps GitHub Pages paths aligned with the repository", () => {
    expect(repositoryOwner).toBe("Albert-Lsk");
    expect(repositoryName).toBe("aesthetic-collection");
    expect(githubPagesBasePath).toBe("/aesthetic-collection");
    expect(githubPagesUrl).toBe("https://albert-lsk.github.io/aesthetic-collection/");
  });

  it("provides GitHub About metadata", () => {
    expect(repositoryDescription).toContain("humans and AI agents");
    expect(repositoryTopics).toEqual([
      "design-resources",
      "aesthetic",
      "curation",
      "nextjs",
      "ai-agents",
      "llms-txt",
    ]);
  });
});
