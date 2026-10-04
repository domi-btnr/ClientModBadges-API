export const DEFAULT_BADGE_VAULT_URL = "https://plugins.obamabot.me/BadgeVault/User/all.json";

export function parseBadgeVault(data) {
    const users = [];

    if (Array.isArray(data)) {
        for (const entry of data) {
            if (!entry || typeof entry !== "object") continue;
            users.push({ userId: String(entry.userId ?? ""), badges: entry.badges });
        }
    } else if (data && typeof data === "object") {
        for (const [userId, badges] of Object.entries(data)) {
            users.push({ userId, badges });
        }
    } else {
        throw new TypeError("BadgeVault returned an unsupported payload");
    }

    const validUsers = users
        .filter(({ userId, badges }) => /^\d+$/.test(userId) && Array.isArray(badges))
        .map(({ userId, badges }) => ({
            userId,
            badges: badges
                .filter(badge => badge && !badge.pending)
                .map(({ name, badge }) => ({ name, badge }))
                .filter(({ name, badge }) => typeof name === "string" && name !== "" && typeof badge === "string" && badge !== "")
        }))
        .filter(({ badges }) => badges.length > 0);

    if (validUsers.length === 0) {
        throw new Error("BadgeVault returned no valid users; refusing to publish an empty dataset");
    }

    return validUsers;
}
