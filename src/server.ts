import { App } from "./loaders/app";
import { env } from "./loaders/env";
import { logger } from "./utils/Logger";
import PostCron from "./cron/PostCron";
import RedisCron from "./cron/RedisCron";
try {
  const app = new App();
  const port: number = env.app.port;
  PostCron.start();
  RedisCron.start();
  app.init(port);
} catch (error) {
  logger.error(error);
}
