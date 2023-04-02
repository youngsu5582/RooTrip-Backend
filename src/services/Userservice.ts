import { UserRepository, FollowerRepository } from "../repositories";
import {Follower} from "../entities";
import { Service } from "typedi";

@Service()
export class UserService{
    constructor(
        private readonly _userRepository : typeof UserRepository,
        private readonly _followerRepository : typeof FollowerRepository
        ){
        this._userRepository = UserRepository;
        this._followerRepository = FollowerRepository;
    };

    public async followUser(followerId:string , followingId:string){
        const follower = await this._userRepository.findOne({where:{id:followerId}});
        const following = await this._userRepository.findOne({where:{id:followingId}});
        if (!follower || !following) {
           return "Not Exist User";
        }

        const followingState = await this._followerRepository.getByFollowingState(followerId,followingId);
        if(followingState){
            return "Already Following";
        }

        const follow = new Follower();
        follow.follower = follower;
        follow.following = following;

        return await this._followerRepository.save(follow);
    }

    public async unfollowUser(followerId:string , followingId:string){
        const followingState = await this._followerRepository.getByFollowingState(followerId,followingId);
        console.log(followingState?.id);
        if(!followingState) {
            return "Not Follow";
        }
        const unfollowState = await this._followerRepository.deleteFollowing(followingState.id);
        if(unfollowState) {
            return "Unfollow"
        }
    }
}