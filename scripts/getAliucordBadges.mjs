import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.github.com/repos/Aliucord/badges/contents/users";
const token = process.env.GITHUB_TOKEN;
let attempts = 1;

const transformData = (data) => {
    const roles = data.roles;
    const custom = data.custom || [];
    const transformedCustom = custom.map(badge => ({ name: badge.text, badge: badge.url }));
    return [...roles, ...transformedCustom];
};

const getAliucordBadges = async () => {
    try {
        const response = await axios.get(baseUrl, { headers: { Authorization: `Token ${token}`, "Cache-Control": "no-cache" } });
        if (response.status !== 200) return;
        const data = response.data;
        if (!Array.isArray(data)) return;
        const jsonFiles = data.filter(file => file.name.endsWith(".json"));
        const promises = jsonFiles.map(async file => {
            const userId = file.name.replace(".json", "");
            const response = await axios.get(file.download_url);
            const data = response.data;
            addUser(userId, CLIENT_MODS.ALIUCORD, transformData(data));
        });
        await Promise.all(promises);
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Aliucord badges after 5 attempts", e);
        else setTimeout(getAliucordBadges, 500);
    }
};

getAliucordBadges();