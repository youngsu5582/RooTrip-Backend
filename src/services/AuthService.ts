import { Service } from "typedi";
import { LocalUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { CustomJwtPayload, SocialLoginType } from "../common";
import { addBlacklist } from "../utils/Redis";
import { User } from "../entities";
import typia from "typia";
import { ALREADY_EXISTED_EMAIL, LOCAL_REGISTER_FAILED, LOGOUT_FAILED, SOCIAL_REGISTER_FAILED } from "../errors/auth-error";
import { ProfileRepository } from "../repositories/ProfileRepository";
@Service()
export class AuthService {
  private readonly _userRepository: typeof UserRepository;
  private readonly _profileRepository: typeof ProfileRepository;
  constructor() {
    this._userRepository = UserRepository;
    this._profileRepository = ProfileRepository;
  }
  public async register(createUserDto: LocalUserDto) {
    const {email,password,...profile} = createUserDto;
    if (await this._userRepository.getByEmail(email) && email !==null) {
      return typia.random<ALREADY_EXISTED_EMAIL>();
    }
    try{
      const user = await this._userRepository.save(this._userRepository.create({email:email,password}));
      await this._profileRepository.save(this._profileRepository.create({userId:user.id,...profile}));
      return user;
    }
    catch{
      return typia.random<LOCAL_REGISTER_FAILED>();
    }
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
      !(await this._profileRepository.findOne({ where: { nickname } }))
    );
  }
  public async getUserById(id: string) {
    return await this._userRepository.getById(id);
  }
  public async socialRegister(createUserDto: SocialLoginType) {
    const {id,name} = createUserDto;
    const user = await this._userRepository.save(
      User.create({id})
    );
     await this._profileRepository.save(this._profileRepository.create({userId:user.id,name}));
    
    
    if (user) 
      return { status: true, data: user };
    else return typia.random<SOCIAL_REGISTER_FAILED>();
  }
  public async logout(jwtPayload: CustomJwtPayload, token: string) {
    const expiresIn = jwtPayload.exp - jwtPayload.iat;
    try{
      await addBlacklist(token, expiresIn);
      await this._userRepository.deleteRefreshTokenById(jwtPayload.userId);
      return true;  
    }
    catch{
      return typia.random<LOGOUT_FAILED>();
    }
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
