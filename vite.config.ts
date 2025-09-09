import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["192.png", "512.png"],
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Iron Fit",
        short_name: "IronFit",
        description: "Iron Fit progressive web app",
        theme_color: "#0ea5e9",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/192.png", sizes: "192x192", type: "image/png" },
          { src: "/512.png", sizes: "512x512", type: "image/png" },
          { src: "/512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
