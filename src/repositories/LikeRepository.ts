import Like from "../entities/Like";
import database from "../loaders/database";

export const LikeRepository = database.getRepository(Like).extend({
  async checkDuplicate(userId: string, postId: string) {
    return Boolean(await this.findOne({ where: { userId, postId } }));
  },
  
  async getPostList(userId: string) {
    const posts = await this
    .createQueryBuilder('like')
    .select('like.postId')
    .where("like.userId = :userId", { userId: userId })
    .getRawMany();

    return posts.map((post) => post.like_post_id);
  }
})
