import { Service } from "typedi";
import { UserRepository} from "../repositories";
import {
    UseBefore
} from "routing-controllers";
import {
    checkAccessToken
  } from "../middlewares/AuthMiddleware";
import { GenderType } from "../common";

@Service()
@UseBefore(checkAccessToken)
export class MypageService {
  private readonly _userRepository: typeof UserRepository;
  constructor() {
    this._userRepository = UserRepository;
  }

  public async changeNickname(userId:string, nickname:string) {
    return await this._userRepository.updateNickname(userId, nickname);
  }

  public async changePassword(userId:string, newPassword:string) {
    const user = await this._userRepository.updatePassword(userId);
    if(user) {
      user.password = newPassword;
      const result = await this._userRepository.save(user);
      if(result) return true;
      else return false;
    } else return new Error("비밀번호 변경 실패!");
  }

  public async changeGender(userId:string, gender:GenderType) {
    return await this._userRepository.updateGender(userId, gender);
  }

  public async deleteUser(userId: string) {
    return await this._userRepository.withdrawal(userId);
  }

}