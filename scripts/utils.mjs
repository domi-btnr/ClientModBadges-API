import fs from "fs";
import path from "path";

export const CLIENT_MODS = {
    ALIUCORD: "aliucord",
    BETTERDISCORD: "betterdiscord",
    ENMITY: "enmity",
    VELOCITY: "velocity",
    VENCORD: "vencord"
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