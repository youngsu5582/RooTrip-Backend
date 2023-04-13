import { IsArray, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { Photo } from "../entities";

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  first: string;

  @IsString()
  second: string;

  @IsString()
  third: string;

  @IsString()
  fourth: string;

  coordinate: {
    x: string;
    y: string;
  };
}
