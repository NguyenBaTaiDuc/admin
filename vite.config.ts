import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['@mui/material/Unstable_Grid2'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      '@mui/material/Grid2': '@mui/material/Unstable_Grid2',
    },
  },
  server: {
    host: 'localhost',
    port: 5173,
  },
});
