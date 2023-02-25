import { env } from "../loaders/env";
import fs from "fs";
import path from 'path';
import { PostController } from "../controllers/PostController";
export const routingControllerOptions = {
  cors: true,
  routePrefix: env.app.apiPrefix,
  //__dirname+'/../controllers/*{.ts,.js}'
  controllers: [PostController],
  middlewares: [`${__dirname}/../middlewares/*{.ts,.js}`],
  defaultErrorHandler : false,
};
