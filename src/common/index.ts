import { GoogleUserDto, KakaoUserDto, NaverUserDto } from "../dtos/UserDto";
import { User } from "../entities";

type GenderType = "m" | "w" | "";
type FailureResponseType = {
  status: false;
  httpCode?: number;
  message?: string;
};
type SuccessResponseType = {
  status: true;
  httpCode?: number;
  message?: string;
  data?: unknown;
  user?: User;
};

type CoordinateType = {
  longitude: string;
  latitude: string;
};
type ResponseType = FailureResponseType | SuccessResponseType;
type SocialLoginType = GoogleUserDto | KakaoUserDto | NaverUserDto;
type CustomJwtPayload = {
  [key: string]: any;
  userId: string;
  iat: number;
  exp: number;
};

type checkType = "email" | "nickname";
export type {
  GenderType,
  ResponseType,
  CoordinateType,
  SocialLoginType,
  CustomJwtPayload,
  checkType
};
