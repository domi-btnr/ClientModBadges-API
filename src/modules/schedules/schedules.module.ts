import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { AliucordProvider } from "#providers/aliucord/aliucord.provider.js";
import { BetterDiscordProvider } from "#providers/betterdiscord/betterdiscord.provider.js";
import { VencordProvider } from "#providers/vencord/vencord.provider.js";

import { BadgeSyncService } from "./badge-sync.service.js";
import { AliucordSchedule } from "./client-mods/aliucord.schedule.js";
import { BetterDiscordSchedule } from "./client-mods/betterdiscord.schedule.js";
import { VencordSchedule } from "./client-mods/vencord.schedule.js";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    BadgeSyncService,
    AliucordProvider,
    AliucordSchedule,
    BetterDiscordProvider,
    BetterDiscordSchedule,
    VencordProvider,
    VencordSchedule
  ]
})
export class SchedulesModule {}
