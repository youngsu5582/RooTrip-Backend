    import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto, LoginUserDto } from '../dtos/UserDto';

import {Request, Response} from 'express';
import { generateAccessToken, generateRefreshToken, generateToken } from '../utils/jwToken';


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
        if(result.status==='nok'){
            return res.status(200).send(result.message);
        }
        else{
            const user = result.user!;
            const {accessToken,refreshToken} = generateToken(user);
            return{
                accessToken,
                
            }
        }
        
        
    }

    
    @HttpCode(200)
        @Post('/login')
        @OpenAPI({
        description:'로그인을 진행합니다'
    })
    public async login(@Body() loginUserDto : LoginUserDto,@Res() res:Response){
        const result = await this.authService.localLogin(loginUserDto);
        if(result.status==='nok'){
            return res.status(200).send(result.message);
        }
        const user = result.user!;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);    
        return {
            accessToken,
            
        }
    }
}