import {
  IsOptional,
    IsString,
  } from "class-validator";
  
  export class ProfileDto {
    @IsString()
    @IsOptional()
    public profileImage: string;
    
    @IsString()
    @IsOptional()
    public tagLine: string;
}