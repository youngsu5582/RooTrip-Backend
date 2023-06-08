import { UserRepository, FollowerRepository } from "../repositories";
import { Service } from "typedi";
import { ProfileRepository } from "../repositories/ProfileRepository";
import typia from "typia";
import { ALREADY_FOLLOWING, FOLLOW_FAILED, NOT_EXISTED_USER, NOT_FOLLOWING, UNFOLLOW_FAILED } from "../errors/user-error";

@Service()
export class UserService {
  constructor(
    private readonly _userRepository: typeof UserRepository,
    private readonly _followerRepository: typeof FollowerRepository,
    private readonly _profileRepository : typeof ProfileRepository,
  ) {
    this._userRepository = UserRepository;
    this._followerRepository = FollowerRepository;
    this._profileRepository = ProfileRepository;
  }
  public async getRandomUser(){
    return (await this._userRepository.createQueryBuilder().orderBy('RAND()').limit(1).getOne()).id;
  }

  public async followUser(followerId: string, followingId: string) {
    try {
      const follower = await this._userRepository.findOne({
        where: { id: followerId }
      });
      const following = await this._userRepository.findOne({
        where: { id: followingId }
      });
      if (!follower || !following) {
        return typia.random<NOT_EXISTED_USER>();
      }

      const followingState = await this._followerRepository.getByFollowingState(
        followerId,
        followingId
      );

      if (followingState) {
        return typia.random<ALREADY_FOLLOWING>();
      }
    }
    catch {
      return typia.random<FOLLOW_FAILED>();
    }
  }

  public async unfollowUser(followingId: string, followerId: string) {
    const followingState = await this._followerRepository.getByFollowingState(
      followerId,
      followingId
    );
    if (!followingState) {
      return typia.random<NOT_FOLLOWING>();
    }

    const unfollowState = await this._followerRepository.deleteFollowing(
      followingState.id
    );
    if (!unfollowState) {
      return typia.random<UNFOLLOW_FAILED>();
    }
  }

  public async followList(userId: string) {
    return await this._followerRepository.checkFollowList(userId);
  }
  public async getProfile(userId:string){
    return await this._profileRepository.getByUserId(userId);

  }
}
