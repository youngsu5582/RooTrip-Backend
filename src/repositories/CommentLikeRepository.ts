import CommentLike from "../entities/CommentLike";
import database from "../loaders/database";

export const CommentLikeRepository = database.getRepository(CommentLike).extend({
    async checkDuplicate(userId: string, commentId: string) {
        return Boolean(await this.findOne({ where: { userId, commentId } }));
      }
});