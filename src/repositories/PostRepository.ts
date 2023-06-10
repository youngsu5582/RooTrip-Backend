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
    return await this.find({where:{id:In(postIds)}})
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
  }

   // async getPublicPostsByIds(postIds:string[]) {
  //   return await this.find({
  //     where: [
  //       {id:In(postIds)},
  //       {visibility: 'public'}
  //     ],
  //   })
  // },

   // async getPrivatePostsByIds(postIds:string[]) {
  //   return await this.find({
  //     where: [
  //       {id:In(postIds)},
  //       {visibility: 'private'}
  //     ],
  //   })
  // },

   // async getFriendsPostsByIds(postIds:string[]) {
  //   return await this.find({
  //     where: [
  //       {id:In(postIds)},
  //       {visibility: 'friends'}
  //     ],
  //   })
  // },
  
});
