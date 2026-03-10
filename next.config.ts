import type { NextConfig } from "next";
import path from "path";

const isElectronBuild = process.env.BUILD_TARGET === "electron";

const nextConfig: NextConfig = {
  // Standalone output para el build de Electron (incluye server.js autónomo)
  ...(isElectronBuild && { output: "standalone" }),

  // Turbopack SOLO para Dev, No para produccion.
  ...(!isElectronBuild && {
    turbopack: {
      root: path.resolve(__dirname),
    },
  }),

  // Permitir que Electron sirva los archivos de subida desde userData en producción
  images: {
    unoptimized: true,
  },

  // Deben de matenerlo externo para evitar que Prisma falle en el empaquetado.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
