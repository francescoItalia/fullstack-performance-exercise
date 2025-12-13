import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    /**
     * DEV ONLY: Proxy API requests to backend server.
     * Avoids CORS issues during development.
     * In production, use a reverse proxy (nginx, etc.) or CORS headers.
     */
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Socket.IO proxy (for WebSocket)
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
