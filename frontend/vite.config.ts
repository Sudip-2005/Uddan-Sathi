import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  
  base: "/Uddan-Sathi/",

  resolve: {
    alias: {
      // Use path.join for better cross-platform (Windows/Mac) support
      "@": path.join(process.cwd(), "src"),
    },
  },
});
