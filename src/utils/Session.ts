import { env } from "../loaders/env";
import Session from 'express-session';
import MongoStore from 'connect-mongo';
import { Application } from "express";

export function useSession(app: Application){
    const database = env.database;
    const mongoUrl = `mongodb+srv://${database.username}:${database.password}@${database.name}` || undefined;
    const store = MongoStore.create({mongoUrl:mongoUrl});
          
      
    app.use(Session({   
        secret:env.app.sessionSecret,
        resave:false,
        saveUninitialized:false,
        store: store
    }))
  }