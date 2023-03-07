import { IsNotEmpty, IsString, Matches } from "class-validator";


type checkType = 'email'|'nickname';

export class CheckDto{
    @IsNotEmpty()
    @IsString()
    public check : checkType;

    @IsNotEmpty()
    @IsString()
    public value : string;
}