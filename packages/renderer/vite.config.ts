/* eslint-env node */

import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";
import esmodule from "vite-plugin-esmodule";

// eslint-disable-next-line no-restricted-imports
import { chrome } from "../../.electron-vendors.cache.json";

const PACKAGE_ROOT = __dirname;

export default defineConfig({
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            "@": join(PACKAGE_ROOT, "src"),
            "!": join(PACKAGE_ROOT, "assets"),
            $: join(PACKAGE_ROOT, "../common"),
        },
    },
    base: "",
    server: {
        fs: {
            strict: true,
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: "dist",
        assetsDir: ".",
        rollupOptions: {
            input: join(PACKAGE_ROOT, "index.html"),
            output: {
                entryFileNames: "[name].cjs",
            },
        },
        emptyOutDir: true,
        reportCompressedSize: false,
        lib: {
            entry: "src/index.ts",
            formats: ["cjs"],
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "!/styles/_utils.scss";`,
            },
        },
    },
    plugins: [
        vue(),
        renderer({
            resolve() {
                return ["path", "fs", "stream", "os", "child_process", "node-fetch", "spring-map-parser", "sdfz-demo-parser", "tachyon-client", "octokit", "axios"];
            },
        }),
        esmodule(["node-fetch", "spring-map-parser", "sdfz-demo-parser", "tachyon-client", "octokit", "vue-i18n"]),
    ],
});
