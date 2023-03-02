import { Post } from "../entities";
import database from "../loaders/database";

export const UserRepository =  database.getRepository(Post).extend({
    
})

