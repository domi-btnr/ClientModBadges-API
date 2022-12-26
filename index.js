const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

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

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
