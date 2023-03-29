import {Service} from 'typedi';
import {Body, HttpCode, JsonController, Post , Res} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {AuthService} from '../services';
import {Response} from "express";
import {LoginUserDto} from '../dtos/UserDto';
import {SocialLoginType} from '../common';
import { generateToken } from '../utils/jwToken';
import { SocialDto } from '../dtos/AuthDto';
@JsonController('/auth')
@Service()
export class LoginController{
    constructor(private readonly authService: AuthService) {}
    private readonly minute = 60;
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
    @Post("/social")
    @OpenAPI({
      description : "소셜을 통해 로그인을 합니다.",
    })
    public async socialLogin(@Body() socialDto: SocialDto, @Res() res:Response) {
      let data : SocialLoginType;
      const {code,provider} = socialDto;
      console.log(socialDto);
      if(provider==='kakao')
        data = await this.authService.kakaoLogin(code);
      else if (provider==='naver')
        data = await this.authService.naverLogin(code);
      else
        data = await this.authService.googleLogin(code);  
      console.log(data);
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
}