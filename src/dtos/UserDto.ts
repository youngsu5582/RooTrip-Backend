import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength
} from "class-validator";
import { User } from "../entities";
import { GenderType } from "../common";

class UserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[가-힣]{2,}$/)
  public name: string;
}
export class NaverUserDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsEmail()
  public email: string;

  @IsString()
  public gender: GenderType;
}

export class KakaoUserDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
export class GoogleUserDto extends UserDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
export class LocalUserDto extends UserDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,8}$/)
  public nickname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()/])[A-Za-z\d`~!@#$%^&*()/]{8,16}$/,
    { message: "password too weak" }
  )
  public password: string;

  public gender: GenderType;
}
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
