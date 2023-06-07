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
import { Service } from "typedi";
import { AuthService } from "../services";
import { OpenAPI } from "routing-controllers-openapi";
import { LocalUserDto } from "../dtos/UserDto";
import { Request, Response } from "express";
import { generateAccessToken } from "../utils/jwToken";
import {
  checkAccessToken,
  checkRefreshToken
} from "../middlewares/AuthMiddleware";
import { checkType } from "../common";
import {  isErrorCheck } from "../errors";
import { createErrorForm, createResponseForm } from "../interceptors/Transformer";
import typia from "typia";
import { ALREADY_EXISTED_EMAIL, TOKEN_NOT_MATCH_USER } from "../errors/auth-error";
import { TryCatch } from "../types";
import { DB_CONNECT_FAILED } from "../errors/common-error";
@JsonController("/auth")
@Service()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly minute = 60;
  @HttpCode(201)
  @Post("/register")
  @OpenAPI({
    summary: "로컬 사용자 회원가입",
    description: "제공된 정보를 가지고 로컬 사용자 회원가입을 진행합니다",
    tags: ["Auth"],
    responses: {
      "201": {}
    }
  })
  public async register(@Body() userDto: LocalUserDto) : Promise<TryCatch<undefined,ALREADY_EXISTED_EMAIL>> 
  {
    const result = await this.authService.register(userDto);
    if(isErrorCheck(result))
      return createErrorForm(result);
    return createResponseForm(undefined);
  }

  @HttpCode(201)
  @Post("/token/reissue")
  @OpenAPI({
    description: "토큰을 재발급 받습니다.",
    responses: {
      "401": {
        description: "Unauthorized"
      }
    },
    security: [{ bearerAuth: [] }]
  })
  @UseBefore(checkRefreshToken)
  public async refresh(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.jwtPayload.userId;
    const refreshToken = req.user.token;
    const user = await this.authService.validateUserToken(userId, refreshToken);
    if (!user) 
      return res.status(403).json(typia.random<TOKEN_NOT_MATCH_USER>());
    const accessToken = generateAccessToken(user);
    const data = {
      expire: 15 * this.minute,
      accessToken
    };
    return createResponseForm(data);
  }
  @HttpCode(200)
  @Get("/check")
  @OpenAPI({
    description: "이메일 , 닉네임 중복확인을 합니다."
  })
  public async check(
    @QueryParam("type") type: checkType,
    @QueryParam("data") data: string
  ) {
  let isDuplicated : boolean;
  
    if (type === "email")
      isDuplicated =  await this.authService.checkDuplicateEmail(data);
    else if (type === "nickname")
      isDuplicated = await this.authService.checkDuplicateNickname(data);
    else return createErrorForm(typia.random<DB_CONNECT_FAILED>());
    return {status:isDuplicated,message:isDuplicated?undefined:"중복입니다."};
    
  }
  @HttpCode(201)
  @Post("/logout")
  @UseBefore(checkAccessToken)
  @OpenAPI({
    description: "로그아웃을 합니다."
  })
  public async logout(@Req() req: Request) {
    const {jwtPayload,token} = req.user;
    const result = await this.authService.logout(
      jwtPayload,token
    );
    if(isErrorCheck(result))
      return result;
    return createResponseForm(undefined); 
  }
}
