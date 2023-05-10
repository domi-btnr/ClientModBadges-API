import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.github.com/repos/enmity-mod/badges/contents";
const token = process.env.GITHUB_TOKEN;
let attempts = 1;

const getEnmityBadges = async () => {
    try {
        const response = await axios.get(baseUrl, { headers: { Authorization: `Token ${token}`, "Cache-Control": "no-cache" } });
        if (!response.status === 200) return;
        const data = response.data;
        if (!Array.isArray(data)) return;
        const jsonFiles = data.filter(file => file.name.endsWith(".json"));
        const promises = jsonFiles.map(async file => {
            const userId = file.name.replace(".json", "");
            const response = await axios.get(file.download_url);
            const data = await Promise.all(response.data.map(async badge => {
                if (!badge.includes(userId)) return badge;
                const { data } = await axios.get(`https://raw.githubusercontent.com/enmity-mod/badges/main/data/${badge}.json`, { headers: { "Cache-Control": "no-cache" } });
                return { name: data.name, badge: data.url.dark };
            }));
            addUser(userId, CLIENT_MODS.ENMITY, data);
        });
        await Promise.all(promises);
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Enmity badges after 5 attempts", e);
        else setTimeout(getEnmityBadges, 500);
    }
};

getEnmityBadges();