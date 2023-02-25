import { env } from "../loaders/env";
import session, * as Session from 'express-session';
import { Application } from "express";

import expressMySqlSession from "express-mysql-session";


export function useSession(app: Application){
    const database = env.database;
    const MySqlStore = expressMySqlSession(Session);
    const Store = new MySqlStore(database);
      
    app.use(session({   
        secret:env.app.sessionSecret,
        resave:false,
        saveUninitialized:false,
        store: Store
    }))
}