import axios from "axios";
import * as utils from "./utils.mjs";

const { addUser, CLIENT_MODS } = utils;

let attempts = 1;

const getAliucordBadges = async () => {
    try {
        const { data: donorData } = await axios.get(
            "https://aliucord.com/files/badges/data.json",
            { headers: { "Cache-Control": "no-cache" } }
        );

        const donors = Object.entries(donorData.users).map(([id, badges]) => {
            const { roles } = badges;
            const customBadges = badges.custom ? Object.entries(badges.custom).map(([_, badge]) => ({ name: badge.text, badge: badge.url })) : [];

            const badgeList = [...roles, ...customBadges];

            return {
                id,
                badges: badgeList,
            };
        });

        donors.forEach(user =>
            addUser(user.id, CLIENT_MODS.ALIUCORD, user.badges)
        );
        console.log(donors);
    } catch (e) {
        if (attempts++ > 4)
            console.error("Failed to get Aliucord badges after 5 attempts", e);
        else setTimeout(getAliucordBadges, 500);
    }
};

getAliucordBadges();
