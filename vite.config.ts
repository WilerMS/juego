import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const COLOR_CIELO = "#4aa8ff";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Motoconcho",
        short_name: "Motoconcho",
        description: "Sé motoconcho: recoge pasajeros y llévalos rápido por las calles de República Dominicana, esquivando coches, guaguas y baches.",
        lang: "es",
        theme_color: COLOR_CIELO,
        background_color: COLOR_CIELO,
        display: "fullscreen",
        start_url: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        globIgnores: ["modelos/**", "texturas/**"],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/modelos/") || url.pathname.startsWith("/texturas/"),
            handler: "CacheFirst",
            options: {
              cacheName: "modelos-y-texturas",
              expiration: { maxEntries: 200 },
            },
          },
        ],
      },
    }),
  ],
  server: { host: true, port: 5173 },
});
