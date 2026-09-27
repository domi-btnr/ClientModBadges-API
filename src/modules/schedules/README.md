# Schedules

Syncs the badges of each client mod into the database. Every client mod has one schedule that fetches its badge source, maps it to `SyncedBadge`s and replaces that mod's badges in a single transaction. The user endpoints then only read from the database.

Badge sources that are needed live while handling a request (e.g. Replugged) are **not** synced here — they belong in `src/providers`.

## Structure

```
schedules/
├── schedules.module.ts           # Registers the ScheduleModule, BadgeSyncService and all schedules
├── badge-sync.schedule.ts        # Base class: run on app start, overlap guard, error handling, REQUEST_CONFIG
├── badge-sync.service.ts         # Replaces a client mod's badges in one transaction
├── dto/
│   └── synced-badge.dto.ts       # Intermediate badge shape shared by all schedules
├── utils/
│   └── normalize-badges.ts       # Drops invalid badges and duplicates before writing
└── client-mods/
    └── [client-mod]/
        ├── [client-mod].schedule.ts       # Fetches the badge source and schedules the sync
        ├── dto/
        │   └── [name].dto.ts              # Shapes of the badge source's payload
        └── mapper/
            └── to-synced-badges.mapper.ts # Transforms the payload into SyncedBadges
```

## Adding a New Schedule

1. Create `client-mods/[client-mod]/[client-mod].schedule.ts` extending `BadgeSyncSchedule`.
2. Set `clientMod` and implement `fetchBadges()`, using `REQUEST_CONFIG` for HTTP requests.
3. Override `run()` with `@Cron(...)` if the source changes on its own. Hardcoded sources don't need a cron, as every schedule already runs on app start.
4. Register the schedule in `schedules.module.ts`.

## Guidelines

- Keep schedules isolated from the rest of the application — they only depend on Prisma.
- `fetchBadges()` must throw if any part of a source fails. A partial result would wipe the missing badges, while a thrown error keeps the existing ones.
- Custom badges with their own image set `image`; built-in badges only set `name` and get their image from the badge assets.
- DTOs under `dto/` reflect the badge source's contract. Mappers under `mapper/` translate it into `SyncedBadge`s.
