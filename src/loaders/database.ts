
import {env} from './env';  
import { DataSource} from "typeorm";

const database = env.database;


export default new DataSource({
        
        type : 'mysql',
        host: database.host,
        port: database.port,
        username: database.username,
        password: database.password,
        database: database.name,
        logging: "all",
//          synchronize:true,
        connectTimeout:20000,
        acquireTimeout:20000,
        entities: [__dirname+"/../entities/*{.ts,.js}"],
        
      })