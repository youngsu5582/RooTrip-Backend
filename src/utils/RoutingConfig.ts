import { env } from "../loaders/env";

export const routingControllerOptions = {
  cors: true,
  routePrefix: env.app.apiPrefix,
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
  
  defaultErrorHandler : false,
};
