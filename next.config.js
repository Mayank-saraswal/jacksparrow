/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // Pin the file-tracing root to this project. Without this, Next walks UP the
  // directory tree looking for a lockfile and can land on the Windows user
  // profile (C:\Users\<you>), then crashes scanning the protected
  // "Application Data" junction with EPERM. It also stops the nested
  // referance-landingpage/ lockfile from being mistaken for the workspace root.
  outputFileTracingRoot: import.meta.dirname,
  output: "standalone",
  // Keep build-time file tracing from descending into the design-reference app.
  outputFileTracingExcludes: {
    "*": ["./referance-landingpage/**", "C:/Users/**", "C:\\Users\\**"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["jacksparrow.mayanksaraswal.in", "www.hedwigs.site", "hedwigs.site"],
    },
  },
};

export default config;
