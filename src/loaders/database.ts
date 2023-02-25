
import {env} from './env';  
import { DataSource, createConnection, useContainer} from "typeorm";
import { Post } from "../entities";
import {Container} from 'typeorm-typedi-extensions';
const database = env.database;

export default new DataSource({
        
        type : 'mysql',
        host: env.database.host,
        port: env.database.port,
        username: env.database.username,
        password: env.database.password,
        database: env.database.name,
        logging: "all",
        synchronize:true,
        entities: [__dirname + "/../entities/*{.ts,.js}"],
      })
      

//      return new DataSource();
  // useContainer(Container);
  //     createConnection({
        
  //       type : 'mysql',
  //       host: env.database.host,
  //       port: env.database.port,
  //       username: env.database.username,
  //       password: env.database.password,
  //       database: env.database.name,
  //       logging: "all",
  //       entities: [__dirname + "/../entities/*{.ts,.js}"],
  //     });
// /      return await AppDataSource.initialize();
 