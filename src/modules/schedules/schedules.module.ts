import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";

import { BadgeSyncService } from "./badge-sync.service.js";
import { AliucordSchedule } from "./client-mods/aliucord/aliucord.schedule.js";
import { BetterDiscordSchedule } from "./client-mods/betterdiscord/betterdiscord.schedule.js";
import { VencordSchedule } from "./client-mods/vencord/vencord.schedule.js";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [BadgeSyncService, AliucordSchedule, BetterDiscordSchedule, VencordSchedule]
})
export class SchedulesModule {}
