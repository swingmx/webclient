/* eslint-disable no-undef */

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { VitePWA } from "vite-plugin-pwa";
import viteCompression from "vite-plugin-compression";

const path = require("path");

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    svgLoader(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Swing Music",
        short_name: "Swing Music",
        description: "Swing Music",
        theme_color: "#111",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Playlists",
            description: "View your playlists",
            url: "/#/playlists",
            icons: [
              {
                src: "/icons/playlist.svg",
                type: "image/svg+xml",
              },
            ],
          },
          {
            name: "Favorites",
            description: "View your favorites",
            url: "/#/favorites",
            icons: [
              {
                src: "/icons/heart.svg",
                type: "image/svg+xml",
              },
            ],
          },
          {
            name: "Settings",
            description: "Modify settings",
            url: "/#/settings",
            icons: [
              {
                src: "/icons/settings.svg",
                type: "image/svg+xml",
              },
            ],
          },
        ],
        start_url: "/",
        display: "standalone",
        background_color: "rgba(0, 0, 0, 0.95)",
      },
    }),
    viteCompression({
      threshold: 150,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/_variables.scss", "@/assets/scss/_mixins.scss";`,
      },
    },
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
  },
});
