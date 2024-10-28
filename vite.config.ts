/*
 * @Date: 2024-10-15 16:23:40
 * @LastEditors: lixuedan
 * @FilePath: /vite.config.ts
 * @Description: 头部注释
 */
import { defineConfig } from "vite";
import path from "node:path";
// import { fileURLToPath, URL } from "node:url";
import electron from "vite-plugin-electron/simple";
import polyfillExports from "vite-plugin-electron/polyfill-exports";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
    }),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: "electron/main.ts",
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, "electron/preload.ts"),
      },
      // Ployfill the Electron and Node.js built-in modules for Renderer process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: {},
    }),
    // polyfillExports(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          dark: "#f85959", // 33363A
          theme: "#f85959",
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
      },
      // output: {
      //   format: "es",
      // },
    },
  },
});
