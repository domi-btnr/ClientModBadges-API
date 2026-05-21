import { INestApplication } from "@nestjs/common";

/**
 * Returns the base URL of the running application.
 * Normalizes the IPv6 loopback `[::1]` to `localhost` for human-readable output.
 */
export async function getAppUrl(app: INestApplication): Promise<string> {
  return (await app.getUrl()).replace("[::1]", "localhost");
}
