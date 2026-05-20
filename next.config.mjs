const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
const githubPagesBasePath = "/aesthetic-collection";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(isGitHubPages
    ? {
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
      }
    : {}),
};

export default nextConfig;
