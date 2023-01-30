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
        const response = await axios.get(baseUrl, { headers: { "Authorization": `Token ${token}` } });
        if (!response.status === 200) return;
        const data = response.data;
        if (!Array.isArray(data)) return;
        const jsonFiles = data.filter(file => file.name.endsWith(".json"));
        const promises = jsonFiles.map(async file => {
            const userId = file.name.replace(".json", "");
            const response = await axios.get(file.download_url);
            const data = JSON.stringify(response.data).replace(userId, "");
            addUser(userId, CLIENT_MODS.ENMITY, JSON.parse(data));
        });
        await Promise.all(promises);
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Enmity badges after 5 attempts", e);
        else setTimeout(getEnmityBadges, 500);
    }
};

getEnmityBadges();