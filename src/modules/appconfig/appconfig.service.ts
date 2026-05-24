import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppConfig } from "./config.schema";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  /**
   * Get a typed configuration value from the app config schema.
   * @param propertyPath - Key of {@link AppConfig}
   * @returns `AppConfig[K]` — the value for the given key
   */
  get<K extends keyof AppConfig>(propertyPath: K): AppConfig[K] {
    return this.configService.get(propertyPath, { infer: true });
  }

  /**
   * Get a typed configuration value from the app config schema.
   * Throws if the value resolves to `undefined`.
   * @param propertyPath - Key of {@link AppConfig}
   * @returns `Exclude<AppConfig[K], undefined>` — the defined value for the given key
   */
  getOrThrow<K extends keyof AppConfig>(propertyPath: K): Exclude<AppConfig[K], undefined> {
    return this.configService.getOrThrow(propertyPath, { infer: true });
  }
}
