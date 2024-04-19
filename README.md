# ClientModBadges-API

This API allows you to retrieve user badges for various discord client mods.

### Supported client mods:

- [Aero](https://github.com/aero-mod/aero)
- [Aliucord](https://github.com/Aliucord/Aliucord)
- [BetterDiscord](https://github.com/BetterDiscord/BetterDiscord)
- [BadgeVault](https://github.com/WolfPlugs/BadgeVault)
- [Enmity](https://github.com/enmity-mod/enmity)
- [Equicord](https://github.com/Equicord/Equicord)
- [Replugged](https://github.com/replugged-org/replugged)
- [Suncord](https://github.com/verticalsync/Suncord)
- [Velocity](https://github.com/Velocity-Discord/Velocity)
- [Vencord](https://github.com/Vendicated/Vencord)

### Endpoints

`/users/:userId` Returns the badges for the user

Example Response:

```json
{
  "Enmity": [
    "supporter",
    {
      "name": "Gluten Free",
      "badge": "https://raw.githubusercontent.com/enmity-mod/badges/main/assets/1032777880180113538.png"
    }
  ],
  "Velocity": ["Translator (de)"]
}
```

`/badges/:clientMod/:badge` Returns the badge icon

The response will be the badge icon in `image/png` format.
