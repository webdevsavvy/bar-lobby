import "primevue/resources/primevue.min.css";
import "flag-icons/css/flag-icons.min.css";
import "!/styles/styles.scss";

import * as path from "path";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import type { TransitionProps } from "vue";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import { apiInit } from "@/api/api";
import App from "@/App.vue";
import { clickAwayDirective } from "@/utils/click-away-directive";

declare module "vue-router" {
    interface RouteMeta {
        title?: string;
        order?: number;
        offline?: boolean;
        empty?: boolean;
        blurBg?: boolean;
        transition?: TransitionProps;
    }
}

(async () => {
    await apiInit();

    await setupVue();

    window.addEventListener("keydown", (event) => {
        if (event.code === "F11") {
            event.preventDefault();
            api.settings.model.fullscreen.value = !api.settings.model.fullscreen.value;
        }
    });

    window.addEventListener("beforeunload", async (event) => {
        console.debug("beforeunload", event);
        event.preventDefault();
        if (api.comms.isConnected()) {
            await api.comms.request("c.auth.disconnect", {});
        }
        return event;
    });
})();

async function setupVue() {
    const app = createApp(App);

    app.use(api.router);
    app.use(PrimeVue);

    const i18n = await setupI18n();
    app.use(i18n);

    app.directive("click-away", clickAwayDirective);
    app.directive("tooltip", Tooltip);

    app.mount("#app");

    if (process.env.NODE_ENV !== "production") {
        app.config.globalProperties.window = window;
    }
}

async function setupI18n() {
    const myLocale = Intl.DateTimeFormat().resolvedOptions().locale.split("-")[0];

    const messages: Record<string, Record<string, string>> = {};

    const localeFilePaths = import.meta.glob("../assets/language/*.json");
    for (const filePath in localeFilePaths) {
        const localeCode = path.parse(filePath).name;
        messages[localeCode] = ((await localeFilePaths[filePath]()) as any).default;
    }

    return createI18n({
        locale: myLocale,
        fallbackLocale: "en",
        messages,
        legacy: false,
    });
}
