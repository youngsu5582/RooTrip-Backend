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

type ResponseType = FailureResponseType|SuccessResponseType;
export type {GenderType,ResponseType,JwtPayloadType};