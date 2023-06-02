import { Service } from "typedi";
import { UserRepository} from "../repositories";
import {
    Body,
    Get,
    HttpCode,
    JsonController,
    Post,
    QueryParam,
    Req,
    Res,
    UseBefore
} from "routing-controllers";
import {
    checkAccessToken
  } from "../middlewares/AuthMiddleware";

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

  public async deleteUser(userId: string) {
    return await this._userRepository.withdrawal(userId);
  }

}