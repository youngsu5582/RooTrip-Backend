import { IsNotEmpty, IsString } from "class-validator";


export class CreatePostDto{
    @IsNotEmpty()
    @IsString()
    public title : string;


    @IsNotEmpty()
    @IsString()
    public content: string;
}

export class UpdatePostDto{
    @IsNotEmpty()
    @IsString()
    public title : string;


    @IsNotEmpty()
    @IsString()
    public content: string;
}