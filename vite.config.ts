import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import zmpVitePlugin from "zmp-vite-plugin";
import tsConfigPaths from "vite-tsconfig-paths";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), zmpVitePlugin(), tsConfigPaths(), UnoCSS()],
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].module.js",
        chunkFileNames: "assets/[name].[hash].module.js",
      },
    },
  },
});
