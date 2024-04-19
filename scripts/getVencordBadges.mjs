import axios from "axios";
import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;
let attempts = 1;

const getVencordBadges = async () => {
    try {
        const { data } = await axios.get("https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts", { headers: { "Cache-Control": "no-cache" } });
        const matches = data.match(/id: ([0-9n]+)/gs);
        const contributors = matches.map(match => {
            const [, id] = match.match(/id: ([0-9n]+)/s);
            return { id: id.replace("n", ""), badges: ["Contributor"] };
        });
        const { data: donorData } = await axios.get("https://badges.vencord.dev/badges.json", { headers: { "Cache-Control": "no-cache" } });
        const donors = Object.entries(donorData).map(([id, badge]) => {
            const badgesArray = Object.entries(badge).map(([, value]) => ({
                name: value.tooltip,
                badge: value.badge
            }));
            return { id, badges: badgesArray };
        });
        let users = [...contributors, ...donors];
        users = users.reduce((acc, user) => {
            const existingUser = acc.find(u => u.id === user.id);
            if (existingUser) existingUser.badges = [...existingUser.badges, ...user.badges];
            else acc.push(user);
            return acc;
        }, []);
        users.forEach(user => addUser(user.id, CLIENT_MODS.VENCORD, user.badges));
    } catch (e) {
        if (attempts++ > 4) console.error("Failed to get Vencord badges after 5 attempts", e);
        else setTimeout(getVencordBadges, 500);
    }
};

getVencordBadges();