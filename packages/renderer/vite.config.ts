/* eslint-env node */

import vue from "@vitejs/plugin-vue";
import { join } from "path";
import { defineConfig } from "vite";
import renderer from "vite-plugin-electron-renderer";
import esmodule from "vite-plugin-esmodule";

// eslint-disable-next-line no-restricted-imports
import { chrome, node } from "../../.electron-vendors.cache.json";

const PACKAGE_ROOT = __dirname;

export default defineConfig({
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
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
        target: [`chrome${chrome}`, `node${node}`],
        outDir: "dist",
        assetsDir: ".",
        rollupOptions: {
            input: join(PACKAGE_ROOT, "index.html"),
        },
        emptyOutDir: true,
        reportCompressedSize: false,
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
