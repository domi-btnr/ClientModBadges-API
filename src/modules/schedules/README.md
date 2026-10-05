# Schedules

Syncs the badges of each client mod into the database. Every client mod has one schedule that fetches its badges through a provider, maps them to `SyncedBadge`s and replaces that mod's badges in a single transaction. The user endpoints then only read from the database.

Schedules only decide _when_ to sync. _How_ a badge source is fetched lives in its provider under `src/providers` — the same place as sources that are fetched live while handling a request (e.g. Replugged).

## Local Development

The module is only registered when `BADGE_SYNC_ENABLED` is `true`. Every schedule runs on app start, so in watch mode each restart fetches every badge source and can run into rate limits. Set `BADGE_SYNC_ENABLED=false` in your `.env` while developing and run `pnpm db:seed` for local badge data instead.

## Structure

```
schedules/
├── schedules.module.ts           # Registers the ScheduleModule, BadgeSyncService, all providers and schedules
├── badge-sync.schedule.ts        # Base class: run on app start, overlap guard, error handling
├── badge-sync.service.ts         # Replaces a client mod's badges in one transaction
├── client-mods/
│   └── [client-mod].schedule.ts  # Calls the provider + mapper and schedules the sync
├── dto/
│   └── synced-badge.dto.ts       # Intermediate badge shape shared by all schedules
└── utils/
    └── normalize-badges.ts       # Drops invalid badges and duplicates before writing
```

## Adding a New Schedule

1. Create the provider in `src/providers/[client-mod]/` (see its [README](../../providers/README.md)), with a `to-synced-badges.mapper.ts` that maps its DTOs to `SyncedBadge`s.
2. Create `client-mods/[client-mod].schedule.ts` extending `BadgeSyncSchedule`, inject the provider, set `clientMod` and implement `fetchBadges()` as provider call + mapper.
3. Override `run()` with `@Cron(...)` if the source changes on its own. Hardcoded sources don't need a cron, as every schedule already runs on app start.
4. Register both the provider and the schedule in `schedules.module.ts`.

## Guidelines

- `client-mods/` only holds the per-mod schedules; the shared sync logic stays in the module root.
- Keep schedules thin — no HTTP calls or parsing, only provider calls and mapping.
- `fetchBadges()` must throw if any part of a source fails. A partial result would wipe the missing badges, while a thrown error keeps the existing ones. Providers therefore never swallow errors.
- Custom badges with their own image set `image`; built-in badges only set `name` and get their image from the badge assets.
