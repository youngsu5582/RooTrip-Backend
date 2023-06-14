import { Service } from "typedi";
import {
  LikeRepository,
  PostRepository,
  TripRepository,
  UserRepository
} from "../repositories";
import { UseBefore } from "routing-controllers";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { GenderType } from "../common";
import { ProfileRepository } from "../repositories/ProfileRepository";
import { ProfileDto } from "../dtos/ProfileDto";
import typia from "typia";
import { NOT_EXISTED_USER } from "../errors/user-error";
import { CHANGE_PASSWORD_FAILED } from "../errors/mypage-error";

@Service()
@UseBefore(checkAccessToken)
export class MypageService {
  private readonly _userRepository: typeof UserRepository;
  private readonly _likeRepository: typeof LikeRepository;
  private readonly _postRepository: typeof PostRepository;
  private readonly _profileRepository: typeof ProfileRepository;
  private readonly _tripRepository: typeof TripRepository;

  constructor() {
    this._userRepository = UserRepository;
    this._likeRepository = LikeRepository;
    this._postRepository = PostRepository;
    this._profileRepository = ProfileRepository;
    this._tripRepository = TripRepository;
  }

  public async uploadProfileImage(userId:string, profileDto:ProfileDto) {
    return await this._profileRepository.uploadProfileImage(userId,profileDto);
  } 

  public async changeNickname(userId: string, nickname: string) {
    return await this._profileRepository.updateNickname(userId, nickname);
  }

  public async changePassword(userId: string, newPassword: string) {
    try {
      const user = await this._userRepository.getById(userId);
      if (user) {
        user.password = newPassword;
        const result = await this._userRepository.save(user);
        if (result) return true;
        else return typia.random<CHANGE_PASSWORD_FAILED>();
      } else return typia.random<NOT_EXISTED_USER>();
    }
    catch {
      return typia.random<CHANGE_PASSWORD_FAILED>();
    }
  }

  public async changeGender(userId: string, gender: GenderType) {
    return await this._profileRepository.updateGender(userId, gender);
  }

  public async likedPostList(userId: string) {
    const likedList = await this._likeRepository.getPostList(userId);
    return await this._postRepository.getPostsInfoByIds(likedList);
  }

  public async savedTripList(userId: string) {
    const trip = await this._tripRepository.getSavedTrip(userId);
    return await this._postRepository.getPostsInfoByIds(trip);
  }

  public async uploadPostList(userId: string) {
    return await this._postRepository.getPostListById(userId);
  }

  public async deleteUser(userId: string) {
    return await this._userRepository.withdrawal(userId);
  }
}
