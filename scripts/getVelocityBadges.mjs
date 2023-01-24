import fetch from "node-fetch";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const badgeFile = "https://raw.githubusercontent.com/Velocity-Discord/Backend/main/api/Badges.json";

(async () => {
    try {
        const response = await fetch(badgeFile);
        if (!response.ok) return;
        const data = Object.entries((await response.json())).map(([key, value]) => ({ id: key, name: value.name }));
        data.forEach(entry => addUser(entry.id, CLIENT_MODS.VELOCITY, [entry.name]));
    } catch (e) {
        console.log("Failed to fetch Velocity badges", e);
    }
})();