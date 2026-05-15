import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    exclude: ["**/node_modules/**", "**/.next/**", "**/.worktrees/**"],
    setupFiles: ["./src/test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname
    }
  }
});
