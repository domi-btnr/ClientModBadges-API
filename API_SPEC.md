# ClientModBadges API — Specification

## Directory layout

```
src/
├── constants/
│   └── index.ts                     (existing — getAppUrl helper)
├── modules/
│   ├── app.module.ts                (existing)
│   ├── logging/                     (existing)
│   ├── openapi/                     (existing)
│   ├── badges/
│   │   ├── badges.controller.ts
│   │   ├── badges.service.ts
│   │   └── badges.module.ts
│   ├── clientmods/
│   │   ├── clientmods.controller.ts
│   │   ├── clientmods.service.ts
│   │   ├── clientmods.module.ts
│   │   └── dto/
│   │       └── clientmods.dto.ts
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.module.ts
│       └── dto/
│           ├── user-badges.dto.ts
│           └── users-list.dto.ts
├── common/
│   ├── enums/
│   │   └── client-mod.enum.ts
│   └── config/
│       └── client-mods.config.ts
├── prisma/
│   └── prisma.service.ts            (injectable Prisma client wrapper)
prisma/
│   └── schema.prisma
badges/
│   ├── aliucord/
│   │   ├── contributor.png
│   │   ├── dev.png
│   │   └── donor.png
│   ├── betterdiscord/
│   │   └── developer.png
│   ├── enmity/
│   │   ├── contributor.png
│   │   ├── dev.png
│   │   ├── staff.png
│   │   └── supporter.png
│   ├── replugged/
│   │   ├── booster.png
│   │   ├── contributor.png
│   │   ├── developer.png
│   │   ├── early_user.png
│   │   ├── hunter.png
│   │   ├── staff.png
│   │   ├── support.png
│   │   └── translator.png
│   └── vencord/
│       └── contributor.png
```

## Environment variables

| Variable       | Default                   | Purpose                                          |
|----------------|---------------------------|--------------------------------------------------|
| `PORT`         | `8080`                    | HTTP server port                                 |
| `BASE_URL`     | `http://localhost:{PORT}`  | Base URL prepended to all local badge image URLs |
| `DATABASE_URL` | —                         | Postgres connection string (required)            |

---

## Endpoints

| Method | Path                        | Description                                      |
|--------|-----------------------------|--------------------------------------------------|
| `GET`  | `/users`                    | Paginated list of all users with their badges    |
| `GET`  | `/users/:userId`            | All badges for a single Discord user             |
| `GET`  | `/badges/:clientMod/:badge` | Serve a badge image (PNG binary)                 |
| `GET`  | `/clientmods`               | List all supported mods with metadata            |

---

## Prisma schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id        // Discord snowflake
  badges    Badge[]
}

// Each row is one badge assignment for one user under one client mod.
// Known badges have a non-null `slug`; custom badges have a non-null `customName` + `imageUrl`.
model Badge {
  id         Int      @id @default(autoincrement())
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String
  clientMod  String   // ClientMod enum value (e.g. "Vencord")
  slug       String?  // known badge slug; null for custom badges
  customName String?  // display name for custom badges
  imageUrl   String?  // external image URL for custom badges; null for known badges

  @@unique([userId, clientMod, slug])   // prevents duplicate known badges
  @@index([userId])
  @@index([clientMod])
}
```

### PrismaService — `src/prisma/prisma.service.ts`

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

Register `PrismaService` as a global provider in a dedicated `PrismaModule` (exported so every feature module can inject it without re-importing the module).

---

## Common types

### `src/common/enums/client-mod.enum.ts`

```typescript
export enum ClientMod {
  Aliucord     = "Aliucord",
  BadgeVault   = "BadgeVault",
  BetterDiscord = "BetterDiscord",
  Enmity       = "Enmity",
  Replugged    = "Replugged",
  Vencord      = "Vencord",
}
```

### `src/common/config/client-mods.config.ts`

```typescript
import { ClientMod } from "../enums/client-mod.enum";

export interface KnownBadge {
  slug: string;   // matches the badge filename without .png
  name: string;   // display name shown in API responses
}

export interface ClientModConfig {
  displayName: string;
  website:     string;
  deprecated:  boolean;
  knownBadges: KnownBadge[];
}

