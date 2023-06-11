import { IsArray,  IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import {  articleType, photoType } from "../types";


export class CreatePostDto {
  @IsNotEmpty()
  @IsObject({each:true})
  public article: articleType;

  @IsNotEmpty()
  @IsArray()
  public newPhotos: photoType[];

  @IsNotEmpty()
  @IsArray()
  public routes : number[];

}
export class ViewType{
  @IsString()
  viewType: string;
}

export class RegionType extends ViewType{
  @IsString()
  viewType: "region";

}

export class CityType extends ViewType {
  @IsString()
  viewType: "city";
  @IsString()
  polygon?: string;
  @IsNumber()
  markerCount ?: number;
  
}
 
export class GetPostsDto {
  public viewType : ViewType;
  public visibility : string;
  
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




