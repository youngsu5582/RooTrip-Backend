import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Post } from "../entities";


export class CreatePostDto{
    @IsNotEmpty()
    @IsString()
    
    public title : string;


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
export class LikePostDto{
    @IsNotEmpty()
    @IsString()
    public userId : string;


    @IsNotEmpty()
    @IsString()
    public postId: string;
}

