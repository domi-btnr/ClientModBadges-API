import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.github.com/repos/WolfPlugs/BadgeVault/contents/User";
const token = process.env.GITHUB_TOKEN;
let attempts = 1;

const getBadgeVaultBadges = async () => {
    try {
        const response = await axios.get(baseUrl, { headers: { Authorization: `Token ${token}`, "Cache-Control": "no-cache" } });
        if (!response.status === 200) return;
        const data = response.data;
        if (!Array.isArray(data)) return;
        const jsonFiles = data.filter(file => file.name.endsWith(".json"));
        const promises = jsonFiles.map(async file => {
            const userId = file.name.replace(".json", "");
            const response = await axios.get(file.download_url);
            const _data = Array.isArray(response.data) ? response.data : [response.data];
            const result = _data.map(item => {
                return { name: item.name, badge: item.badge };
            });
            addUser(userId, CLIENT_MODS.BADGE_VAULT, result);
        });
        await Promise.all(promises);
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get BadgeVault badges after 5 attempts", e);
        else setTimeout(getBadgeVaultBadges, 500);
    }
};

getBadgeVaultBadges();