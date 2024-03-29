import { In } from "typeorm";
import { Post } from "../entities";
import database from "../loaders/database";

export const PostRepository = database.getRepository(Post).extend({
  async getPostById(postId: string) {
    return await this.findOne({ where: { id: postId }});
  },
  
  async getPostListById(userId: string) {
    return await this.find({ where: { userId },relations:["user","photos"]});
  },
  async getPostsByIds(postIds:string[]){
    return await this.find({where:{id:In(postIds)},select:["id"]})
  },
  async getPostsInfoByIds(postIds:string[]) {
    return await this.find({where:{id:In(postIds)},relations:["user","photos"]});
  },
  async checkUserIdByPostId(userId: string, postId: string) {
    return Boolean(
      await this.findOne({ where: { id: postId, userId} })  
    );
  },
  async getMostLikedPostsToday() {
    const today = new Date().setHours(0, 0, 0, 0);
    return await this.createQueryBuilder("post")
      .where("post.created_at >=today", { today })
      .limit(6)
      .getMany();
  },
  async getRecentPosts(){
    
    return await this.createQueryBuilder("post").select("post.id").orderBy("created_at").getMany();
  },
  async getTotalCount(postId:string){
    return await this.findOne({where:{id:postId},select:["viewCount"]});
    //return Number(await this.createQueryBuilder("post").select(['view_count']).where('post.id = postId',{postId}).getOne());
  },

   async getPublicPosts(visibility?:  "public" | "friend" | "private") {
    return await this.find({
      where: {
        visibility: visibility,
      },
    });
   },

   async getPrivatePosts(userId:string, visibility?:  "public" | "friend" | "private") {
    return await this.find({
      where: {
        userId: userId,
        visibility: visibility,
      },
    });
   },

   async getFriendsPosts(following:string[], visibility?:  "public" | "friend" | "private") {
    return await this.find({
      where: {
        userId: In(following),
        visibility: visibility,
      },
    });
   },
  
});
