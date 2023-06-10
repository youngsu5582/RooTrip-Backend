import { Trip } from "../entities";
import database from "../loaders/database";

export const TripRepository = database.getRepository(Trip).extend({

  async getSavedTrip(userId: string) {
    const posts = await this
    .createQueryBuilder('trip')
    .select('trip.postId')
    .where("trip.userId = :userId", { userId: userId })
    .getRawMany();

    return posts.map((post) => post.trip_postId);
  }

//   async getSavedTrip(userId: string) {
//     return await this.createQueryBuilder("trip")
//     .where("trip.userId = :userId", { userId: userId })
//     .getMany();
// }
});
