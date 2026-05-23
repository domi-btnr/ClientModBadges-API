import { INestApplication } from "@nestjs/common";

/**
 * Returns the base URL of the running NestJS application.
 * Normalizes the IPv6 loopback `[::1]` to `localhost` for human-readable output.
 *
 * @param {INestApplication} app - The running NestJS application instance.
 * @returns {Promise<string>} The base URL of the application with `[::1]` replaced by `localhost`.
 */
export async function getAppUrl(app: INestApplication): Promise<string> {
  return (await app.getUrl()).replace("[::1]", "localhost");
}
