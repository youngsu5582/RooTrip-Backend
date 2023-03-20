import  { Service } from "typedi";

import { GoogleUserDto, KakaoUserDto, LocalUserDto, NaverUserDto, LoginUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { CustomJwtPayload, ResponseType, SocialLoginType } from "../common";
import { env } from "../loaders/env";
import axios from "axios";
import { addBlacklist } from "../utils/Redis";
import {encrypt} from '../utils/Crypto';
const key = env.key;

@Service()
export class AuthService{
    private readonly _userRepository :typeof UserRepository
    constructor(){
        this._userRepository = UserRepository;
    };
    public async register(createUserDto : LocalUserDto){
        let result:ResponseType;
        const email = createUserDto.email;
        if(await this._userRepository.getByEmail(email)){
            result = {
                status:false,
                message:'이메일이 중복입니다.'
            }
            return result;
        }
        const entity = createUserDto.toEntity();
        const user = await this._userRepository.save(entity);
        if(user)
            result = {status:true,message:'회원가입 성공'};
        else    
            result = {status:false,message:'회원가입에 실패했습니다.'};
        return result;
    }
    public async localLogin(loginUserDto : LoginUserDto){
        const {email,password} = loginUserDto;  
        const user = await this._userRepository.findOne({where:{email}});
        let result:ResponseType;
        if(user){
            if(await user.comparePassword(password))
                result = {status:true,user};
            else
                result =  {status:false,message:'비밀번호가 일치하지 않습니다.'};
        }
        else{
            result =  {status:false,message:'해당 이메일이 없습니다.'}
        }
        return result;
    }
    public async validateUserToken(id : string,refreshToken : string){
        return await this._userRepository.findOne({where:{id,refreshToken}});
    }
    public async saveRefreshToken(id:string,refreshToken : string){
        return await this._userRepository.update({id},{refreshToken});
    }
    public async checkDuplicateEmail(email:string){
        return Boolean(!await this._userRepository.getByEmail(email));
    }
    public async checkDuplicateNickname(nickname:string){
        return Boolean(!await this._userRepository.findOne({where:{nickname:nickname}}));
    }
    public async kakaoLogin(code:string) {
        const accessToken = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            params:{
                grant_type: 'authorization_code',
                client_id: env.key.kakaoRestApi,
                code,
                redirect_uri : env.key.kakaoRedirectUri
            }
        })
        .then(res=>res.data.access_token)
        .catch(()=>(null));
        const userInfo = await axios.post('https://kapi.kakao.com/v2/user/me',{},{
            headers: {  
                "Content-Type" : "application/x-www-form-urlencoded;charset",
                "Authorization" : 'Bearer ' + accessToken
            }
        })
        .then(res=>res.data)
        .catch(()=>(null));
        const result : KakaoUserDto = {
            id: userInfo.id,
            name: userInfo.properties.nickname,
            toEntity : KakaoUserDto.prototype.toEntity,
        }
        return result;
    }
    public async naverLogin(code:string) {
        const naverTokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${key.NaverClientId}&client_secret=${key.NaverClientSecret}&code=${code}&state=state`;
        const accessToken = await axios.post(naverTokenUrl,{},{})
        .then(res=>res.data.access_token)
        .catch(()=>(null));
        const userInfo:any = await axios.get('https://openapi.naver.com/v1/nid/me',{
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        }).then(res=>(res.data.response))
        .catch(()=>(null));
        const id = encrypt(userInfo.id);
        const result :NaverUserDto = {
            id,
            name : userInfo.name,
            gender : userInfo.gender,
            email: 'n_'+userInfo.email,
            toEntity : NaverUserDto.prototype.toEntity,
        }
        return result;
    }
    public async googleLogin(code:string){
        let userInfo:any;
        const result : GoogleUserDto = {
            
            id:userInfo.id ,
            name : userInfo.name,
            toEntity : GoogleUserDto.prototype.toEntity,
        }
        return result;
    }
    public async getUserById(id:string){
        return await this._userRepository.getById(id);
    }
    public async socialRegister(createUserDto : SocialLoginType){
        const entity = createUserDto.toEntity();
        
        const user = await this._userRepository.save(entity);
        let result:ResponseType ; 
        if(user)
            result = {status:true,user};
        else    
            result = {status:false,message:'회원가입에 실패했습니다.'};
        return result;
    }
    public async logout(jwtPayload : CustomJwtPayload,token:string){
        const expiresIn = jwtPayload.exp - jwtPayload.iat;
        await addBlacklist(token,expiresIn);
        return await this._userRepository.deleteRefreshTokenById(jwtPayload.userId);
    }
}