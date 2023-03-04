import { User } from "../entities";

type GenderType = 'male'|'female'|'lesbian';

type FailureResponseType = {
    status:'nok';
    httpCode ?: number;
    message ?: string;
    
}

type SuccessResponseType = {
    status:'ok';
    httpCode ?: number;
    message ?: string;
    data?:unknown;
    user?: User;
}

type ResponseType = FailureResponseType|SuccessResponseType;
export type {GenderType,ResponseType};