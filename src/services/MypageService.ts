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
    return await this._userRepository.updateNickname(userId, nickname);
  }

  public async changePassword(userId: string, newPassword: string) {
    const user = await this._userRepository.updatePassword(userId);
    if (user) {
      user.password = newPassword;
      const result = await this._userRepository.save(user);
      if (result) return true;
      else return false;
    } else return new Error("비밀번호 변경 실패!");
  }

  public async changeGender(userId: string, gender: GenderType) {
    return await this._userRepository.updateGender(userId, gender);
  }

  public async likedPostList(userId: string) {
    const likedList = await this._likeRepository.getPostList(userId);
    const postList = [];

    for (const post of likedList) {
      const postContext = await this._postRepository.getPostById(post.postId);
      postList.push(postContext);
    }
    return postList;
  }

  public async savedTripList(userId: string) {
    const TripList = await this._tripRepository.getSavedTrip(userId);
    const savedList = [];

    for (const post of TripList) {
      const postContext = await this._postRepository.getPostById(post.postId);
      savedList.push(postContext);
    }
    return savedList;
  }

  public async uploadPostList(userId: string) {
    return await this._postRepository.getPostListById(userId);
  }

  public async deleteUser(userId: string) {
    return await this._userRepository.withdrawal(userId);
  }
}
