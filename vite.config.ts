import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import { VitePWA } from "vite-plugin-pwa";

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
        theme_color: "#ff2171",
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
                src: "/icons/heart.fill.svg",
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
        background_color: "rgba(0, 0, 0, 0.95)",
      },
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
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
