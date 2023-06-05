import { Service } from "typedi";
import {
  LikeRepository,
  PostRepository,
  UserRepository
} from "../repositories";
import { UseBefore } from "routing-controllers";
import { checkAccessToken } from "../middlewares/AuthMiddleware";
import { GenderType } from "../common";

@Service()
@UseBefore(checkAccessToken)
export class MypageService {
  private readonly _userRepository: typeof UserRepository;
  private readonly _likeRepository: typeof LikeRepository;
  private readonly _postRepository: typeof PostRepository;
  constructor() {
    this._userRepository = UserRepository;
    this._likeRepository = LikeRepository;
    this._postRepository = PostRepository;
  }

  public async uploadProfileImage(userId:string, imgUrl:string) {
    return await this._userRepository.uploadProfileImage(userId,imgUrl)
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

  public async uploadPostList(userId: string) {
    return await this._postRepository.getPostListById(userId);
  }

  public async deleteUser(userId: string) {
    return await this._userRepository.withdrawal(userId);
  }
}
