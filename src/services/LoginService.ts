import { Service } from "typedi";
import {
  GoogleUserDto,
  KakaoUserDto,
  NaverUserDto,
  LoginUserDto
} from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { env } from "../loaders/env";
import axios from "axios";
import { encrypt } from "../utils/Crypto";
import typia from "typia";
import { NOT_CORRECT_PASSWORD, NOT_EXISTED_EMAIL, SOCIAL_LOGIN_FAILED } from "../errors/auth-error";
const key = env.key;

@Service()
export class LoginService {
  private readonly _userRepository: typeof UserRepository;
  constructor() {
    this._userRepository = UserRepository;
  }
  public async localLogin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this._userRepository.findOne({ where: { email } });
    
    if (user) {
      const check = await user.comparePassword(password.toString())
      if (check)
        return {data:user};
      else return typia.random<NOT_CORRECT_PASSWORD>();
    } else return typia.random<NOT_EXISTED_EMAIL>();
    
  }
  public async kakaoLogin(code: string) {
    const accessToken = await axios
      .post(
        "https://kauth.kakao.com/oauth/token",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          params: {
            grant_type: "authorization_code",
            client_id: env.key.kakaoRestApi,
            code,
            redirect_uri: env.key.kakaoRedirectUri
          }
        }
      )
      .then((res) => res.data.access_token)
      .catch(() => null);
    const userInfo = await axios
      .post(
        "https://kapi.kakao.com/v2/user/me",
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset",
            Authorization: "Bearer " + accessToken
          }
        }
      )
      .then((res) => res.data)
      .catch(() => typia.random<SOCIAL_LOGIN_FAILED>());
    const result: KakaoUserDto = {
      id: userInfo.id,
      name: userInfo.properties.nickname
    };
    return result;
  }
  public async naverLogin(code: string) {
    const naverTokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${key.NaverClientId}&client_secret=${key.NaverClientSecret}&code=${code}&state=state`;
    const accessToken = await axios
      .post(naverTokenUrl, {}, {})
      .then((res) => res.data.access_token)
      .catch(() => null);
    const userInfo: any = await axios
      .get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((res) => res.data.response)
      .catch(() => typia.random<SOCIAL_LOGIN_FAILED>());
    const id = encrypt(userInfo.id);
    const result: NaverUserDto = {
      id,
      name: userInfo.name,
      gender: userInfo.gender,
      email: "n_"+userInfo.email
    };
    return result;
  }
  public async googleLogin(code: string) {
    const { data } = await axios.post(
      "https://www.googleapis.com/oauth2/v4/token",
      {
        code: code,
        client_id: env.key.googleClientId,
        client_secret: env.key.googleSecretKey,
        grant_type: "authorization_code",
        redirect_uri: "http://rootrip.site:8080/oauth/google/callback"
      }
    );
    const googleAPI = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${data.access_token}`;
    const userInfo = await axios.get(googleAPI, {
      headers: {
        authorization: `Bearer ${data.access_token}`
      }
    });
    const result: GoogleUserDto = {
      id: userInfo.data.id,
      name: userInfo.data.name
    };
    return result;
  }
}
