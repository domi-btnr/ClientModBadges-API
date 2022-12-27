import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;

(() => {
    const DEVS = ["249746236008169473", "415849376598982656"];
    DEVS.forEach(dev => addUser(dev, CLIENT_MODS.BETTERDISCORD, ["developer"]));
})();