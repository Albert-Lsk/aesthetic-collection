import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const ignoredPaths = [
  ".next/**",
  ".worktrees/**",
  "node_modules/**",
  "public/screenshots/**",
  "coverage/**"
];

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: ignoredPaths
  }
];

export default eslintConfig;
