import * as utils from "./utils.mjs";
const { addUser, CLIENT_MODS } = utils;

(() => {
    const DEVS = [
        "249746236008169473", // Zerebos
        "415849376598982656", // Strencher
        "515780151791976453", // Doggybootsy
        "917630027477159986", // zrodevkaan
        "76052829285916672", // samfundev
    ];
    DEVS.forEach(dev => addUser(dev, CLIENT_MODS.BETTERDISCORD, ["developer"]));
})();
