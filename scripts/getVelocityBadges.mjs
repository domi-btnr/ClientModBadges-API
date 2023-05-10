import axios from "axios";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const badgeFile = "https://raw.githubusercontent.com/Velocity-Discord/Backend/main/api/Badges.json";
let attempts = 1;

const getVelocityBadges = async () => {
    try {
        const { data } = await axios.get(badgeFile, { headers: { "Cache-Control": "no-cache" } });
        const entries = Object.entries(data).map(([key, value]) => ({ id: key, name: value.name }));
        entries.forEach(entry => addUser(entry.id, CLIENT_MODS.VELOCITY, [entry.name]));
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Velocity badges after 5 attempts", e);
        else setTimeout(getVelocityBadges, 500);
    }
};

getVelocityBadges();