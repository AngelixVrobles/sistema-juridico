import type { NextConfig } from "next";
import path from "path";

const isElectronBuild = process.env.BUILD_TARGET === "electron";

const nextConfig: NextConfig = {
  // Standalone output para el build de Electron (incluye server.js autónomo)
  ...(isElectronBuild && { output: "standalone" }),

  turbopack: {
    root: path.resolve(__dirname),
  },

  // Permitir que Electron sirva los archivos de subida desde userData en producción
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
