import { Trip } from "../entities";
import database from "../loaders/database";

export const TripRepository = database.getRepository(Trip).extend({
  async getSavedTrip(userId: string) {
    return await this.createQueryBuilder("trip")
    .where("trip.userId = :userId", { userId: userId })
    .getMany();
}
});
