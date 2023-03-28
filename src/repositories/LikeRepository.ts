import Like from "../entities/Like";
import database from "../loaders/database";


export const LikeRepository =  database.getRepository(Like).extend({
    async checkDuplicate(userId : string,postId:string){
        return Boolean(await this.findOne({where:{userId,postId}}));
    } 
});