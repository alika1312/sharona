import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    // Emit <route>/index.html so Apache serves clean URLs (e.g. /about -> /about/index.html).
    dirStyle: "nested",
    // Not "async": an async module can run before the HTML has finished
    // parsing, so React hydrated a half-built page, hit a mismatch, and threw
    // the prerendered markup away to re-render it (intermittent React #418/#423).
    // "defer" runs once parsing is done, like a plain module script.
    script: "defer",
  },
});
