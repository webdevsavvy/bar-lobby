if (process.env.VITE_APP_VERSION === undefined) {
    const now = new Date();
    process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
    files: ["packages/**/dist/**"],
    directories: {
        output: "dist",
        buildResources: "buildResources",
    },
    productName: "Beyond All Reason",
    extraResources: [
        {
            from: "resources",
            to: ".",
            filter: "**/*",
        },
    ],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION,
    },
    win: {
        target: ["nsis", "portable"],
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
};

module.exports = config;
