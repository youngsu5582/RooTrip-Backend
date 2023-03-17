    import {  IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { User } from "../entities";
import { GenderType } from "../common";

class UserDto {
    @IsString()
    @IsNotEmpty()  
    @Matches(/^[가-힣]{2,}$/)
    public name : string;

}
export class NaverUserDto extends UserDto{
    @IsString()
    @IsNotEmpty()  
    public id : string;

    @IsEmail()
    public email : string;

    @IsString()
    public gender : GenderType;
    public toEntity(){
        const {id,name,gender,email} = this;
        const user = new User();
        user.id = id;
        user.name = name;
        user.gender = gender;
        user.email = email;
        return user;

    }
}

export class KakaoUserDto extends UserDto{
    @IsString()
    @IsNotEmpty()  
    public id : string;
    public toEntity(){
        const {id,name} = this;
        const user = new User();
        user.id = id;
        user.name = name;
        
        return user;
    }
}
export class GoogleUserDto extends UserDto{
    @IsString()
    @IsNotEmpty()  
    public id : string;
    public toEntity(){
        const {id,name} = this;
        const user = new User();
        
        user.id = id;
        user.name = name;
        return user;
    }
}


export class LocalUserDto extends UserDto{


    @IsNotEmpty()
    @IsEmail()
    public email : string;


    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,8}$/)
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