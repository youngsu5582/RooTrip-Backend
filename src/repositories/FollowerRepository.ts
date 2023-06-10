import { Follower } from "../entities";
import database from "../loaders/database";

export const FollowerRepository = database.getRepository(Follower).extend({
  async getByFollowingState(followerId: string, followingId: string) {
    return await this.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } }
    });
  },
  async deleteFollowing(followingState: number) {
    return await this.delete({ id: followingState });
  },
  async getFollowingUserId(userId: string) {
    const list = await this
    .createQueryBuilder('user')
    .select('following.id')
    .leftJoinAndSelect('user.follower', 'follower')
    .leftJoinAndSelect('user.following', 'following')
    .where('user.follower.id = :id', {id:userId})
    .getRawMany();

    return list.map((followingList) => followingList.following_id);
  },

  async checkFollowList(userId: string) {
    return await this.find({
      where: { follower: { id: userId } },
      relations: ["following"]
    });
  },
  async checkFollowersList(userId: string) {
    return await this.find({
      where: { following: {id:userId}},
      relations: ["follower"]
    })
  }
});
