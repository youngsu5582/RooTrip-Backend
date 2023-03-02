
import {env} from './env';  
import { DataSource} from "typeorm";

const database = env.database;

console.log(database);
export default new DataSource({
        
        type : 'mysql',
        host: env.database.host,
        port: env.database.port,
        username: env.database.username,
        password: env.database.password,
        database: env.database.name,
        logging: "all",
        entities: [__dirname+"/../entities/*{.ts,.js}"],
        connectTimeout:5000,
      })