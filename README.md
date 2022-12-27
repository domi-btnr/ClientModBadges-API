# ClientModBadges-API

This API allows you to retrieve user badges for various discord client mods.

### Supported client mods:

- Aliucord
- BetterDiscord
- Enmity
- Replugged
- Velocity
- Vencord

### Endpoints

`/users/:userId` Returns the badges for the user

Example Response:
```json
{
  "enmity": [
    "supporter"
  ],
  "velocity": [
    "Translator (de)"
  ]
}
```

`/badges/:clientMod/:badge` Returns the badge icon

Example Response:
The response will be the badge icon in `image/png` format.

---
This README was created by ChatGPT