import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { articleType, photoType } from "../types";

export class CreatePostDto {
  @IsNotEmpty()
  @IsObject()
  public article: articleType;

  @IsNotEmpty()
  @IsArray()
  public newPhotos: photoType[];

  @IsNotEmpty()
  @IsArray()
  public routes : number[];
}




export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public content: string;
}

export class CreateRatingDto{

  @IsNotEmpty()
  @IsString()
  public postId: string;
  
  @IsNotEmpty()
  @IsNumber()
  public rating : number;
}

export class CreateCommentDto{
  @IsNotEmpty()
  @IsString()
  public comment : string;
}


