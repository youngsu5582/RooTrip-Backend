import  { Service } from "typedi";
import { CreateUserDto, LoginUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { ResponseType } from "../common";
import { env } from "../loaders/env";
import axios from "axios";

@Service()
export class AuthService{
    private userRepository :typeof UserRepository
    constructor(){
        this.userRepository = UserRepository;
    };
    public async localRegister(createUserDto : CreateUserDto){
        const entity = createUserDto.toEntity();
        const user = await this.userRepository.save(entity);
        let result:ResponseType;
        if(user)
            result = {status:true,message:'회원가입 성공'};
        else    
            result = {status:false,message:'회원가입에 실패했습니다.'};
        return result;
    }
    public async localLogin(loginUserDto : LoginUserDto){
        const {email,password} = loginUserDto;  
        const user = await this.userRepository.findOne({where:{email}});
        console.log(user);
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
        return await this.userRepository.findOne({where:{id,refreshToken}});
    }
    public async saveRefreshToken(id:string,refreshToken : string){
        return await this.userRepository.update({id},{refreshToken});
    }
    public async checkEmail(email:string){
        return Boolean(!await this.userRepository.findOne({where:{email:email}}));
    }
    public async checkNickname(nickname:string){
        return Boolean(!await this.userRepository.findOne({where:{nickname:nickname}}));
    }

    public async kakaoLogin(code:string) {
        const token = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
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

        const kakaoUserInfo = await axios.post('https://kapi.kakao.com/v2/user/me',{},{
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded;charset",
                "Authorization" : 'Bearer ' + token.data.access_token
            }
        })
        return kakaoUserInfo;
    }
    
    public async naverLogin(code:string) {
        const token = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${env.key.NaverClientId}&client_secret=${env.key.NaverClientSecret}&code=${code}&state=state`,{},{})
        
        const naverUserInfo = await axios.get('https://openapi.naver.com/v1/nid/me',{
            headers:{
                "Authorization" : `Bearer ${token.data.access_token}`
            }
        })
        return naverUserInfo;
}
    

}