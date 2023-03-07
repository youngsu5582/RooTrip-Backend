import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";
import { User } from "../entities";
import { GenderType } from "../common";


export class CreateUserDto{
    @IsNotEmpty()
    @IsEmail()
    public email : string;


    @IsNotEmpty()
    @Matches(/^[가-힣]{2,}$/)
    public name : string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\dㄱ-ㅎㅏ-ㅣ가-힣].{2,}$/)
    public nickname: string;

    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]*$/, {message: 'password too weak'})
    public password: string;

    
    public gender : GenderType;

    public toEntity(){
        const {email,name,
            nickname,password,gender} = this;
        const user = new User();
        user.email = email;
        user.name = name;
        user.nickname = nickname;
        user.password = password;
        
        
        user.gender = gender;   
        user.refreshToken = "";
        return user;
    }
}
    
export class LoginUserDto{
    @IsNotEmpty()
    @IsEmail()
    public email : string;

    @IsNotEmpty()
    @IsString()
    public password : string;


}