import axios from "axios";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
let attempts = 1;

const getBadgeVaultBadges = async () => {
    try {
        const response = await axios.get("https://plugins.obamabot.me/BadgeVault/User/all.json", { headers: { "Cache-Control": "no-cache" } });
        if (response.status !== 200) throw new Error(`Unexpected status code ${response.status}`);
        const data = response.data;
        if (!data || typeof data !== "object" || Array.isArray(data)) throw new TypeError("BadgeVault returned an unsupported payload");
        for (let [userId, badges] of Object.entries(data)) {
            if (!Array.isArray(badges)) continue;
            badges = badges.filter(badge => badge && !badge.pending)
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
