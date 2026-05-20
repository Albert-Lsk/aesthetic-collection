import { githubPagesBasePath } from "./site";

export function resolvePublicPath(path: string) {
  if (!path.startsWith("/")) {
    return path;
  }

  if (process.env.NEXT_PUBLIC_GITHUB_PAGES !== "true") {
    return path;
  }

  return `${githubPagesBasePath}${path}`;
}
