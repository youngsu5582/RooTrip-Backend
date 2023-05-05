import { PostRating } from "../entities";
import database from "../loaders/database";

export const PostRatingRepository = database.getRepository(PostRating).extend({

})