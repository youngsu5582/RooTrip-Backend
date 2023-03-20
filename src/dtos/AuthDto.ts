import { IsNotEmpty, IsString } from "class-validator";
type socialType = 'kakao'|'naver'|'google';
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

