import {  User } from "../entities";
import database from "../loaders/database";

export const UserRepository =  database.getRepository(User).extend({
    
})

