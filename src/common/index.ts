import { GoogleUserDto, KakaoUserDto, NaverUserDto } from "../dtos/UserDto";
import { User } from "../entities";

type GenderType = 'm'|'w';

type FailureResponseType = {
    status:false;
    httpCode ?: number;
    message ?: string;
    
}

type SuccessResponseType = {
    status:true;
    httpCode ?: number;
    message ?: string;
    data?:unknown;
    user?: User;
}

type JwtPayloadType = {
    [key: string]: any;
    userId : string;
    userEmail : string;
}
type Coordinate = {
    longitude : string;
    latitude : string;
}


type ResponseType = FailureResponseType|SuccessResponseType;
type SocialLoginType = GoogleUserDto | KakaoUserDto | NaverUserDto;
type CustomJwtPayload = {
    userId:string;
    iat:number;
    exp:number;
}
export type {GenderType,ResponseType,JwtPayloadType,Coordinate , SocialLoginType,CustomJwtPayload};