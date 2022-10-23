const path = require("path");
const UnpluginVueRouter = require("unplugin-vue-router/webpack").default;

module.exports = {
    lintOnSave: true,
    css: {
        loaderOptions: {
            scss: {
                additionalData: `
                    @use "@/assets/styles/_utils.scss";
                `,
            },
        },
    },
    configureWebpack: {
        devtool: "source-map", // keeping source maps in production for now as it makes for better error reporting
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto",
                },
            ],
        },
    },
    pluginOptions: {
        /**
         * Vue CLI Plugin Electron Builder
         * See: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html#configuration
         */
        electronBuilder: {
            mainProcessFile: "src/main.ts",
            mainProcessWatch: ["src/main.ts", "src/main-window.ts"],
            rendererProcessFile: "src/render.ts",
            customFileProtocol: "bar:/",
            nodeIntegration: true,
            externals: ["steamworks.js"],
            builderOptions: {
                appId: "beyond-all-reason",
                productName: "Beyond All Reason",
                directories: {
                    buildResources: "build",
                },
                extraResources: [
                    {
                        from: "resources",
                        to: ".",
                        filter: "**/*",
                    },
                ],
                win: {
                    target: ["nsis"],
                    //requestedExecutionLevel: "requireAdministrator",
                },
                nsis: {
                    oneClick: false,
                    perMachine: true,
                    allowToChangeInstallationDirectory: true,
                },
                linux: {
                    target: ["AppImage"],
                    category: "Game",
                },
                publish: ["github"],
            },
            chainWebpackRendererProcess: (config) => {
                config.target("electron-renderer");
                config
                    .plugin("unplugin")
                    .use(
                        UnpluginVueRouter({
                            routesFolder: "src/components/views",
                            importMode: "sync",
                            dts: "./src/typed-router.d.ts",
                        })
                    )
                    .before("cache-loader");
            },
        },
    },
};
