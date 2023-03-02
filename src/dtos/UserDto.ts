import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostDto{
    @IsNotEmpty()
    @IsString()
    
    public email : string;


    @IsNotEmpty()
    @IsString()
    public content: string;

    
}