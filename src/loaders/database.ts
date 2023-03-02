
import {env} from './env';  
import { DataSource} from "typeorm";

const database = env.database;


export default new DataSource({
        
        type : 'mysql',
        host: env.database.host,
        port: env.database.port,
        username: env.database.username,
        password: env.database.password,
        database: env.database.name,
        logging: "all",
        connectTimeout:20000,
        acquireTimeout:20000,
        entities: [__dirname+"/../entities/*{.ts,.js}"],
        
      })