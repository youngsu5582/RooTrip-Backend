import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import {
  useContainer as routingUseContainer,
  useExpressServer
} from "routing-controllers";
import morgan from "morgan";
import DataSource from "./database";
import { routingControllerOptions } from "../utils/RoutingConfig";
import { logger, stream } from "../utils/Logger";
import { useSwagger } from "./swagger";
import { useSentry } from "./sentry";
import { CustomJwtPayload } from "../common";
import bodyParser from "body-parser";
declare module "express" {
  interface Response {
    locals: {
      jwtPayload: CustomJwtPayload;
      token: string;
    };
  }
}

export class App {
  public app: express.Application;
  constructor() {
    this.setDatabase();
    this.app = express();
    this.setMiddlewares();
  }
  private async setDatabase(): Promise<void> {
    try {
      DataSource.initialize()
        .then(() => logger.info("Mysql Connect!"))
        .catch((err) => logger.error(err));
    } catch (error) {
      logger.error(error);
    }
  }
  private setMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(morgan("combined", { stream }));
  }
  public async init(port: number): Promise<void> {
    try {
      routingUseContainer(Container);
      useExpressServer(this.app, routingControllerOptions);
      useSwagger(this.app);
      useSentry(this.app);
      this.app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}/api-docs`);
      });
    } catch (error) {
      logger.error(error);
    }
  }
}