export const CLIENT_MOD_CONFIG: Record<ClientMod, ClientModConfig> = {
  [ClientMod.Aliucord]: {
    displayName: "Aliucord",
    website:     "https://aliucord.com",
    deprecated:  false,
    knownBadges: [
      { slug: "contributor", name: "Contributor" },
      { slug: "dev",         name: "Developer"   },
      { slug: "donor",       name: "Donor"       },
    ],
  },
  [ClientMod.BadgeVault]: {
    displayName: "BadgeVault",
    website:     "https://obamabot.me",
    deprecated:  false,
    knownBadges: [], // all badges are custom per-user with external image URLs
  },
  [ClientMod.BetterDiscord]: {
    displayName: "BetterDiscord",
    website:     "https://betterdiscord.app",
    deprecated:  false,
    knownBadges: [
      { slug: "developer", name: "Developer" },
    ],
  },
  [ClientMod.Enmity]: {
    displayName: "Enmity",
    website:     "https://enmity.app",
    deprecated:  true,
    knownBadges: [
      { slug: "contributor", name: "Contributor" },
      { slug: "dev",         name: "Developer"   },
      { slug: "staff",       name: "Staff"       },
      { slug: "supporter",   name: "Supporter"   },
    ],
  },
  [ClientMod.Replugged]: {
    displayName: "Replugged",
    website:     "https://replugged.dev",
    deprecated:  false,
    knownBadges: [
      { slug: "booster",     name: "Booster"      },
      { slug: "contributor", name: "Contributor"  },
      { slug: "developer",   name: "Developer"    },
      { slug: "early_user",  name: "Early User"   },
      { slug: "hunter",      name: "Bug Hunter"   },
      { slug: "staff",       name: "Staff"        },
      { slug: "support",     name: "Support"      },
      { slug: "translator",  name: "Translator"   },
    ],
  },
  [ClientMod.Vencord]: {
    displayName: "Vencord",
    website:     "https://vencord.dev",
    deprecated:  false,
    knownBadges: [
      { slug: "contributor", name: "Contributor" },
    ],
  },
};
```

---

## `GET /users`

Returns a paginated list of every user that has at least one badge stored in the database. `data` is an object keyed by Discord user ID; each value has the same badge shape as `GET /users/:userId`.

### Query parameters

| Parameter | Type    | Default | Description                      |
|-----------|---------|---------|----------------------------------|
| `page`    | integer | `1`     | 1-based page index               |
| `limit`   | integer | `20`    | Items per page (max `100`)       |

### DTOs — `src/modules/users/dto/users-list.dto.ts`

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { UserBadges } from "./user-badges.dto";

export class UsersListMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;

  @ApiProperty({ example: 100 })
  total!: number;
}

export class UsersListResponseDto {
  @ApiProperty({ type: UsersListMetaDto })
  meta!: UsersListMetaDto;

  // Keyed by Discord user ID; each value has the same shape as GET /users/:userId.
  // Dynamic keys — documented via @ApiExtraModels + additionalProperties in the controller.
  @ApiProperty({ type: Object, description: "User badge objects keyed by Discord user ID" })
  data!: Record<string, UserBadges>;
}
```

### Controller (addition to UsersController)

```typescript
@Get()
@ApiOperation({ summary: "List all users with their badges (paginated)" })
@ApiQuery({ name: "page",  required: false, type: Number, example: 1  })
@ApiQuery({ name: "limit", required: false, type: Number, example: 20 })
@ApiOkResponse({ type: UsersListResponseDto })
async listUsers(
  @Query("page",  new DefaultValuePipe(1),  ParseIntPipe) page:  number,
  @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
) {
  return this.usersService.listUsers({ page, limit });
}
```

### Service logic

```typescript
async listUsers({ page, limit }: { page: number; limit: number }) {
  const safeLimit = Math.min(limit, 100);
  const skip = (page - 1) * safeLimit;

  const [total, users] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.user.findMany({
      skip,
      take: safeLimit,
      orderBy: { id: "asc" },
      include: { badges: true },
    }),
  ]);

  // same mapper as getBadgesForUser
  const data = Object.fromEntries(users.map((user) => [user.id, this.mapUserBadges(user)]));

  return {
    meta: {
      page,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
    data,
  };
}
```

### Response example

```json
{
  "meta": { "page": 1, "limit": 20, "total": 3, "totalPages": 1 },
  "data": {
    "123456789012345678": {
      "Vencord": {
        "deprecated": false,
        "badges": [{ "name": "Contributor", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" }]
      }
    },
    "987654321098765432": {
      "Replugged": {
        "deprecated": false,
        "badges": [{ "name": "Developer", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/replugged/developer" }]
      }
    }
  }
}
```

---

## `GET /users/:userId`

### DTOs — `src/modules/users/dto/user-badges.dto.ts`

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { ClientMod } from "../../../common/enums/client-mod.enum";

export class BadgeDto {
  @ApiProperty({ example: "Contributor" })
  name!: string;

  @ApiProperty({ example: "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" })
  image!: string;
}

export class ClientModEntryDto {
  @ApiProperty({ example: false })
  deprecated!: boolean;

  @ApiProperty({ type: [BadgeDto] })
  badges!: BadgeDto[];
}

