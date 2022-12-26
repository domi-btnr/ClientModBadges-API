import fetch from "node-fetch";

import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;

(async () => {
    const response = await fetch("https://raw.githubusercontent.com/Vendicated/Vencord/main/src/utils/constants.ts");
    const text = await response.text();
    const matches = text.match(/([a-z]+): {[\s\S]+?name: "([^"]+)",[\s\S]+?id: ([0-9n]+)[\s\S]+?}/gs);
    matches.forEach(match => {
        const [, name, displayName, id] = match.match(/([a-z]+): {[\s\S]+?name: "([^"]+)",[\s\S]+?id: ([0-9n]+)[\s\S]+?}/s);
        addUser(id.replace("n", ""), CLIENT_MODS.VENCORD, ["Contributor"]);
    });
})();