const app = require("express")();

const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const fs = require("fs");
const path = require("path");

const cache = new Map();
const EXPIRES = 1000 * 60 * 60;

app.get("/", (_, res) => res.redirect("https://github.com/HypedDomi/ClientModBadges-API"));

app.get("/users", async (req, res) => {
    const userId = req.query.user;
    if (!userId) return res.status(400).json({ error: "No user id provided" });

    let _data = {};
    if (cache.has(userId) && cache.get(userId).expires > Date.now()) _data.replugged = cache.get(userId).badges;
    else {
        const resp = await fetch(`https://replugged.dev/api/v1/users/${userId}`);
        const body = (await resp.json())?.badges;
        if (body) {
            const badges = Object.keys(body).filter(key => body[key] === true);
            if (badges.length) _data.replugged = badges;
            cache.set(userId, { badges, expires: Date.now() + EXPIRES });
        }
    }

    const filePath = path.join(__dirname, "users", `${userId}.json`);
    if (fs.existsSync(filePath)) fs.readFile(filePath, "utf8", (err, data) => {
        if (!err) _data = { ..._data, ...JSON.parse(data) };
    });

    return res.json(_data);
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
