import type { NextConfig } from "next";

// GitHub Actions sets GITHUB_ACTIONS=true on every run; this keeps local dev
// and `next dev` at the site root while the CI build (GitHub Pages project
// page, served under /Guacamayo/) gets the required basePath/assetPrefix.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "Guacamayo";
const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages has no server, so the default Image Optimization API
  // (/_next/image) can't run there; this serves the original files as-is.
  // A custom loader is used (instead of just `unoptimized: true`) because
  // the built-in unoptimized path does not apply `basePath` to image URLs.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  basePath,
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
  env: {
    // Set here (not just via GITHUB_ACTIONS) so the same literal is inlined
    // into client bundles too -- image-loader.ts can run client-side, where
    // plain (non NEXT_PUBLIC_) process.env vars are not available.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
