import { join } from "path";
import { defineConfig } from "vite";

// eslint-disable-next-line no-restricted-imports
import { node } from "../../.electron-vendors.cache.json";

const PACKAGE_ROOT = __dirname;

export default defineConfig({
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            "@": join(PACKAGE_ROOT, "src"),
            $: join(PACKAGE_ROOT, "../common"),
        },
    },
    build: {
        ssr: true,
        sourcemap: "inline",
        target: `node${node}`,
        outDir: "dist",
        assetsDir: ".",
        minify: process.env.MODE !== "development",
        lib: {
            entry: "src/index.ts",
            formats: ["cjs"],
        },
        rollupOptions: {
            output: {
                entryFileNames: "[name].cjs",
            },
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
});
