import { Service } from "typedi";
import { Body, HttpCode, JsonController, Post } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { LoginUserDto } from "../dtos/UserDto";
import { generateToken } from "../utils/jwToken";
import { SocialDto } from "../dtos/AuthDto";
import { AuthService, LoginService } from "../services";
import { createResponseForm } from "../interceptors/Transformer";
import { isErrorCheck } from "../errors";
@JsonController("/auth")
@Service()
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly authService: AuthService
  ) {}
  private readonly minute = 60;
  @HttpCode(201)
  @Post("/login")
  @OpenAPI({
    summary: "로컬 사용자 로그인",
    description: "제공된 정보를 가지고 JWT token 을 발급합니다.",
    tags: ["Auth"],
    responses: {
      "201": {}
    }
  })
  public async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.loginService.localLogin(loginUserDto);
    if(isErrorCheck(result))
      return result;
    const user = result.data;
    const { accessToken, refreshToken } = generateToken(user);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    const data = {
      expire: 15 * this.minute,
      accessToken,
      refreshToken
    };
    return createResponseForm(data);
  }
  
  @HttpCode(201)
  @Post("/social")
  @OpenAPI({
    description: "소셜을 통해 로그인을 합니다."
  })
  public async socialLogin(@Body() socialDto: SocialDto) {
    let userInfo;
    const { code, provider } = socialDto;
    if (provider === "kakao") userInfo = await this.loginService.kakaoLogin(code);
    else if (provider === "naver")
      userInfo = await this.loginService.naverLogin(code);
    else userInfo = await this.loginService.googleLogin(code);
    if(isErrorCheck(userInfo))
      return userInfo;
    let user;
    user = await this.authService.getUserById(userInfo.id);
    if (!user) {
      const result = await this.authService.socialRegister(userInfo);
      if(isErrorCheck(result))
        return result;
      user = result.data!;
    }
    const { accessToken, refreshToken } = generateToken(user);
    
    await this.authService.saveRefreshToken(user.id, refreshToken);
    const data = {
      expire: 15 * this.minute,
      accessToken,
      refreshToken
    };
    return createResponseForm(data,"로그인 성공했습니다.")
  }
}
 