import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import DataSource from "./database";
import { Container } from "typedi";
import {
  useContainer as routingUseContainer,
  useExpressServer,
} from "routing-controllers";
import { routingControllerOptions } from "../utils/RoutingConfig";
import morgan from "morgan";
import { logger, stream } from "../utils/Logger";
import { useSwagger } from "../utils/Swagger";
import { useSentry } from "../utils/Sentry";




import { useSession } from "../utils/Session";


declare module "express-session" {
  interface SessionData {
    userId : string
  }
}
export class App{
    public app :express.Application;
    constructor(){
      this.setDatabase();
      
      this.app = express();
      this.setMiddlewares();
    }


    private async setDatabase():Promise<void>{
        try{
            
            
            await DataSource.initialize();

        }
        catch(error){
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
          
          
          
          useExpressServer(this.app,routingControllerOptions);
          
          useSession(this.app);
          useSwagger(this.app);
          useSentry(this.app);

          //await sync();
            
          this.app.listen(port, () => {
            logger.info(`Server is running on http://localhost:${port}`);
          });
        } catch (error) {
          logger.error(error);
        }
      }
}

