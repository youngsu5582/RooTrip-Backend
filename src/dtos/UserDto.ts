import { IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MinLength } from "class-validator";
import { User } from "../entities";
type GenderType = 'male'|'female'|'lesbian';

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

    @IsPhoneNumber()
    public phoneNumber : string;

    @IsDateString()
    public date : string;
    
    public gender : GenderType;

    public toEntity(){
        console.log(this);
        const user = new User();

        
        return user;
    }
    
       
}
    
