import { IsNotEmpty, IsString } from "class-validator";


export class TestDto{
    @IsNotEmpty()
    @IsString()
    public test : string;
}