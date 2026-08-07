import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  ssgOptions: {
    // Emit <route>/index.html so Apache serves clean URLs (e.g. /about -> /about/index.html).
    dirStyle: "nested",
    script: "async",
  },
});