// Response type — used in service return type annotation
export type UserBadges = Partial<Record<ClientMod, ClientModEntryDto>>;
```

### Controller

```typescript
@Controller("users")
@ApiExtraModels(ClientModEntryDto, BadgeDto)
export class UsersController {
  @Get(":userId")
  @ApiOperation({ summary: "Get all badges for a Discord user" })
  @ApiOkResponse({
    description: "Badges keyed by client mod name. Only mods where the user has badges are included.",
    schema: {
      type: "object",
      additionalProperties: {
        oneOf: [{ $ref: getSchemaPath(ClientModEntryDto) }],
      },
      example: {
        Vencord: {
          deprecated: false,
          badges: [{ name: "Contributor", image: "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" }],
        },
        BadgeVault: {
          deprecated: false,
          badges: [{ name: "Astronaut", image: "https://gb.obamabot.me/1fdb7e114a428c3d7a063f15d7616b59447e490f.png" }],
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: "User not found" })
  async getUserBadges(@Param("userId") userId: string) {
    return this.usersService.getBadgesForUser(userId);
  }
}
```

### Service logic

```typescript
// userId must match /^\d{17,20}$/ — otherwise throw NotFoundException.
// Look up the user (with badges) from the database via PrismaService.
// Throw NotFoundException if no row exists for that userId.
//
// Mapping rules (Badge row → BadgeDto):
//
//   slug is non-null  →  known badge
//                        name  = CLIENT_MOD_CONFIG[mod].knownBadges.find(b => b.slug === slug)?.name ?? slug
//                        image = `${BASE_URL}/badges/${mod.toLowerCase()}/${slug}`
//
//   slug is null      →  custom badge
//                        name  = badge.customName
//                        image = badge.imageUrl  (external URL passed through as-is)
//
// Group Badge rows by clientMod, build Partial<Record<ClientMod, ClientModEntryDto>>,
// omit mods with zero badges.
```

### Response example

```json
{
  "Vencord": {
    "deprecated": false,
    "badges": [
      { "name": "Contributor", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" }
    ]
  },
  "Enmity": {
    "deprecated": true,
    "badges": [
      { "name": "Supporter", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/enmity/supporter" }
    ]
  },
  "BadgeVault": {
    "deprecated": false,
    "badges": [
      { "name": "Astronaut", "image": "https://gb.obamabot.me/1fdb7e114a428c3d7a063f15d7616b59447e490f.png" }
    ]
  }
}
```

---

## `GET /badges/:clientMod/:badge`

Returns a PNG binary (`Content-Type: image/png`).

Validation:
- `clientMod` must case-insensitively match a `ClientMod` enum value → 404 otherwise
- `badge` must match `/^[a-z0-9_-]+$/i` → 404 otherwise (prevents path traversal)
- File must exist at `badges/{mod.toLowerCase()}/{badge.toLowerCase()}.png` → 404 otherwise

Use `res.sendFile(absolutePath)` with `@Res()`.

---

## `GET /clientmods`

### DTOs — `src/modules/clientmods/dto/clientmods.dto.ts`

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class KnownBadgeDto {
  @ApiProperty({ example: "Contributor" })
  name!: string;

  @ApiProperty({ example: "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" })
  image!: string;
}

export class ClientModDto {
  @ApiProperty({ example: "Vencord" })
  id!: string;

  @ApiProperty({ example: "Vencord" })
  displayName!: string;

  @ApiProperty({ example: "https://vencord.dev" })
  website!: string;

  @ApiProperty({ example: false })
  deprecated!: boolean;

  @ApiProperty({ type: [KnownBadgeDto] })
  knownBadges!: KnownBadgeDto[];
}

export class ClientModsResponseDto {
  @ApiProperty({ type: [ClientModDto] })
  clientMods!: ClientModDto[];
}
```

### Service logic

Iterate `Object.values(ClientMod)`, map each to a `ClientModDto` using `CLIENT_MOD_CONFIG`.  
Build `knownBadges[].image` as `${BASE_URL}/badges/${mod.toLowerCase()}/${badge.slug}`.

### Response example

```json
{
  "clientMods": [
    {
      "id": "Vencord",
      "displayName": "Vencord",
      "website": "https://vencord.dev",
      "deprecated": false,
      "knownBadges": [
        { "name": "Contributor", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/vencord/contributor" }
      ]
    },
    {
      "id": "Enmity",
      "displayName": "Enmity",
      "website": "https://enmity.app",
      "deprecated": true,
      "knownBadges": [
        { "name": "Contributor", "image": "https://api.domi-btnr.dev/clientmodbadges/badges/enmity/contributor" },
        { "name": "Developer",   "image": "https://api.domi-btnr.dev/clientmodbadges/badges/enmity/dev"         },
        { "name": "Staff",       "image": "https://api.domi-btnr.dev/clientmodbadges/badges/enmity/staff"       },
        { "name": "Supporter",   "image": "https://api.domi-btnr.dev/clientmodbadges/badges/enmity/supporter"   }
      ]
    }
  ]
}
```

---

## Error responses

All errors use NestJS's default exception shape:

```json
{ "statusCode": 404, "message": "User 123456789012345678 not found", "error": "Not Found" }
```

---

## Data storage

Badge data is stored **only** in Postgres via Prisma (see schema above). No raw user JSON files are kept in the repository. All stored data can be retrieved through `GET /users`.
