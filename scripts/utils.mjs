import fs from "fs";
import path from "path";

export const CLIENT_MODS = {
    AERO: "Aero",
    ALIUCORD: "Aliucord",
    BETTERDISCORD: "BetterDiscord",
    BADGE_VAULT: "BadgeVault",
    ENMITY: "Enmity",
    EQUICORD: "Equicord",
    SUNCORD: "Suncord",
    VELOCITY: "Velocity",
    VENCORD: "Vencord"
};

export const addUser = (userId, mod, badges) => {
    let data = {};
    data[mod] = badges.filter(badge => {
        if (typeof badge === "string") return badge !== "";
        else return badge.hasOwnProperty("name") && badge.hasOwnProperty("badge") && badge.name !== "" && badge.badge !== "";
    });

    data = Object.fromEntries(Object.entries(data).filter(([, value]) => value.length > 0));
    if (Object.keys(data).length === 0) return;

    const filePath = path.join(process.cwd(), "users", `${userId}.json`);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    else {
        const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
        fs.writeFileSync(filePath, JSON.stringify({ ...existing, ...data }, null, 4));
    }
};