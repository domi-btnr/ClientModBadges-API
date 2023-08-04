import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.obamabot.me/v2/badges/getAllUsers";
const API_KEY = process.env.BADGE_VAULT_KEY;
let attempts = 1;

const getBadgeVaultBadges = async () => {
    try {
        const response = await axios.get(`${baseUrl}?key=${API_KEY}`, { headers: { "Cache-Control": "no-cache" } });
        if (!response.status === 200) return;
        const data = response.data;
        if (!Array.isArray(data)) return;
        for (const user of data) {
            let { userId, badges } = user;
            if (!badges) continue;
            badges = badges.filter(badge => !badge.pending)
                .map(item => {
                    return { name: item.name, badge: item.badge };
                });
            if (!badges.length) continue;
            addUser(userId, CLIENT_MODS.BADGE_VAULT, badges);
        }
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get BadgeVault badges after 5 attempts", e);
        else setTimeout(getBadgeVaultBadges, 500);
    }
};

getBadgeVaultBadges();