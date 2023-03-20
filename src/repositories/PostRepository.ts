    import { Post } from "../entities";
    import database from "../loaders/database";


    export const PostRepository =  database.getRepository(Post).extend({
    async getPostById(postId:string){
        return await this.findOne({where:{id:postId}});
    },
    async checkUserIdByPostId(userId:string,postId:string){
        return Boolean(await this.findOne({where:{id:postId,user:{id:userId}}}));
    },
    async getMostLikedPostsToday(){
        const today = new Date().setHours(0,0,0,0);
        return await 
        this.createQueryBuilder('post').where('post.created_at >=today',{today})
        .limit(6)
        .getMany();
    }
})
