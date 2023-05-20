import Comment from "../entities/Comment";
import database from "../loaders/database";

export const CommentRepository = database.getRepository(Comment).extend({

});