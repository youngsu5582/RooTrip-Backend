    import {Body, Delete, Get, HttpCode, JsonController, Param, Patch, Post, QueryParam, Req, Res, Session, SessionParam, UseBefore} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthService } from '../services';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto } from '../dtos/UserDto';
import { checkLogin } from '../middlewares/AuthMiddleware';


@JsonController('/auth')
@Service()
export class AuthController{
    constructor(private authService:AuthService){};

    @HttpCode(200)
    @Post('/register')
    @OpenAPI({
        description : '회원가입을 진행합니다'
    })
    @UseBefore(checkLogin)
    public async register(@Body()createUserDto : CreateUserDto){
        const result = await this.authService.localRegister(createUserDto);
        

        return result;    
    }

    @HttpCode(200)
    @Post('/login')
    @OpenAPI({
        description:'로그인을 진행합니다'
    })
    public async login(){
        
    }
}