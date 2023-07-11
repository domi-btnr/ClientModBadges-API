import axios from "axios";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const badgeFile = "https://gist.githubusercontent.com/TheCommieAxolotl/58c22cb5e91c71ce85818395dbe80c24/raw/badges.json";
let attempts = 1;

const getAeroBadges = async () => {
    try {
        const { data } = await axios.get(badgeFile, { headers: { "Cache-Control": "no-cache" } });
        const entries = Object.entries(data).map(([id, badges]) => {
            const roles = badges.map(badge => badge.text);
            return { id, roles };
        });
        entries.forEach(entry => addUser(entry.id, CLIENT_MODS.AERO, entry.roles));
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Aero badges after 5 attempts", e);
        else setTimeout(getAeroBadges, 500);
    }
};

getAeroBadges();