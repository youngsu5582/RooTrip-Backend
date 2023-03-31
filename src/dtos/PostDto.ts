import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Post } from "../entities";
import { CoordinateType } from "../common";

type photoType = {
    image_url : string;
    coordinateType : CoordinateType;
}
export class CreatePostDto{
    @IsNotEmpty()
    @IsString()
    
    public title : string;

    @IsNotEmpty()
    @IsArray({})
    public photos : photoType[];

    @IsNotEmpty()
    @IsString()
    public content: string;

    public toEntity(userId:string): Post {
        const {title,content} = this;
        const post = new Post();
        post.title = title;
        post.content = content;
        post.userId = userId;
        return post;
      }
}

export class UpdatePostDto{
    @IsNotEmpty()
    @IsString()
    public title : string;


    @IsNotEmpty()
    @IsString()
    public content: string;
}
