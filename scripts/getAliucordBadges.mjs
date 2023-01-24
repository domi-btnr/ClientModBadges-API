import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
const baseUrl = "https://api.github.com/repos/Aliucord/badges/contents/users";
const token = process.env.GITHUB_TOKEN;

(async () => {
    try {
        const response = await fetch(baseUrl, { headers: { "Authorization": `Token ${token}` } });
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data)) return;
        const jsonFiles = data.filter(file => file.name.endsWith(".json"));
        const promises = jsonFiles.map(async file => {
            const userId = file.name.replace(".json", "");
            const response = await fetch(file.download_url);
            const data = await response.json();
            addUser(userId, CLIENT_MODS.ALIUCORD, data.roles);
        });
        await Promise.all(promises);
    } catch (e) {
        console.log("Failed to fetch Aliucord badges", e);
    }
})();