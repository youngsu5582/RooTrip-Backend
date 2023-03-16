import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
  QueryParams,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateLocalUserDto, LoginUserDto } from "../dtos/UserDto";
import { Response } from "express";
import { generateAccessToken, generateToken } from "../utils/jwToken";
import { checkAccessToken, checkRefreshToken } from "../middlewares/AuthMiddleware";
import { CheckDto, SocialDto } from "../dtos/AuthDto";
import { SocialLoginType } from "../common";



@JsonController("/auth")
@Service()
export class AuthController {
  constructor(private authService: AuthService) {}
  private minute = 60;
  @HttpCode(200)
  @Post("/register")
  @OpenAPI({
    description: "회원가입을 진행합니다",
  })
  @UseBefore()
  public async register(
    @Body() createUserDto: CreateLocalUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.register(createUserDto);
    if (result.status === false) {
      return res.status(200).send(result.message);
    } else {
      return result;
    }
  }

  @HttpCode(200)
  @Post("/login")
  @OpenAPI({
    description: "로그인을 진행합니다",
  })
  @UseBefore()
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
  @HttpCode(200)
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
  public async check(@QueryParams() checkQuery: CheckDto) {
    const { type, data } = checkQuery;
    //Error 처리 해야함. + Refactoring
    if (type === "email") 
    return await this.authService.checkDuplicateEmail(data);
    else if (type === "nickname")
      return await this.authService.checkDuplicateNickname(data);
    else return;
  }

  @HttpCode(200)  
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
    console.log(accessToken);
    await this.authService.saveRefreshToken(user.id, refreshToken);
    return {
      status: true,
      expire: 15 * this.minute,
      accessToken,
      refreshToken,
    };
  }

  @HttpCode(200)
  @Post("/logout")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description : "로그아웃을 합니다.",
  })
  public async logout(@Res()res : Response){
    
    const result = await this.authService.logout(res.locals.jwtPayload,res.locals.token);
      return true;

  }
}
