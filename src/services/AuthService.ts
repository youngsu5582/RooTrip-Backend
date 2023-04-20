import { Service } from "typedi";
import { LocalUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { CustomJwtPayload, ResponseType, SocialLoginType } from "../common";
import { addBlacklist } from "../utils/Redis";
import { User } from "../entities";
@Service()
export class AuthService {
  private readonly _userRepository: typeof UserRepository;
  constructor() {
    this._userRepository = UserRepository;
  }
  public async register(createUserDto: LocalUserDto) {
    let result: ResponseType;
    const email = createUserDto.email;
    if (await this._userRepository.getByEmail(email)) {
      result = {
        status: false,
        message: "이메일이 중복입니다."
      };
      return result;
    }
    const user = await this._userRepository
      .save(User.create({ ...createUserDto }))
      .catch(() => null);
    if (user) result = { status: true, message: "회원가입 성공" };
    else result = { status: false, message: "회원가입에 실패했습니다." };
    return result;
  }

  public async validateUserToken(id: string, refreshToken: string) {
    return await this._userRepository.findOne({ where: { id, refreshToken } });
  }
  public async saveRefreshToken(id: string, refreshToken: string) {
    return await this._userRepository.update({ id }, { refreshToken });
  }
  public async checkDuplicateEmail(email: string) {
    return Boolean(!(await this._userRepository.getByEmail(email)));
  }
  public async checkDuplicateNickname(nickname: string) {
    return Boolean(
      !(await this._userRepository.findOne({ where: { nickname: nickname } }))
    );
  }
  public async getUserById(id: string) {
    return await this._userRepository.getById(id);
  }
  public async socialRegister(createUserDto: SocialLoginType) {
    const user = await this._userRepository.save(
      User.create({ ...createUserDto })
    );
    let result: ResponseType;
    if (user) result = { status: true, data: user };
    else result = { status: false, message: "회원가입에 실패했습니다." };
    return result;
  }
  public async logout(jwtPayload: CustomJwtPayload, token: string) {
    const expiresIn = jwtPayload.exp - jwtPayload.iat;
    await addBlacklist(token, expiresIn);

    return await this._userRepository.deleteRefreshTokenById(jwtPayload.userId);
  }
  public async changePassword(email: string, newPassword: string) {
    const user = await this._userRepository.findOne({ where: { email } });
    if (user) {
      user.password = newPassword;
      const result = await this._userRepository.save(user);
      if (result) return true;
      else return false;
    } else return new Error("유저 정보 변경 실패!");
  }
}
