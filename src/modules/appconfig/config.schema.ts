import { z } from "zod";

export const CONFIG_SCHEMA = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().positive().default(8080),
    BASE_URL: z.url().optional(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info")
  })
  .transform(schema => {
    return {
      ...schema,
      BASE_URL: schema.BASE_URL ?? `http://localhost:${schema.PORT}`
    };
  });

export type AppConfig = z.infer<typeof CONFIG_SCHEMA>;
