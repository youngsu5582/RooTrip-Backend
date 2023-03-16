import { App } from "./loaders/app";
import { env } from "./loaders/env";
import { logger } from "./utils/Logger";

try {
  const app = new App();
  const port: number = env.app.port;
  app.init(port);
} catch (error) {
  logger.error(error);
}
