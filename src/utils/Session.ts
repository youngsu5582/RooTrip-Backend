// import { env } from "../loaders/env";
// import session, * as Session from 'express-session';
// import { Application } from "express";

// import expressMySqlSession from "express-mysql-session";

/**
 * Token 사용으로 인한 Session 을 사용하지 않는다.
 * 
 * 
 */


// export function useSession(app: Application){
//     const database = env.database;
//     const MySqlStore = expressMySqlSession(Session);
//     const Store = new MySqlStore(database);
//     console.log(Store);
//     app.use(session({   
//         secret:env.app.sessionSecret,
//         resave:false,
//         saveUninitialized:false,
//         store: Store
//     }))
// }   