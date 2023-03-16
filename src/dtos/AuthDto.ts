import { IsNotEmpty, IsString, Matches } from "class-validator";


type checkType = 'email'|'nickname';
type socialType = 'kakao'|'naver'|'google';
export class CheckDto{
    @IsNotEmpty()
    @IsString()
    public type : checkType;

    @IsNotEmpty()
    @IsString()
    public data : string;
}
export class SocialDto{
    @IsNotEmpty()
    @IsString()
    public provider : socialType;

    @IsNotEmpty()
    @IsString()
    public code : string;
}

export class EmailVerifyDto{

    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public verifyNumber : string;
}

export class SocialLoginDto{
    
}

