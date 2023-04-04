import { UserRepository, FollowerRepository } from "../repositories";
import {Follower} from "../entities";
import { Service } from "typedi";
import { ResponseType } from "../common";
import { PrivateNetworks } from "aws-sdk";

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
        let message:ResponseType;
        if (!follower || !following) {
            return message = {
                status:false,
                message: `존재하지 않는 회원입니다.`,
            }
        }

        const followingState = await this._followerRepository.getByFollowingState(followerId,followingId);
        if(followingState){
            return message = {
                status:true,
                message: `이미 팔로우중입니다.`,
            }
        }

        const follow = new Follower();
        follow.follower = follower;
        follow.following = following;
        const followInfo = await this._followerRepository.save(follow);
        if(followInfo){
            return message = {
                status:true,
                message: `${followInfo.follower.name}님이 ${followInfo.following.name}님을 팔로우 합니다.`,
            }
        }else{
            return message = {
                status: false,
                message: `팔로우 실패`,
            }
        }
    }

    public async unfollowUser(followingId:string , followerId:string){
        const followingState = await this._followerRepository.getByFollowingState(followerId,followingId);
        let message:ResponseType;
        
        if(!followingState) {
            return message = {
                status:false,
                message: `팔로우중이 아닙니다.`,
            }
        }
        const unfollowState = await this._followerRepository.deleteFollowing(followingState.id);
        if(unfollowState) {
            return message = {
                status:true,
                message: `언팔로우 합니다.`,
            }
        }
    }

    public async followList(userId:string) {
        return await this._followerRepository.checkFollowList(userId);
    }
}