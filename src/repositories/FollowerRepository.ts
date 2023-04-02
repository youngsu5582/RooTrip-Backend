import { Follower } from "../entities";
import database from "../loaders/database";

export const FollowerRepository = database.getRepository(Follower).extend({
    async getByFollowingState(followerId:string, followingId:string){
        return await this.findOne({
            where:{follower:{id:followerId},following:{id:followingId}},
        })
    },
    async deleteFollowing(followingState:number) {
        return await this.delete({id:followingState})
    }
});