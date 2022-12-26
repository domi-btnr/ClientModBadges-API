const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

app.get("/", (req, res) => res.redirect("https://github.com/HypedDomi/ClientModBadges-API"));

app.get("/users", (req, res) => {
    const userId = req.query.user;
    if (!userId) return res.status(400).json({ error: "No user id provided" });

    const filePath = path.join(__dirname, "users", `${userId}.json`);
    if (!fs.existsSync(filePath)) return res.json({});

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) res.sendStatus(500);
        else res.json(JSON.parse(data));
    });
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
