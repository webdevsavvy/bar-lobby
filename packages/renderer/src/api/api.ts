import { ipcRenderer } from "electron";
import * as fs from "fs";
import * as path from "path";
import { createRouter, createWebHashHistory, Router } from "vue-router";

import { AlertsAPI } from "@/api/alerts";
import { AudioAPI } from "@/api/audio";
import { CommsAPI } from "@/api/comms";
import { ContentAPI } from "@/api/content/content";
import { GameAPI } from "@/api/game";
import { SessionAPI } from "@/api/session";
import { UtilsAPI } from "@/api/utils";
import { defaultBattle } from "@/config/default-battle";
import { serverConfig } from "@/config/server";
import routes from "@/routes";
import { StoreAPI } from "$/api/store";
import type { Account } from "$/model/account";
import { accountSchema } from "$/model/account";
import type { Info } from "$/model/info";
import type { SettingsType } from "$/model/settings";
import { settingsSchema } from "$/model/settings";

interface API {
    account: StoreAPI<Account>;
    alerts: AlertsAPI;
    audio: AudioAPI;
    comms: CommsAPI;
    content: ContentAPI;
    game: GameAPI;
    info: Info;
    router: Router;
    session: SessionAPI;
    settings: StoreAPI<SettingsType>;
    utils: UtilsAPI;
}

declare global {
    const api: API;
    interface Window {
        api: API;
    }
}

export async function apiInit() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.api = {} as any;

    api.utils = new UtilsAPI();

    api.info = await ipcRenderer.invoke("getInfo");

    const settingsFilePath = path.join(api.info.contentPath, "store", "settings.json");
    api.settings = await new StoreAPI<SettingsType>(settingsFilePath, settingsSchema, true).init();

    await fs.promises.mkdir(api.info.contentPath, {
        recursive: true,
    });

    api.session = new SessionAPI();

    api.router = createRouter({
        history: createWebHashHistory(),
        routes: routes,
    });

    api.router.beforeEach(async (to, from) => {
        if (to.path === "/singleplayer/custom") {
            api.session.offlineBattle.value = defaultBattle();
        } else if (from.path === "/singleplayer/custom") {
            api.session.offlineBattle.value = null;
        }
    });

    api.audio = await new AudioAPI().init();

    const accountFilePath = path.join(api.info.contentPath, "store", "account.json");
    api.account = await new StoreAPI<Account>(accountFilePath, accountSchema).init();

    api.game = new GameAPI();

    api.comms = new CommsAPI(serverConfig);

    api.content = await new ContentAPI().init();

    api.alerts = new AlertsAPI();
}
