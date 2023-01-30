import fetch from "node-fetch";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
let attempts = 1;

const getVencordBadges = async () => {
    try {
        const response = await fetch("https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts");
        if (!response.ok) return;
        const text = await response.text();
        const matches = text.match(/id: ([0-9n]+)/gs);
        matches.forEach(match => {
            const [, id] = match.match(/id: ([0-9n]+)/s);
            addUser(id.replace("n", ""), CLIENT_MODS.VENCORD, ["Contributor"]);
        });
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Vencord badges after 5 attempts", e);
        else setTimeout(getVencordBadges, 500);
    }
};