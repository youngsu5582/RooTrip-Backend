import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { CoordinateType } from "../common";

type photoType = {
  image_url: string;
  coordinateType: CoordinateType;
};
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsArray({})
  public photos: photoType[];

  @IsNotEmpty()
  @IsString()
  public content: string;
}

export class UpdatePostDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public content: string;
}
