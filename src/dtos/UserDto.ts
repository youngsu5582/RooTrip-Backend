import { IsDate, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";
import { User } from "../entities";
import { GenderType } from "../common";


export class CreateUserDto{
    @IsNotEmpty()
    @IsEmail()
    public email : string;


    @IsNotEmpty()
    @IsString()
    public nickname: string;

    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    public password: string;

    @IsPhoneNumber("KR")
    public phoneNumber : string;

    @IsDateString()
    public birth : Date;
    
    public gender : GenderType;

    public toEntity(){
        const {email,nickname,password,phoneNumber,birth,gender} = this;
        const user = new User();
        user.email = email;
        user.nickname = nickname;
        user.password = password;
        user.phoneNumber = phoneNumber;
        user.birth = birth;
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