import fetch from "node-fetch";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const badgeFile = "https://raw.githubusercontent.com/Velocity-Discord/Backend/main/api/Badges.json";
let attempts = 1;

const getVelocityBadges = async () => {
    try {
        const response = await fetch(badgeFile);
        if (!response.ok) return;
        const data = Object.entries((await response.json())).map(([key, value]) => ({ id: key, name: value.name }));
        data.forEach(entry => addUser(entry.id, CLIENT_MODS.VELOCITY, [entry.name]));
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Velocity badges after 5 attempts", e);
        else setTimeout(getVelocityBadges, 500);
    }
};

getVelocityBadges();