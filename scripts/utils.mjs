import fs from "fs";
import path from "path";

export const CLIENT_MODS = {
    ALIUCORD: "Aliucord",
    BETTERDISCORD: "BetterDiscord",
    BADGE_VAULT: "BadgeVault",
    ENMITY: "Enmity",
    VELOCITY: "Velocity",
    VENCORD: "Vencord"
};

export const addUser = (userId, mod, badges) => {
    const data = {};
    data[mod] = badges.filter(badge => badge !== "");

    const filePath = path.join(process.cwd(), "users", `${userId}.json`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    else {
        const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
        fs.writeFileSync(filePath, JSON.stringify({ ...existing, ...data }, null, 4));
    }
};