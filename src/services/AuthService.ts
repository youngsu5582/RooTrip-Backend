import  { Service } from "typedi";
import { CreateUserDto, LoginUserDto } from "../dtos/UserDto";
import { UserRepository } from "../repositories";
import { ResponseType } from "../common";
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
            result = {status:'ok',message:'회원가입 성공',user};
        else    
            result = {status:'nok',message:'회원가입에 실패했습니다.'};
        return result;
    }
    public async localLogin(loginUserDto : LoginUserDto){
        const {email,password} = loginUserDto;
        const user = await this.userRepository.findOne({where:{email}});
        
        if(user){
            if(await user.comparePassword(password))
                return {status:'ok',user:user};
            else
                return {status:'nok',message:'비밀번호가 일치하지 않습니다.'};
        }
        else{
            return {status:'nok',message:'해당 이메일이 없습니다.'}
        }
    }
}