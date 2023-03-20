import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParam,
  Res,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services";
import { OpenAPI } from "routing-controllers-openapi";
import { LocalUserDto, LoginUserDto } from "../dtos/UserDto";
import { Response } from "express";
import { generateAccessToken, generateToken } from "../utils/jwToken";
import { checkAccessToken, checkRefreshToken } from "../middlewares/AuthMiddleware";
import {  SocialDto } from "../dtos/AuthDto";
import { checkType, SocialLoginType } from "../common";

@JsonController("/auth")
@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private minute = 60;
  @HttpCode(201)
  @Post("/register")
  @OpenAPI({
    summary : "로컬 사용자 회원가입",
    description: "제공된 정보를 가지고 로컬 사용자 회원가입을 진행합니다",
    tags:["Auth"],
    responses:{
      "201":{},
    }
  })
  public async register(
    @Body() userDto: LocalUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.register(userDto);
    return result;
  }

  @HttpCode(201)
  @Post("/login")
  @OpenAPI({
    summary:"로컬 사용자 로그인",
    description: "제공된 정보를 가지고 JWT token 을 발급합니다.",
    tags:["Auth"],
    responses:{
      "201":{},
    }
  })
  public async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const result = await this.authService.localLogin(loginUserDto);

    if (result.status === false) {
      return res.status(200).send(result);
    }
    const user = result.user!;
    const { accessToken, refreshToken } = generateToken(user);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    return {
      status: result.status,
      expire: 15 * this.minute,
      accessToken,
      refreshToken,
    };
  }
  @HttpCode(201)
  @Post("/token/reissue")
  @OpenAPI({
    description: "토큰을 재발급 받습니다.",
    responses: {
      "401": {
        description: "Unauthorized",
      },
    },
    security: [{ bearerAuth: [] }],
  })
  @UseBefore(checkRefreshToken)
  public async refresh(@Res() res: Response) {
    const userId = res.locals.jwtPayload.userId;
    const refreshToken = res.locals.token;

    const user = await this.authService.validateUserToken(userId, refreshToken);
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "유저 정보와 RefreshToken이 일치하지 않습니다.",
      });
    }
    const accessToken = generateAccessToken(user);
    return {
      expire: 15 * this.minute,
      accessToken,
    };
  }
  @HttpCode(200)
  @Get("/check")
  @OpenAPI({
    description: "이메일 , 닉네임 중복확인을 합니다.",
  })
  public async check(@QueryParam('type') type :checkType, @QueryParam('data') data: string) {
    if (type === "email") 
      return await this.authService.checkDuplicateEmail(data);
    else if (type === "nickname")
      return await this.authService.checkDuplicateNickname(data);
    else return;
  }

  @HttpCode(201)  
  @Post("/social")
  @OpenAPI({
    description : "소셜을 통해 로그인을 합니다.",
  })
  public async socialLogin(@Body() socialDto: SocialDto, @Res() res:Response) {
    let data : SocialLoginType;
    const {code,provider} = socialDto;
    
    if(provider==='kakao')
      data = await this.authService.kakaoLogin(code);
    else if (provider==='naver')
      data = await this.authService.naverLogin(code);
    else
      data = await this.authService.googleLogin(code);  
    if(!data){
      return res.status(401).send({
        status: false,
        message: "소설 로그인을 다시 진행해주세요.",
      });
    }
    let user;
    user = await this.authService.getUserById(data.id);
    if(!user){
        const result = await this.authService.socialRegister(data);
        if(!result.status){
          return res.status(200).send(result.message);
        }
        user = result.user!;
    }
    const { accessToken, refreshToken } = generateToken(user);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    return {
      status: true,
      expire: 15 * this.minute,
      accessToken,
      refreshToken,
    };
  }

  @HttpCode(201)
  @Post("/logout")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description : "로그아웃을 합니다.",
  })
  public async logout(@Res()res : Response){
    
      const result = await this.authService.logout(res.locals.jwtPayload,res.locals.token);
      if(result)
        return true;
      else
        return false;

  }

  
}
