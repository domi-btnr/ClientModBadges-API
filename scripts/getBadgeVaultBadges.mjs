import axios from "axios";
import * as utils from "./utils.mjs";
import { DEFAULT_BADGE_VAULT_URL, parseBadgeVault } from "./badgeVault.mjs";

const { addUser, CLIENT_MODS } = utils;
const sourceUrl = process.env.BADGE_VAULT_URL || DEFAULT_BADGE_VAULT_URL;
const MAX_ATTEMPTS = 5;

async function getBadgeVaultBadges() {
    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const response = await axios.get(sourceUrl, {
                headers: { "Cache-Control": "no-cache" },
                timeout: 15_000
            });
            const users = parseBadgeVault(response.data);

            for (const { userId, badges } of users) {
                addUser(userId, CLIENT_MODS.BADGE_VAULT, badges);
            }

            console.log(`Loaded BadgeVault badges for ${users.length} users`);
            return;
        } catch (error) {
            lastError = error;
            console.error(`BadgeVault fetch attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);
            if (attempt < MAX_ATTEMPTS) {
                await new Promise(resolve => setTimeout(resolve, attempt * 500));
            }
        }
    }

    throw new Error(`Failed to update BadgeVault badges: ${lastError?.message ?? "unknown error"}`);
}

await getBadgeVaultBadges();
