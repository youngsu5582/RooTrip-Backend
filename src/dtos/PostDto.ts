import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";
type photoType = {
  id:number;
  feedOrder : number;
  fileName:string;
  image_url: string;
  dateTime : Date;
  latitude : string;
  longitude : string;
};
type articleType = {
  title : string;
  content : string;
}
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
