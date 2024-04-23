import axios from "axios";
import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;

const getAliucordBadges = async () => {
    try {
        const response = await axios.get("https://aliucord.com/files/badges/data.json", { headers: { "Cache-Control": "no-cache" } });
        if (response.status !== 200) return;
        const data = response.data;
        const users = Object.entries(data.users).map(([id, badges]) => {
            const customBadges = Object.entries(badges.custom ?? {}).map(([, badge]) => ({ name: badge.text, badge: badge.url }));
            return { id, badges: [...badges.roles, ...customBadges] };
        });
        users.forEach(user => addUser(user.id, CLIENT_MODS.ALIUCORD, user.badges));
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Aliucord badges after 5 attempts", e);
        else setTimeout(getAliucordBadges, 500);
    }
};

getAliucordBadges();
