import { IsNotEmpty, IsString, Matches } from "class-validator";


type checkType = 'email'|'nickname';

export class CheckDto{
    @IsNotEmpty()
    @IsString()
    public type : checkType;

    @IsNotEmpty()
    @IsString()
    public data : string;
}