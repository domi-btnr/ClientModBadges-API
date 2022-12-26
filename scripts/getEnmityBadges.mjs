import fetch from "node-fetch";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.github.com/repos/enmity-mod/badges/contents";

(async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    const jsonFiles = data.filter(file => file.name.endsWith(".json"));
    const promises = jsonFiles.map(async file => {
        const userId = file.name.replace(".json", "");
        const response = await fetch(file.download_url);
        const data = JSON.stringify(await response.json()).replace(userId, "");
        addUser(userId, CLIENT_MODS.ENMITY, JSON.parse(data));
    });
    await Promise.all(promises);
})();