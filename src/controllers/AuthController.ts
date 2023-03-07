import {Body,Get,HttpCode,JsonController,Post,QueryParams,Res,UseBefore, QueryParam, Render} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto, LoginUserDto } from '../dtos/UserDto';

import { Response} from 'express';
import { generateAccessToken, generateRefreshToken, generateToken } from '../utils/jwToken';
import {  checkRefreshToken } from '../middlewares/AuthMiddleware';
import { CheckDto } from '../dtos/AuthDto';
import {env} from '../loaders/env';


@JsonController('/auth')
@Service()
export class AuthController{
    constructor(private authService:AuthService){};

    @HttpCode(200)
    @Post('/register')
    @OpenAPI({
        description : '회원가입을 진행합니다'
    })
    @UseBefore()
    public async register(@Body()createUserDto : CreateUserDto,@Res() res :Response){
        const result = await this.authService.localRegister(createUserDto);
        if(result.status===false){
            return res.status(200).send(result.message);
        }
        else{
            return result;
        }   
    }

    
    @HttpCode(200)
        @Post('/login')
        @OpenAPI({
        description:'로그인을 진행합니다'
    })
    @UseBefore()
    public async login(@Body() loginUserDto : LoginUserDto,@Res() res:Response){
        const result = await this.authService.localLogin(loginUserDto);
        
        if(result.status===false){
            return res.status(200).send(result);
        }
        const user = result.user!;
        const {accessToken,refreshToken} = generateToken(user);
        await this.authService.saveRefreshToken(user.id,refreshToken);
        return {
            status:result.status,
            accessToken,
            refreshToken,
        }
    }
    @HttpCode(200)
    @Post('/token/reissue')
    @OpenAPI({
        description:'토큰을 재발급 받습니다.',
        responses:{
            "401":{
                description : "Unauthorized"
            }
        },
        security:[{bearerAuth : []}],
    })
    @UseBefore(checkRefreshToken)
    public async refresh(@Res() res:Response){
        const userId = res.locals.jwtPayload.userId;
        const refreshToken = res.locals.token;
    
        const user = await this.authService.validateUserToken(userId, refreshToken);
        if (!user) {
            return res.status(401).send({
                status :false,
                message: "유저 정보와 RefreshToken이 일치하지 않습니다.",
            });
          }
          const accessToken = generateAccessToken(user);
        return {
            accessToken
        }
    }
    @HttpCode(200)
    @Get("/check")
    @OpenAPI({
        description : '이메일 중복확인을 합니다.'
    })
    public async check(@QueryParams()checkQuery:CheckDto){

        const {check,value} = checkQuery;
        //Error 처리 해야함. + Refactoring
        if(check==='email')
            return await this.authService.checkEmail(value);
        else if(check==='nickname')
            return await this.authService.checkNickname(value);
        else
            return;
            
    }

    @HttpCode(200)
    @Get('/kakao/callback')
    public async kakaoLoginUser(@QueryParam ('code') code: string) {
        console.log(code);
        console.log(env.key.kakaoRestApi);
        console.log(env.key.kakaoRedirectUri);
        const kakaoInfo = await this.authService.kakaoLogin(code);
        console.log(kakaoInfo.data.kakao_account.profile);
        return kakaoInfo;
    }

    @HttpCode(200)
    @Get('/naver/callback')
    public async naverLogin(@QueryParam('code') code: string) {
        const naverInfo = await this.authService.naverLogin(code);
        console.log(naverInfo);
        return naverInfo;
    }

}